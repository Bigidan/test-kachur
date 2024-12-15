"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/main/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
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
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import {addKachurTeamMember, deleteKachurTeamMember, getTeam, updateKachurTeamMember} from "@/lib/db/admin";
import { getAllKachurTeam } from "@/lib/db/admin";

// Типи для даних
type KachurTeam = {
    positionId: number | null;
    kachurId: number;
    memberId: number | null;
    type: number | null;
};

type Member = {
    memberId: number;
    userId: number | null;
    nickname: string | null;
};

const typeLabels = {
    0: "Актори",
    1: "Запрошені актори",
    2: "Перекладач",
    3: "Візуальний ряд",
    4: "Засновники"
};

export default function KachurTeamPage() {
    const [team, setTeam] = useState<KachurTeam[]>([]);
    const [memberList, setMemberList] = useState<Member[]>([]);

    // Стани для додавання/редагування
    const [selectedMember, setSelectedMember] = useState<Member[] | null>(null);
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [positionId, setPositionId] = useState<number>(0);

    // Стан редагування
    const [editKachurId, setEditKachurId] = useState<number | null>(null);



    const fetchTeam = async () => {
        try {
            const data = await getAllKachurTeam(); // Функція отримання команди
            setTeam(data);
        } catch (error) {
            console.error("Помилка при отриманні команди:", error);
        }
    };

    const fetchMembers = async () => {
        try {
            const data = await getTeam(); // Функція отримання членів команди
            setMemberList(data);
        } catch (error) {
            console.error("Помилка при отриманні членів команди:", error);
        }
    };

    useEffect(() => {
        fetchTeam();
        fetchMembers();
    }, []);

    const handleAddTeamMember = async () => {
        if (selectedMember && selectedType !== null) {
            try {
                await addKachurTeamMember(
                    selectedMember[0].memberId,
                    selectedType,
                    positionId
                );
                await fetchTeam();
                // Скидання форми
                setSelectedMember(null);
                setSelectedType(null);
                setPositionId(0);
            } catch (error) {
                console.error("Помилка при додаванні члена команди:", error);
            }
        } else {
            alert("Виберіть члена команди та тип.");
        }
    };

    const handleUpdateTeamMember = async () => {
        if (editKachurId && selectedMember && selectedType !== null) {
            try {
                console.log(editKachurId, selectedMember[0].memberId, selectedType, positionId);
                const result = await updateKachurTeamMember(
                    editKachurId,
                    selectedMember[0].memberId,
                    selectedType,
                    positionId
                );

                if (result.success) {
                    await fetchTeam();
                    setEditKachurId(null);
                    setSelectedMember(null);
                    setSelectedType(null);
                    setPositionId(0);
                }
            } catch (error) {
                console.error("Помилка при оновленні члена команди:", error);
            }
        }
    };

    const handleDeleteTeamMember = async (kachurId: number) => {
        try {
            const result = await deleteKachurTeamMember(kachurId);
            if (result.success)
                await fetchTeam();
        } catch (error) {
            console.error("Помилка при видаленні члена команди:", error);
        }
    };

    const columns: ColumnDef<KachurTeam>[] = [
        {
            accessorKey: "kachurId",
            header: "ID",
        },
        {
            accessorKey: "memberId",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Член команди
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const member = memberList.find(m => m.memberId === row.original.memberId);
                return member ? member.nickname : "Невідомо";
            }
        },
        {
            accessorKey: "type",
            header: "Тип",
            cell: ({ row }) => typeLabels[row.original.type as keyof typeof typeLabels] || "Невідомо"
        },
        {
            accessorKey: "positionId",
            header: "Позиція",
        },
        {
            header: "Дії",
            id: "actions",
            cell: ({ row }) => {
                const teamMember = row.original;

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
                                    setEditKachurId(teamMember.kachurId);
                                    const member = memberList.find(m => m.memberId === teamMember.memberId);
                                    if (member) setSelectedMember([member]);
                                    setSelectedType(teamMember.type);
                                    setPositionId(teamMember.positionId || 0);
                                }}
                            >
                                Редагувати
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-900"
                                onClick={() => handleDeleteTeamMember(teamMember.kachurId)}
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
                <h1>Команда Качура</h1>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus /> Додати
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                            <DialogTitle>Додавання члена команди</DialogTitle>
                            <DialogDescription>
                                Виберіть члена команди та його тип.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            {/* Вибір члена команди */}
                            <div>
                                <Label>Член команди</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" className="w-full justify-between">
                                            {selectedMember ? selectedMember[0].nickname : "Виберіть члена команди"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Command>
                                            <CommandInput placeholder="Пошук члена команди..." />
                                            <CommandList>
                                                <CommandEmpty>Членів команди не знайдено.</CommandEmpty>
                                                <CommandGroup>
                                                    {memberList.map(member => (
                                                        <CommandItem
                                                            key={member.memberId}
                                                            onSelect={() => setSelectedMember(member ? [member] : null)}
                                                        >
                                                            <Check
                                                                className={selectedMember ? (selectedMember[0].memberId === member.memberId ? "opacity-100" : "opacity-0") : "opacity-0"} />
                                                            {member.nickname}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Вибір типу */}
                            <div>
                                <Label>Тип</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" className="w-full justify-between">
                                            {selectedType !== null ? typeLabels[selectedType as keyof typeof typeLabels] : "Виберіть тип"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Command>
                                            <CommandList>
                                                <CommandGroup>
                                                    {Object.entries(typeLabels).map(([key, label]) => (
                                                        <CommandItem
                                                            key={key}
                                                            onSelect={() => setSelectedType(Number(key))}
                                                        >
                                                            <Check
                                                                className={selectedType === Number(key) ? "opacity-100" : "opacity-0"} />
                                                            {label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Позиція */}
                            <div>
                                <Label>Позиція</Label>
                                <Input
                                    type="number"
                                    value={positionId}
                                    onChange={(e) => setPositionId(Number(e.target.value))}
                                    placeholder="Введіть позицію"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" onClick={handleAddTeamMember}>Додати</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Діалог редагування */}
                <Dialog open={editKachurId !== null} onOpenChange={(open) => { if (!open) setEditKachurId(null); }}>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                            <DialogTitle>Редагування члена команди</DialogTitle>
                            <DialogDescription>
                                Змініть дані про члена команди.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            {/* Вибір члена команди */}
                            <div>
                                <Label>Член команди</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" className="w-full justify-between">
                                            {selectedMember ? selectedMember[0].nickname : "Виберіть члена команди"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Command>
                                            <CommandInput placeholder="Пошук члена команди..." />
                                            <CommandList>
                                                <CommandEmpty>Членів команди не знайдено.</CommandEmpty>
                                                <CommandGroup>
                                                    {memberList.map(member => (
                                                        <CommandItem
                                                            key={member.memberId}
                                                            onSelect={() => setSelectedMember(member ? [member] : null)}
                                                        >
                                                            <Check
                                                                className={selectedMember ? (selectedMember[0].memberId === member.memberId ? "opacity-100" : "opacity-0") : "opacity-0"} />
                                                            {member.nickname}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Вибір типу */}
                            <div>
                                <Label>Тип</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" className="w-full justify-between">
                                            {selectedType !== null ? typeLabels[selectedType as keyof typeof typeLabels] : "Виберіть тип"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Command>
                                            <CommandList>
                                                <CommandGroup>
                                                    {Object.entries(typeLabels).map(([key, label]) => (
                                                        <CommandItem
                                                            key={key}
                                                            onSelect={() => setSelectedType(Number(key))}
                                                        >
                                                            <Check
                                                                className={selectedType === Number(key) ? "opacity-100" : "opacity-0"} />
                                                            {label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Позиція */}
                            <div>
                                <Label>Позиція</Label>
                                <Input
                                    type="number"
                                    value={positionId}
                                    onChange={(e) => setPositionId(Number(e.target.value))}
                                    placeholder="Введіть позицію"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" onClick={handleUpdateTeamMember}>Застосувати</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable
                columns={columns}
                data={team}
            />
        </div>
    );
}