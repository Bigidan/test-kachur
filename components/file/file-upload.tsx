"use client"

import React, { useState } from 'react';
import {Input} from "@/components/ui/input";
import Image from "next/image";

export default function FileUpload() {
    const [progress, setProgress] = useState<number | null>(null);
    const [message, setMessage] = useState<string>('');
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setMessage('No file selected');
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
                setMessage('File uploaded successfully!');
                setUploadedFileUrl(response.fileUrl); // Отримуємо URL файлу
            } else {
                setMessage(`Upload failed: ${xhr.responseText}`);
            }
            setProgress(null); // Скидаємо прогрес після завершення
        };

        // Обробка помилок
        xhr.onerror = () => {
            setMessage('An error occurred during the upload');
            setProgress(null);
        };

        // Відправка файлу
        xhr.open('POST', '/api/upload'); // Ваш маршрут завантаження
        xhr.send(formData);
    };

    return (
        <div>
            <Input type="file" onChange={handleFileUpload} />
            {progress !== null && <p>Uploading: {progress}%</p>}
            {message && <p>{message}</p>}
            {uploadedFileUrl && (
                <div>
                    <p>Uploaded File:</p>
                    <Image src={uploadedFileUrl} alt="Uploaded file" height={200} width={200} />
                </div>
            )}
        </div>
    );
}
