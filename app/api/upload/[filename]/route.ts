// app/api/upload/[filename]/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    const filename = (await params).filename

    if (!filename) {
        return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'uploads', filename);

    try {
        // Прочитуємо файл без попередньої перевірки
        const file = await fs.readFile(filePath);

        // Використовуємо функцію getContentType для визначення MIME-типу
        const contentType = getContentType(filename);

        return new NextResponse(file, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch (error) {
        console.error('Error serving file:', error);
        return NextResponse.json({ error: 'Error serving file' }, { status: 500 });
    }
}

// Функція для визначення MIME-типу за розширенням
function getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        // Додати інші типи за необхідністю
    };

    return mimeTypes[ext] || 'application/octet-stream';
}
