"use client"

import { useEffect, useState } from "react";
import { addRole, getAllRoles, deleteRole } from "@/lib/db/admin";

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

type Role = {
    roleId: number;
    description: string;
};

export default function RolePage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [description, setDescription] = useState("");
    const [addedRoleId, setAddedRoleId] = useState(0);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        const data = await getAllRoles();
        setRoles(data);
    };

    const handleAddRole = async () => {
        if (description.trim()) {
            try {
                const result = await addRole(description);
                const id = result[0]?.id;

                if (id) {
                    setAddedRoleId(id);
                    setDescription("");
                    await fetchRoles(); // Оновити список ролей після додавання
                }
            } catch (error) {
                console.error("Помилка при додаванні ролі:", error);
            }
        } else {
            alert("Будь ласка, введіть опис ролі.");
        }
    };

    const handleDeleteRole = async (roleId: number) => {
        try {
            await deleteRole(roleId);
            await fetchRoles(); // Оновити список ролей після видалення
        } catch (error) {
            console.error("Помилка при видаленні ролі:", error);
        }
    };

    const columns: ColumnDef<Role>[] = [
        {
            accessorKey: "roleId",
            header: "Айді",
        },
        {
            accessorKey: "description",
            header: "Опис",
        },
        {
            header: "Дії",
            id: "actions",
            cell: ({ row }) => {
                const role = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(role.description)}
                            >
                                Копіювати опис
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-900"
                                onClick={() => handleDeleteRole(role.roleId)}
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
                <h1>Сторінка ролей</h1>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus /> Додати
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Додавання ролі</DialogTitle>
                            <DialogDescription>
                                Перед додаванням переконайтеся, що ролі з таким описом ще немає.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Опис
                                </Label>
                                <Input
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={handleAddRole}>
                                Застосувати
                            </Button>
                        </DialogFooter>
                        {addedRoleId && (
                            <p>Роль успішно додано з ID: {addedRoleId}</p>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
            <DataTable columns={columns} data={roles} />
        </div>
    );
}
