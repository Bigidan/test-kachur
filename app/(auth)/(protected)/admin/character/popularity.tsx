"use client";

import { useEffect, useState } from "react";
import { addPopularity, getAllPopularity, deletePopularity, updatePopularity } from "@/lib/db/admin";
import { ArrowUpDown } from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/main/data-table";
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

type Popularity = {
    popularityId: number;
    popularity: string;
};

export default function PopularityPage() {
    const [popularityList, setPopularityList] = useState<Popularity[]>([]);
    const [popularity, setPopularity] = useState("");
    const [addedPopularityId, setAddedPopularityId] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [editPopularityId, setEditPopularityId] = useState<number | null>(null);
    const [editPopularity, setEditPopularity] = useState("");

    useEffect(() => {
        fetchPopularity();
    }, []);

    const fetchPopularity = async () => {
        const data = await getAllPopularity();
        setPopularityList(data);
    };

    const handleAddPopularity = async () => {
        if (popularity.trim()) {
            try {
                const result = await addPopularity(popularity);
                const id = result[0]?.id;

                if (id) {
                    setAddedPopularityId(id);
                    setPopularity("");
                    await fetchPopularity();
                }
            } catch (error) {
                console.error("Помилка при додаванні популярності:", error);
            }
        } else {
            alert("Будь ласка, введіть популярність.");
        }
    };

    const handleDeletePopularity = async (popularityId: number) => {
        try {
            await deletePopularity(popularityId);
            await fetchPopularity();
        } catch (error) {
            console.error("Помилка при видаленні популярності:", error);
        }
    };

    const handleEditPopularity = async () => {
        if (editPopularity.trim()) {
            try {
                await updatePopularity(editPopularityId!, editPopularity);
                setEditPopularityId(null);
                setEditPopularity("");
                await fetchPopularity();
            } catch (error) {
                console.error("Помилка при редагуванні популярності:", error);
            }
        } else {
            alert("Будь ласка, введіть популярність.");
        }
    };

    const columns: ColumnDef<Popularity>[] = [
        {
            accessorKey: "popularityId",
            header: "Айді",
        },
        {
            accessorKey: "popularity",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Популярність
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            header: "Дії",
            id: "actions",
            cell: ({ row }) => {
                const pop = row.original;

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
                                    setEditPopularityId(pop.popularityId);
                                    setEditPopularity(pop.popularity);
                                }}
                            >
                                Редагувати
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(pop.popularity)}
                            >
                                Копіювати
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-900"
                                onClick={() => handleDeletePopularity(pop.popularityId)}
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
                <h1>Сторінка популярності</h1>

                <Dialog open={editPopularityId !== null} onOpenChange={(open) => { if (!open) setEditPopularityId(null); }}>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                            <DialogTitle>Редагування популярності</DialogTitle>
                            <DialogDescription>Введіть нову популярність.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="editPopularity" className="text-right">
                                    Популярність
                                </Label>
                                <Input
                                    id="editPopularity"
                                    value={editPopularity}
                                    onChange={(e) => setEditPopularity(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={handleEditPopularity}>
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
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                            <DialogTitle>Додавання популярності</DialogTitle>
                            <DialogDescription>
                                Перед додаванням впевніться, що популярність з такою назвою ще немає.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="popularity" className="text-right">
                                    Популярність
                                </Label>
                                <Input
                                    id="popularity"
                                    value={popularity}
                                    onChange={(e) => setPopularity(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={handleAddPopularity}>
                                Застосувати
                            </Button>
                        </DialogFooter>
                        {addedPopularityId && (
                            <p>Популярність успішно додано з ID: {addedPopularityId}</p>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center py-4">
                <Input
                    placeholder="Пошук за популярністю..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="max-w-sm"
                />
            </div>

            <DataTable
                columns={columns}
                data={popularityList.filter(pop =>
                    pop.popularity.toLowerCase().includes(searchQuery.toLowerCase())
                )}
            />
        </div>
    );
}
