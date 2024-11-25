import { useState } from 'react';

interface UploadPhotoProps {
    id: string;       // Параметр id
    number: string;   // Параметр number
}

export default function UploadPhoto({ id, number }: UploadPhotoProps) {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) {
            console.log("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append('photo', file);
        formData.append('id', id);           // Передаємо id у formData
        formData.append('number', number);   // Передаємо number у formData

        try {
            const response = await fetch('http://localhost/uploadImage.php', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                // console.log("File uploaded successfully.");
            } else {
                // console.log("File upload failed.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload Photo</button>
            </form>
        </div>
    );
}
