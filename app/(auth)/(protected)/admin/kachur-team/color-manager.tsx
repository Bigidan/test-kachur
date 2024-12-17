import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    addNewColor, deleteColor,
    getColors,
    updateColor,
} from '@/lib/db/admin';


type Color = {
    colorId: number;
    colorName: string | null;
    colorHex: string | null;
}

export function ColorManagement() {
    const [colors, setColors] = useState<Color[]>([]);
    const [newColorName, setNewColorName] = useState('');
    const [newColorHex, setNewColorHex] = useState('');

    useEffect(() => {
        fetchColors();
    }, []);

    const fetchColors = async () => {
        try {
            const data = await getColors();
            setColors(data);
        } catch (error) {
            console.error("Помилка при отриманні кольорів:", error);
        }
    };

    const handleAddColor = async () => {
        if (newColorName && newColorHex) {
            let r_newColorHex = newColorHex;
            if (!newColorHex.startsWith('#')) {
                r_newColorHex = "#" + newColorHex;
                console.log(r_newColorHex);
            }
            try {
                await addNewColor({
                    colorName: newColorName,
                    colorHex: r_newColorHex,
                });
                await fetchColors();
                setNewColorName('');
                setNewColorHex('');
            } catch (error) {
                console.error("Помилка при додаванні кольору:", error);
            }
        }
    };

    // const handleUpdateColor = async (colorId: number, updatedName?: string, updatedHex?: string) => {
    //     try {
    //         await updateColor(colorId, {
    //             colorName: updatedName,
    //             colorHex: updatedHex
    //         });
    //         await fetchColors();
    //     } catch (error) {
    //         console.error("Помилка при оновленні кольору:", error);
    //     }
    // };

    const handleDeleteColor = async (colorId: number) => {
        try {
            // Припускаємо, що у вас є функція deleteColor в admin.ts
            await deleteColor(colorId);
            await fetchColors();
        } catch (error) {
            console.error("Помилка при видаленні кольору:", error);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Керування кольорами
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Управління кольорами</h4>
                        <p className="text-sm text-muted-foreground">
                            Додавайте та редагуйте кольори
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Назва</Label>
                            <Input
                                value={newColorName}
                                onChange={(e) => setNewColorName(e.target.value)}
                                placeholder="Назва кольору"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>HEX</Label>
                            <Input
                                value={newColorHex}
                                onChange={(e) => setNewColorHex(e.target.value)}
                                placeholder="#000000"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <Button
                            onClick={handleAddColor}
                            disabled={!newColorName || !newColorHex}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Додати колір
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium">Існуючі кольори</h4>
                        {colors.map((color) => (
                            <div
                                key={color.colorId}
                                className="flex items-center justify-between border p-2 rounded"
                            >
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: color.colorHex || '#000000' }}
                                    />
                                    <span>{color.colorName}</span>
                                    <span className="text-muted-foreground text-sm">
                                        {color.colorHex}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteColor(color.colorId)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}