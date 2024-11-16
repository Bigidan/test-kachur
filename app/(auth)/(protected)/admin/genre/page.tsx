"use client"

import { useEffect, useState } from "react";
import {addGenre, getAllGenres, deleteGenre, updateGenre} from "@/lib/db/admin";
import { ArrowUpDown } from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/main/data-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Genre = {
    genreId: number;
    genreName: string;
};

export default function GenrePage() {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [genreName, setGenreName] = useState("");
    const [addedGenreId, setAddedGenreId] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [editGenreId, setEditGenreId] = useState<number | null>(null);
    const [editGenreName, setEditGenreName] = useState("");

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        const data = await getAllGenres();
        setGenres(data);
    };

    const handleAddGenre = async () => {
        if (genreName.trim()) {
            try {
                const result = await addGenre(genreName);
                const id = result[0]?.id;

                if (id) {
                    setAddedGenreId(id);
                    setGenreName("");
                    await fetchGenres();
                }
            } catch (error) {
                console.error("Помилка при додаванні жанру:", error);
            }
        } else {
            alert("Будь ласка, введіть назву жанру.");
        }
    };

    const handleDeleteGenre = async (genreId: number) => {
        try {
            await deleteGenre(genreId);
            await fetchGenres();
        } catch (error) {
            console.error("Помилка при видаленні жанру:", error);
        }
    };

    const handleEditGenre = async () => {
        if (editGenreName.trim()) {
            try {
                await updateGenre(editGenreId!, editGenreName); // Викликаємо функцію оновлення жанру
                setEditGenreId(null);
                setEditGenreName("");
                await fetchGenres(); // Оновлюємо список жанрів
            } catch (error) {
                console.error("Помилка при редагуванні жанру:", error);
            }
        } else {
            alert("Будь ласка, введіть назву жанру.");
        }
    };

    const columns: ColumnDef<Genre>[] = [
        {
            accessorKey: "genreId",
            header: "Айді",
        },
        {
            accessorKey: "genreName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Жанр
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            header: "Дії",
            id: "actions",
            cell: ({ row }) => {
                const genr = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    setEditGenreId(genr.genreId);
                                    setEditGenreName(genr.genreName);
                                }}
                            >
                                Редагувати
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(genr.genreName)}
                            >
                                Копіювати назву
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-900"
                                onClick={() => handleDeleteGenre(genr.genreId)}
                            >
                                Видалити
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <div className="w-full flex flex-col space-x-3 p-4">
            <div className="flex items-center mb-4 space-x-5 p-4">
                <h1>Жанри сторінка</h1>

                <Dialog open={editGenreId !== null} onOpenChange={(open) => { if (!open) setEditGenreId(null); }}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Редагування жанру</DialogTitle>
                            <DialogDescription>
                                Введіть нову назву жанру.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="editGenreName" className="text-right">
                                    Назва
                                </Label>
                                <Input
                                    id="editGenreName"
                                    value={editGenreName}
                                    onChange={(e) => setEditGenreName(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={handleEditGenre}>
                                Застосувати
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus /> Додати
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Додавання жанру</DialogTitle>
                            <DialogDescription>
                                Перед додаванням впевніться, що жанру з такою назвою ще немає.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="genreName" className="text-right">
                                    Назва
                                </Label>
                                <Input
                                    id="genreName"
                                    value={genreName}
                                    onChange={(e) => setGenreName(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={handleAddGenre}>
                                Застосувати
                            </Button>
                        </DialogFooter>
                        {addedGenreId && (
                            <p>Жанр успішно додано з ID: {addedGenreId}</p>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center py-4">
                <Input
                    placeholder="Пошук за назвою жанру..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="max-w-sm"
                />
            </div>

            <DataTable
                columns={columns}
                data={genres.filter(genre =>
                    genre.genreName.toLowerCase().includes(searchQuery.toLowerCase())
                )}
            />
        </div>
    );
}