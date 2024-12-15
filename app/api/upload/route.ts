import { NextRequest, NextResponse } from 'next/server';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import path from 'path';
import Busboy from 'busboy'; // npm install busboy @types/busboy
import { Readable } from 'stream';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid'; // Для генерації унікальних ідентифікаторів

const pipelineAsync = promisify(pipeline);

const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/ogg'
]; // Дозволені формати для зображень та відео
const UPLOAD_DIR = path.join(process.cwd(), 'uploads'); // Директорія для збереження файлів

// Асинхронне створення директорії
const createUploadDir = async () => {
    try {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        await fs.mkdir(path.join(UPLOAD_DIR, 'series'), { recursive: true }); // Підкаталог для відео
    } catch (err) {
        console.error('Error creating upload directory:', err);
    }
};

// Функція для конвертації ReadableStream у Node.js Stream
function convertToNodeStream(readableStream: ReadableStream): NodeJS.ReadableStream {
    const nodeStream = new Readable({
        read() {},
    });

    (async () => {
        const reader = readableStream.getReader();
        let done = false;

        while (!done) {
            const { value, done: readerDone } = await reader.read();
            if (value) {
                nodeStream.push(value);
            }
            done = readerDone;
        }

        nodeStream.push(null);
    })();

    return nodeStream;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const contentType = req.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    try {
        if (!req.body) {
            return NextResponse.json({ error: 'Request body is empty' }, { status: 400 });
        }

        // Асинхронно створюємо директорію завантажень
        await createUploadDir();

        // Конвертуємо ReadableStream у Node.js Stream
        const bodyStream = convertToNodeStream(req.body);

        const filePromises: Promise<void>[] = [];
        const busboy = Busboy({ headers: { 'content-type': contentType } });

        let uploadedFileUrl: string | null = null; // Змінна для зберігання URL файлу

        busboy.on('file', (fieldname: string, file: NodeJS.ReadableStream, fileData: { filename: string, encoding: string, mimeType: string }) => {
            const { filename, encoding, mimeType } = fileData;

            // Перевірка на тип файлу
            if (!ALLOWED_FILE_TYPES.includes(mimeType)) {
                file.resume(); // Пропускаємо файл, якщо його тип не дозволено
                console.log(`Skipping file: ${filename} with mimetype: ${mimeType}`);
                return;
            }

            // Генерація унікального імені файлу
            const uniqueFilename = `${uuidv4()}-${filename.replace(/[^a-z0-9_\-\.]/gi, '_')}`;

            // Зберігаємо відео файли у підкаталозі 'series'
            const fileDirectory = mimeType.startsWith('video/') ? 'series' : '';
            const filePath = path.join(UPLOAD_DIR, fileDirectory, uniqueFilename);

            console.log('Saving file to:', filePath);

            // Формуємо URL для повернення клієнту
            uploadedFileUrl = `/uploads/${fileDirectory ? 'series/' : ''}${uniqueFilename}`;

            filePromises.push(pipelineAsync(file, createWriteStream(filePath)));
        });

        bodyStream.pipe(busboy);

        await new Promise((resolve, reject) => {
            busboy.on('finish', resolve);
            busboy.on('error', reject);
        });

        await Promise.all(filePromises);

        if (!uploadedFileUrl) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Повертаємо URL файлу після успішного завантаження
        return NextResponse.json({ message: 'Upload successful', fileUrl: uploadedFileUrl });
    } catch (error) {
        console.error('Error while uploading file:', error);
        return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
    }
}
