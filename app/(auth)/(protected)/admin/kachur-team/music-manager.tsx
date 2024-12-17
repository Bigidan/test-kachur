import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Link } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    addNewMusic,
    getMusic,
    updateMusic,
    deleteMusic,
    Music
} from '@/lib/db/admin';
import MusicUpload from "@/components/file/music-upload";
import PhotoUpload from "@/components/file/photo-upload";

export function MusicManagement() {
    const [music, setMusic] = useState<Music[]>([]);
    const [newMusicName, setNewMusicName] = useState('');
    const [newMusicDescription, setNewMusicDescription] = useState('');
    const [newMusicImage, setNewMusicImage] = useState('');
    const [newMusicUrl, setNewMusicUrl] = useState('');

    useEffect(() => {
        fetchMusic();
    }, []);

    const fetchMusic = async () => {
        try {
            const data = await getMusic();
            setMusic(data);
        } catch (error) {
            console.error("Помилка при отриманні музики:", error);
        }
    };

    const handleAddMusic = async () => {
        if (newMusicName && newMusicUrl) {
            try {
                await addNewMusic({
                    musicName: newMusicName,
                    musicDescription: newMusicDescription,
                    musicImage: newMusicImage,
                    musicUrl: newMusicUrl
                });
                await fetchMusic();
                // Очищення форми
                setNewMusicName('');
                setNewMusicDescription('');
                setNewMusicImage('');
                setNewMusicUrl('');
            } catch (error) {
                console.error("Помилка при додаванні музики:", error);
            }
        }
    };

    // const handleUpdateMusic = async (musicId: number, updatedData: Partial<Music>) => {
    //     try {
    //         await updateMusic(musicId, updatedData);
    //         await fetchMusic();
    //     } catch (error) {
    //         console.error("Помилка при оновленні музики:", error);
    //     }
    // };

    const handleDeleteMusic = async (musicId: number) => {
        try {
            await deleteMusic(musicId);
            await fetchMusic();
        } catch (error) {
            console.error("Помилка при видаленні музики:", error);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Керування музикою
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[500px]">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Управління музикою</h4>
                        <p className="text-sm text-muted-foreground">
                            Додавайте та редагуйте музичні треки
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="col-span-1">Назва</Label>
                            <Input
                                value={newMusicName}
                                onChange={(e) => setNewMusicName(e.target.value)}
                                placeholder="Назва треку"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="col-span-1">Автори</Label>
                            <Textarea
                                value={newMusicDescription}
                                onChange={(e) => setNewMusicDescription(e.target.value)}
                                placeholder="Автор(и) треку"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="col-span-1">URL Зображення</Label>
                            <Input
                                value={newMusicImage}
                                onChange={(e) => setNewMusicImage(e.target.value)}
                                placeholder="Посилання на зображення"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Файл Зображення</Label>
                            <div className="col-span-3">
                            <PhotoUpload onFileUpload={(fileUrl) => setNewMusicImage(fileUrl || "")}
                                         fileName={newMusicName}/>
                            {newMusicImage && (
                                <>
                                    <Label className="text-right">Завантажений файл:</Label>
                                    <img
                                        src={newMusicImage}
                                        alt="Завантажений файл"
                                        height={50}
                                        width={50}
                                        className="rounded-full"
                                    />
                                </>
                            )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="col-span-1">URL Музики</Label>
                            <Input
                                value={newMusicUrl}
                                onChange={(e) => setNewMusicUrl(e.target.value)}
                                placeholder="Посилання на трек"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="col-span-1">Музика Файл</Label>
                            <div className="col-span-3">
                                <MusicUpload fileName={newMusicName}
                                             onFileUpload={(fileUrl) => setNewMusicUrl(fileUrl || "")}/>
                            </div>
                        </div>
                        <Button
                            onClick={handleAddMusic}
                            disabled={!newMusicName || !newMusicUrl}
                        >
                            <Plus className="mr-2 h-4 w-4"/> Додати трек
                        </Button>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        <h4 className="font-medium">Існуючі треки</h4>
                        {music.map((track) => (
                            <div
                                key={track.musicId}
                                className="flex items-center justify-between border p-2 rounded"
                            >
                                <div className="flex items-center space-x-2 w-full">
                                    {track.musicImage && (
                                        <img
                                            src={track.musicImage}
                                            alt={track.musicName || 'Трек'}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    )}
                                    <div className="flex-grow">
                                        <div className="font-medium">{track.musicName}</div>
                                        {track.musicDescription && (
                                            <div className="text-sm text-muted-foreground">
                                                {track.musicDescription}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {track.musicUrl && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => window.open(track.musicUrl || "", '_blank')}
                                            >
                                                <Link className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteMusic(track.musicId)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}