// app/api/series/[filename]/route.ts
import {NextResponse} from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import {createReadStream} from 'fs';
import {ReadStream} from "node:fs";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    const filename = (await params).filename

    if (!filename) {
        return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const videoFilePath = path.join(process.cwd(), 'uploads', 'series', filename);

    // Перевірка наявності файлу
    if (!await isFileExists(videoFilePath)) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const contentType = getContentType(filename);

    // Перевірка заголовка Range
    const range = request.headers.get('Range');
    if (range) {
        // Якщо є заголовок Range, обробляємо поточне завантаження
        return streamFile(videoFilePath, range, contentType);
    }

    // Якщо Range немає, просто відправляємо весь файл
    return streamFile(videoFilePath, null, contentType);
}

// Функція для перевірки наявності файлу
async function isFileExists(filePath: string) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

function readableStream(fileStream: ReadStream) {
    return new ReadableStream({
        start(controller) {
            let isClosed = false;

            const dataHandler = (chunk: Buffer) => {
                if (!isClosed) {
                    try {
                        controller.enqueue(chunk);
                    } catch (_) {
                        isClosed = true;
                        fileStream.destroy();
                    }
                }
            };

            const endHandler = () => {
                if (!isClosed) {
                    isClosed = true;
                    controller.close();
                }
            };

            const errorHandler = (err: Error) => {
                if (!isClosed) {
                    isClosed = true;
                    controller.error(err);
                }
            };

            fileStream.on('data', dataHandler);
            fileStream.on('end', endHandler);
            fileStream.on('error', errorHandler);

            // Cleanup to prevent memory leaks
            return () => {
                fileStream.removeListener('data', dataHandler);
                fileStream.removeListener('end', endHandler);
                fileStream.removeListener('error', errorHandler);
                fileStream.destroy();
            };
        }
    });
}

// Потокове відправлення файлу з підтримкою Range
async function streamFile(filePath: string, range: string | null, contentType: string) {
    const stat = await fs.stat(filePath);
    const fileSize = stat.size;

    // If Range is present, handle partial content
    if (range) {
        const rangeMatch = range.match(/bytes=(\d+)-(\d+)?/);
        if (!rangeMatch) {
            return NextResponse.json({ error: 'Invalid Range' }, { status: 416 });
        }

        const start = parseInt(rangeMatch[1], 10);
        const end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize) {
            return NextResponse.json({ error: 'Range not satisfiable' }, { status: 416 });
        }

        const fileStream = createReadStream(filePath, { start, end });
        const contentLength = end - start + 1;

        return new NextResponse(
            readableStream(fileStream),
            {
                status: 206,
                headers: {
                    'Content-Type': contentType,
                    'Content-Length': contentLength.toString(),
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Cache-Control': 'public, max-age=86400',
                },
            }
        );
    }

    // If no Range header, send entire file
    const fileStream = createReadStream(filePath);

    return new NextResponse(
        readableStream(fileStream),
        {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Length': fileSize.toString(),
                'Cache-Control': 'public, max-age=86400',
            },
        }
    );
}

// Функція для визначення MIME-типу за розширенням
function getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
        '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg',
        '.webm': 'video/webm',
        '.ogg': 'video/ogg',
        // Додати інші типи за необхідністю
    };

    return mimeTypes[ext] || 'application/octet-stream';
}
