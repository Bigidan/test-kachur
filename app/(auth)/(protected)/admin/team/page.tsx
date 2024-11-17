"use client"

import {useCallback, useEffect, useState} from "react";
import { addTeam, getTeam, deleteMember, updateMember, getUsersByNickname } from "@/lib/db/admin";

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
import { MoreHorizontal, Plus, Check, ChevronsUpDown, Pencil } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";

type Member = {
    memberId: number;
    userId: number | null;
    nickname: string | null;
};

type User = {
    userId: number;
    nickname: string;
};

export default function TeamPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [open, setOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const fetchMembers = async () => {
        const data = await getTeam();
        setMembers(data);
    };

    const fetchUsers = useCallback(() => async () => {
        const data = await getUsersByNickname(searchTerm);
        setUsers(data);
    }, [searchTerm]);

    useEffect(() => {
        fetchMembers();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            fetchUsers();
        }
    }, [fetchUsers, searchTerm]);



    const handleAddMember = async () => {
        if (selectedUser) {
            try {
                await addTeam(selectedUser.userId);
                setSelectedUser(null);
                setOpen(false);
                await fetchMembers();
            } catch (error) {
                console.error("Помилка при додаванні учасника:", error);
            }
        } else {
            alert("Будь ласка, виберіть користувача.");
        }
    };

    const handleUpdateMember = async () => {
        if (editingMember && selectedUser) {
            try {
                await updateMember(editingMember.memberId, selectedUser.userId);
                setEditingMember(null);
                setSelectedUser(null);
                setIsEditing(false);
                await fetchMembers();
            } catch (error) {
                console.error("Помилка при оновленні учасника:", error);
            }
        }
    };

    const handleDeleteMember = async (memberId: number) => {
        try {
            await deleteMember(memberId);
            await fetchMembers();
        } catch (error) {
            console.error("Помилка при видаленні учасника:", error);
        }
    };

    const columns: ColumnDef<Member>[] = [
        {
            accessorKey: "memberId",
            header: "ID",
        },
        {
            accessorKey: "nickname",
            header: "Нікнейм",
        },
        {
            header: "Дії",
            id: "actions",
            cell: ({ row }) => {
                const member = row.original;

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
                                    setEditingMember(member);
                                    setIsEditing(true);
                                }}
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Редагувати
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-900"
                                onClick={() => handleDeleteMember(member.memberId)}
                            >
                                Видалити
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const UserSelect = ({ onSelect }: { onSelect: (user: User) => void }) => (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {selectedUser ? selectedUser.nickname : "Виберіть користувача..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Пошук користувача..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                    />
                    <CommandList>
                        <CommandEmpty>Користувачів не знайдено.</CommandEmpty>
                        <CommandGroup>
                            {users.map((user) => (
                                <CommandItem
                                    key={user.userId}
                                    value={user.nickname}
                                    onSelect={() => {
                                        onSelect(user);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedUser?.userId === user.userId ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {user.nickname}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );

    return (
        <div className="w-full flex flex-col space-x-3 p-4">
            <div className="flex items-center mb-4 space-x-5 p-4">
                <h1>Команда</h1>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Додати учасника
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Додавання учасника</DialogTitle>
                            <DialogDescription>
                                Виберіть користувача, якого хочете додати до команди.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <UserSelect onSelect={setSelectedUser} />
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={handleAddMember}>
                                Додати
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Редагування учасника</DialogTitle>
                        <DialogDescription>
                            Виберіть нового користувача для цього запису.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <UserSelect onSelect={setSelectedUser} />
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleUpdateMember}>
                            Зберегти
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DataTable columns={columns} data={members} />
        </div>
    );
}