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

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

type User = {
    userId: number;
    roleId: number | null;
    nickname: string;
    name: string;
    email: string;
    autoSkip: boolean;
    password: string;
    image: string | null;
    art: string | null;
};

type Role = {
    roleId: number;
    description: string;
};

export default function UserPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Стани для пагінації
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(20); // Кількість елементів на сторінці

    // Стани для форми редагування
    const [isEditing, setIsEditing] = useState(false);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        nickname: "",
        name: "",
        email: "",
        password: "",
        autoSkip: false,
        image: "",
        art: "",
    });
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [openRoleSelect, setOpenRoleSelect] = useState(false);

    useEffect(() => {
        fetchUsers(currentPage, pageSize);
        fetchRoles();
    }, [currentPage, pageSize]);

    // Оновлена функція завантаження користувачів
    const fetchUsers = async (page: number, pageSize: number) => {
        try {
            const response = await getUsersWithPagination(page, pageSize);
            setUsers(response.users);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Помилка при завантаженні користувачів:", error);
        }
    };

    const fetchRoles = async () => {
        const data = await getAllRoles();
        setRoles(data);
    };

    // Функції для навігації по сторінках
    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Генерація масиву сторінок для відображення
    const generatePageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
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
                dataToUpdate.image,
                dataToUpdate.art,
            );

            await fetchUsers(currentPage, pageSize);
            resetForm();
        } catch (error) {
            console.error("Помилка при оновленні користувача:", error);
            alert("Помилка при оновленні користувача");
        }
    };

    const handleDeleteUser = async (userId: number) => {
        try {
            await deleteUser(userId);

            // Перезавантаження поточної сторінки
            await fetchUsers(currentPage, pageSize);
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
            image: "",
            art: "",
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
            image: user.image || "",
            art: user.art || "",
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

    const frameworks = [
        {
            value: "10",
            label: "10",
        },
        {
            value: "20",
            label: "20",
        },
        {
            value: "30",
            label: "30",
        },
        {
            value: "40",
            label: "40",
        },
    ]

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("20")

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

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                            {value
                                ? frameworks.find((framework) => framework.value === value)?.label
                                : "Кількість користувачів на сторінку..."}
                            <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search framework..." />
                            <CommandList>
                                <CommandEmpty>Не обрано....</CommandEmpty>
                                <CommandGroup>
                                    {frameworks.map((framework) => (
                                        <CommandItem
                                            key={framework.value}
                                            value={framework.value}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value ? "" : currentValue);
                                                setPageSize(currentValue === value ? 20 : Number(currentValue));
                                                setOpen(false);
                                            }}
                                        >
                                            {framework.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    value === framework.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <DataTable
                columns={columns}
                data={users.filter(user =>
                    user.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase())
                )}
            />

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            isActive={currentPage === 1}
                        />
                    </PaginationItem>
                    {generatePageNumbers().map(page => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                onClick={() => handlePageChange(page)}
                                isActive={page === currentPage}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            isActive={currentPage === totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

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
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Пошук ролі..."/>
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
                            <Label htmlFor="image" className="text-right">
                                Зображення
                            </Label>
                            <Input
                                id="image"
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({...formData, image: e.target.value})}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="art" className="text-right">
                                Арт
                            </Label>
                            <Input
                                id="art"
                                type="text"
                                value={formData.art}
                                onChange={(e) => setFormData({...formData, art: e.target.value})}
                                className="col-span-3"
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