"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Player from "@/components/player/player";
import {PlayerProvider} from "@/components/player/player-context";

export default function VideoUpload() {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number | null>(null);
    const [message, setMessage] = useState<string>("");
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        processSelectedFile(file);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        processSelectedFile(file);
    };

    const processSelectedFile = (file: File | undefined) => {
        if (file) {
            if (!file.type.startsWith("video/")) {
                setMessage("Будь ласка, оберіть файл, який відповідає критеріям.");
                return;
            }
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
            setMessage("");
        } else {
            setMessage("Файл не обрано.");
        }
    };

    const handleUpload = async () => {
        if (!videoFile) {
            setMessage("Файл не обрано.");
            return;
        }

        const formData = new FormData();
        formData.append("file", videoFile);

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setProgress(percentComplete);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                setMessage("Відео успішно завантажено!");
                setUploadedFileUrl(response.fileUrl);
            } else {
                setMessage(`Помилка завантаження: ${xhr.responseText}`);
            }
            setProgress(null);
        };

        xhr.onerror = () => {
            setMessage("Під час завантаження сталася помилка.");
            setProgress(null);
        };

        xhr.open("POST", "/api/upload");
        xhr.send(formData);
    };

    const handleClearSelection = () => {
        setVideoFile(null);
        setVideoPreview(null);
        setMessage("");
        setProgress(null);
    };

    const preventDefault = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    return (
        <div>
            <div
                onDrop={handleDrop}
                onDragOver={preventDefault}
                onDragEnter={preventDefault}
                className="border-2 border-dashed p-4 text-center cursor-pointer w-full flex justify-center"
                // onClick={() => document.getElementById("fileInput")?.click()}
            >
                {videoPreview ? (
                    <PlayerProvider>
                        <div className="w-full">
                            <Player videoUrl={videoPreview}/>
                        </div>
                    </PlayerProvider>
                ) : (
                    <div onClick={() => document.getElementById("fileInput")?.click()} className="text-center w-full h-full">
                        <p className="p-10">Drag&drop&#39;ніть відео в цю область або натисніть</p>
                    </div>
                )}
            </div>
            <Input
                type="file"
                id="fileInput"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
            />
            {videoFile && (
                <div className="mt-4">
                    <p>
                        <strong>Обране відео:</strong> {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                    {progress !== null && <p>Завантаження: {progress}%</p>}
                </div>
            )}
            {message && <p>{message}</p>}
            <div className="mt-4">
                <Button onClick={handleUpload} disabled={!videoFile} className="btn btn-primary mr-2">
                    Завантажити
                </Button>
                <Button onClick={handleClearSelection} className="btn btn-secondary">
                    Очистити обране
                </Button>
            </div>
            {uploadedFileUrl && (
                <div className="mt-4">
                    <p>Завантажене відео:</p>
                    {/*<video src={uploadedFileUrl} controls width="300" />*/}
                    <Player videoUrl={uploadedFileUrl} />
                </div>
            )}


        </div>
    );
}
