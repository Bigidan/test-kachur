"use client"

import React, { useState } from 'react';
import {Input} from "@/components/ui/input";
import {addFileToBase} from "@/lib/db/admin";

interface PhotoUploadProps {
    onFileUpload?: (fileUrl: string | null) => void;
    fileName: string;
}

export default function PhotoUpload({ onFileUpload, fileName }: PhotoUploadProps) {
    const [progress, setProgress] = useState<number | null>(null);
    const [message, setMessage] = useState<string>('');

    const addToDB = async (url: string) => {
        return await addFileToBase(fileName.toLowerCase(), url, 0);
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setMessage('Файл не обрано');
            // Викликаємо колбек з null, якщо файл не вибрано
            onFileUpload?.(null);
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setMessage('Будь ласка оберіть правильне зображення (JPEG, PNG, GIF, WebP)');
            onFileUpload?.(null);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();

        // Відстеження прогресу завантаження
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setProgress(percentComplete);
            }
        };

        // Обробка завершення запиту
        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                setMessage('Файл успішно завантажено!');

                addToDB(response.fileUrl);

                // Викликаємо колбек з URL файлу
                onFileUpload?.(response.fileUrl);
            } else {
                setMessage(`Помилка завантаження: ${xhr.responseText}`);
                // Викликаємо колбек з null у разі помилки
                onFileUpload?.(null);
            }
            setProgress(null); // Скидаємо прогрес після завершення
        };

        // Обробка помилок
        xhr.onerror = () => {
            setMessage('Сталася помилка під час завантаження');
            setProgress(null);
            // Викликаємо колбек з null у разі помилки
            onFileUpload?.(null);
        };

        // Відправка файлу
        xhr.open('POST', '/api/upload'); // Ваш маршрут завантаження
        xhr.send(formData);
    };

    return (
        <div className="col-span-3">
            <Input type="file"
                   accept="image/jpeg,image/png,image/gif,image/webp"
                   onChange={handleFileUpload} />
            {progress !== null && <p>Завантаження: {progress}%</p>}
            {message && <p>{message}</p>}
        </div>
    );
}