"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { addFileToBase } from "@/lib/db/admin";

interface MusicUploadProps {
    onFileUpload?: (fileUrl: string | null) => void;
    fileName: string;
}

export default function MusicUpload({ onFileUpload, fileName }: MusicUploadProps) {
    const [progress, setProgress] = useState<number | null>(null);
    const [message, setMessage] = useState<string>("");

    const addToDB = async (url: string) => {
        return await addFileToBase(fileName.toLowerCase(), url, 0);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setMessage("Файл не обрано");
            onFileUpload?.(null);
            return;
        }

        // Allowable music file types
        const allowedTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac"];
        if (!allowedTypes.includes(file.type)) {
            setMessage("Будь ласка, оберіть правильний музичний файл (MP3, WAV, OGG, FLAC)");
            onFileUpload?.(null);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setProgress(percentComplete);
            }
        };

        // Handle upload completion
        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                setMessage("Файл успішно завантажено!");

                addToDB(response.fileUrl);

                // Trigger callback with file URL
                onFileUpload?.(response.fileUrl);
            } else {
                setMessage(`Помилка завантаження: ${xhr.responseText}`);
                onFileUpload?.(null);
            }
            setProgress(null); // Reset progress after completion
        };

        // Handle errors
        xhr.onerror = () => {
            setMessage("Сталася помилка під час завантаження");
            setProgress(null);
            onFileUpload?.(null);
        };

        // Send file to upload endpoint
        xhr.open("POST", "/api/upload"); // Update to your upload route
        xhr.send(formData);
    };

    return (
        <div className="col-span-3">
            <Input
                type="file"
                accept="audio/mpeg,audio/wav,audio/ogg,audio/flac"
                onChange={handleFileUpload}
            />
            {progress !== null && <p>Завантаження: {progress}%</p>}
            {message && <p>{message}</p>}
        </div>
    );
}
