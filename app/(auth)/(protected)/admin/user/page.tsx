"use client"

import { useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Check, ChevronsUpDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteUser, getUsersWithPagination, updateUser, getAllRoles } from "@/lib/db/admin";

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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type User = {
    userId: number;
    roleId: number | null;
    nickname: string;
    name: string;
    email: string;
    autoSkip: boolean;
    password: string;
    image: string | null;
};

type Role = {
    roleId: number;
    description: string;
};

export default function UserPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Стани для форми редагування
    const [isEditing, setIsEditing] = useState(false);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        nickname: "",
        name: "",
        email: "",
        password: "",
        autoSkip: false,
    });
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [openRoleSelect, setOpenRoleSelect] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        const data = await getUsersWithPagination();
        setUsers(data);
    };

    const fetchRoles = async () => {
        const data = await getAllRoles();
        setRoles(data);
    };

    const handleUpdateUser = async () => {
        if (!selectedRole || !editingUserId) return;

        try {
            // Якщо пароль порожній, не відправляємо його
            const dataToUpdate = {
                ...formData,
                password: formData.password || undefined
            };

            await updateUser(
                editingUserId,
                selectedRole.roleId,
                dataToUpdate.nickname,
                dataToUpdate.name,
                dataToUpdate.email,
                dataToUpdate.autoSkip,
            );

            await fetchUsers();
            resetForm();
        } catch (error) {
            console.error("Помилка при оновленні користувача:", error);
            alert("Помилка при оновленні користувача");
        }
    };

    const handleDeleteUser = async (userId: number) => {
        try {
            await deleteUser(userId);
            await fetchUsers();
        } catch (error) {
            console.error("Помилка при видаленні користувача:", error);
            alert("Помилка при видаленні користувача");
        }
    };

    const resetForm = () => {
        setFormData({
            nickname: "",
            name: "",
            email: "",
            password: "",
            autoSkip: false,
        });
        setSelectedRole(null);
        setIsEditing(false);
        setEditingUserId(null);
    };

    const startEditing = (user: User) => {
        setIsEditing(true);
        setEditingUserId(user.userId);
        setFormData({
            nickname: user.nickname,
            name: user.name,
            email: user.email,
            password: "",
            autoSkip: user.autoSkip,
        });
        const userRole = roles.find(role => role.roleId === user.roleId);
        setSelectedRole(userRole || null);
    };

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "userId",
            header: "ID",
        },
        {
            accessorKey: "nickname",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Нікнейм
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "name",
            header: "Ім'я",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "autoSkip",
            header: "Авто пропуск",
            cell: ({ row }) => (
                <Checkbox checked={row.original.autoSkip} disabled />
            ),
        },
        {
            header: "Дії",
            id: "actions",
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEditing(user)}>
                                Редагувати
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-900"
                                onClick={() => handleDeleteUser(user.userId)}
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
                <h1>Користувачі</h1>
            </div>

            <div className="flex items-center py-4">
                <Input
                    placeholder="Пошук користувача..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="max-w-sm"
                />
            </div>

            <DataTable
                columns={columns}
                data={users.filter(user =>
                    user.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase())
                )}
            />

            <Dialog open={isEditing} onOpenChange={(open) => !open && resetForm()}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Редагування користувача</DialogTitle>
                        <DialogDescription>
                            Змініть дані користувача
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Роль
                            </Label>
                            <div className="col-span-3">
                                <Popover open={openRoleSelect} onOpenChange={setOpenRoleSelect}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openRoleSelect}
                                            className="w-full justify-between"
                                        >
                                            {selectedRole ? selectedRole.description : "Виберіть роль..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Пошук ролі..." />
                                            <CommandList>
                                                <CommandEmpty>Ролі не знайдено.</CommandEmpty>
                                                <CommandGroup>
                                                    {roles.map((role) => (
                                                        <CommandItem
                                                            key={role.roleId}
                                                            value={role.description}
                                                            onSelect={() => {
                                                                setSelectedRole(role);
                                                                setOpenRoleSelect(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedRole?.roleId === role.roleId ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {role.description}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nickname" className="text-right">
                                Нікнейм
                            </Label>
                            <Input
                                id="nickname"
                                value={formData.nickname}
                                onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Ім&#39;я
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Пароль
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="col-span-3"
                                placeholder="Залиште порожнім, щоб не змінювати"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">
                                Авто пропуск
                            </Label>
                            <div className="col-span-3">
                                <Checkbox
                                    checked={formData.autoSkip}
                                    onCheckedChange={(checked) =>
                                        setFormData({...formData, autoSkip: checked as boolean})
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={resetForm}>
                            Скасувати
                        </Button>
                        <Button type="button" onClick={handleUpdateUser}>
                            Зберегти
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}