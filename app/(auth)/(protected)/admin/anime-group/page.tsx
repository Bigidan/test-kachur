"use client"

import {useCallback, useEffect, useState} from "react";
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
import { MoreHorizontal, Plus, Pencil } from "lucide-react";
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
    addAge,
    addDirector, addSource, addStatus, addStudio,
    addType, deleteAge,
    deleteDirector, deleteSource, deleteStatus, deleteStudio, deleteType, getAllAges,
    getAllDirectors, getAllSources, getAllStatuses, getAllStudios,
    getAllTypes, updateAge,
    updateDirector, updateSource, updateStatus, updateStudio,
    updateType
} from "@/lib/db/admin";

// Типи даних для кожної таблиці
type ReferenceItem = {
    id: number;
    name: string;
};

type TabConfig = {
    key: string;
    label: string;
    getFunction: () => Promise<{id: number, name: string}[]>;
    addFunction: (name: string) => Promise<{id: number}[]>;
    updateFunction: (id: number, name: string) => Promise<{id: number}[]>;
    deleteFunction: (id: number) => Promise<{id: number}[]>;
};

export default function AnimeGroupPage() {
    // Стани для кожної таблиці
    const [currentItems, setCurrentItems] = useState<ReferenceItem[]>([]);
    const [name, setName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState<ReferenceItem | null>(null);
    const [currentTab, setCurrentTab] = useState("directors");

    // Конфігурація для кожної вкладки
    const tabConfigs: Record<string, TabConfig> = {
        directors: {
            key: "directors",
            label: "Режисери",
            getFunction: getAllDirectors,
            addFunction: addDirector,
            updateFunction: updateDirector,
            deleteFunction: deleteDirector,
        },
        types: {
            key: "types",
            label: "Типи",
            getFunction: getAllTypes,
            addFunction: addType,
            updateFunction: updateType,
            deleteFunction: deleteType,
        },
        statuses: {
            key: "statuses",
            label: "Статуси",
            getFunction: getAllStatuses,
            addFunction: addStatus,
            updateFunction: updateStatus,
            deleteFunction: deleteStatus,
        },
        sources: {
            key: "sources",
            label: "Джерела",
            getFunction: getAllSources,
            addFunction: addSource,
            updateFunction: updateSource,
            deleteFunction: deleteSource,
        },
        ages: {
            key: "ages",
            label: "Вікові обмеження",
            getFunction: getAllAges,
            addFunction: addAge,
            updateFunction: updateAge,
            deleteFunction: deleteAge,
        },
        studios: {
            key: "studios",
            label: "Студії",
            getFunction: getAllStudios,
            addFunction: addStudio,
            updateFunction: updateStudio,
            deleteFunction: deleteStudio,
        }
    };

    const fetchItems = useCallback(async () => {
        const config = tabConfigs[currentTab];
        const data = await config.getFunction(); // Тепер TypeScript знає, що це Item[]

        const formattedData = data.map(item => ({
            id: item['id'], // config.idField тепер обов'язково 'id' або 'name'
            name: item['name']
        }));
        setCurrentItems(formattedData);
    }, [currentTab, tabConfigs]);
    
    useEffect(() => {

        fetchItems().then(() => {});
    }, [currentTab, fetchItems]);



    const handleAdd = async () => {
        if (name.trim()) {
            try {
                const config = tabConfigs[currentTab];
                await config.addFunction(name);
                setName("");
                await fetchItems();
            } catch (error) {
                console.error(`Помилка при додаванні запису:`, error);
            }
        }
    };

    const handleUpdate = async () => {
        if (editingItem && name.trim()) {
            try {
                const config = tabConfigs[currentTab];
                await config.updateFunction(editingItem.id, name);
                setEditingItem(null);
                setName("");
                setIsEditing(false);
                await fetchItems();
            } catch (error) {
                console.error(`Помилка при оновленні запису:`, error);
            }
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const config = tabConfigs[currentTab];
            await config.deleteFunction(id);
            await fetchItems();
        } catch (error) {
            console.error(`Помилка при видаленні запису:`, error);
        }
    };

    const columns: ColumnDef<ReferenceItem>[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "name",
            header: "Назва",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const item = row.original;

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
                                    setEditingItem(item);
                                    setName(item.name);
                                    setIsEditing(true);
                                }}
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Редагувати
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-900"
                                onClick={() => handleDelete(item.id)}
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
        <div className="w-full p-4">
            <Tabs defaultValue="directors" onValueChange={setCurrentTab}>
                <TabsList className="grid grid-cols-6 w-full">
                    {Object.values(tabConfigs).map(config => (
                        <TabsTrigger key={config.key} value={config.key}>
                            {config.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {Object.values(tabConfigs).map(config => (
                    <TabsContent key={config.key} value={config.key}>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">{config.label}</h2>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" /> Додати
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Додавання {config.label.toLowerCase()}</DialogTitle>
                                                <DialogDescription>
                                                    Введіть назву для нового запису
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right">
                                                        Назва
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="col-span-3"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="button" onClick={handleAdd}>
                                                    Додати
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <DataTable columns={columns} data={currentItems} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Редагування запису</DialogTitle>
                        <DialogDescription>
                            Змініть назву запису
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                                Назва
                            </Label>
                            <Input
                                id="edit-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleUpdate}>
                            Зберегти
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}