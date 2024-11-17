"use client"

import { useEffect, useState } from "react";
import {
    addCharacter,
    getAllCharacters,
    deleteCharacter,
    updateCharacter,
    getAllAnime,
    getAllPopularity, getTeam
} from "@/lib/db/admin";
import { Check, ChevronsUpDown} from "lucide-react";
import { Anime } from "@/components/types/anime-types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/main/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";

type Character = {
    name: string;
    image: string | null;
    characterId: number;
    animeId: number | null;
    popularityId: number | null;
    voiceActorId: number | null;

    popularityName: string | null;
    voiceActroName: string | null;
    animeName: string | null;
};

export default function CharacterList() {

    const [characterList, setCharacterList] = useState<Character[]>([]);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [addedCharacterId, setAddedCharacterId] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [editCharacterId, setEditCharacterId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [editImage, setEditImage] = useState("");

    const [selectedAnime, setSelectedAnime] = useState<Anime[] | null>(null);
    const [selectedPopularity, setSelectedPopularity] = useState<{popularityId: number, popularity: string | null}[] | null>(null);
    const [selectedVoiceActor, setSelectedVoiceActor] = useState<{memberId: number, userId: number | null, nickname: string | null}[] | null>(null);
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [popularityList, setPopularityList] = useState<{popularityId: number, popularity: string | null}[]>([]);
    const [voiceActorList, setVoiceActorList] = useState<{memberId: number, userId: number | null, nickname: string | null}[]>([]);

    useEffect(() => {
        fetchCharacters();
        fetchAnimeList();
        fetchPopularityList();
        fetchVoiceActorList();
    }, []);

    const resetData = () => {
        setSelectedAnime(null);
        setSelectedPopularity(null);
        setSelectedVoiceActor(null);
        setName("");
        setImage("");
    }

    const fetchCharacters = async () => {
        const data = await getAllCharacters();
        setCharacterList(data);
    };

    const fetchAnimeList = async () => {
        const data = await getAllAnime();
        setAnimeList(data);
    };

    const fetchPopularityList = async () => {
        const data = await getAllPopularity();
        setPopularityList(data);
    };

    const fetchVoiceActorList = async () => {
        const data = await getTeam();
        setVoiceActorList(data);
    };

    const handleAddCharacter = async () => {
        if (selectedAnime && selectedPopularity && selectedVoiceActor) {
            try {
                const newId = await addCharacter(
                    selectedAnime[0].animeId,
                    selectedPopularity[0].popularityId,
                    selectedVoiceActor[0].memberId,
                    name || "",
                    image || "",
                );
                await fetchCharacters();
                setAddedCharacterId(newId[0].id)
            } catch (error) {
                console.error("Помилка при додаванні персонажа:", error);
            }
        } else {
            alert("Будь ласка, виберіть усі поля.");
        }
    };

    const handleDeleteCharacter = async (characterId: number) => {
        try {
            await deleteCharacter(characterId);
            await fetchCharacters();
        } catch (error) {
            console.error("Помилка при видаленні персонажа:", error);
        }
    };

    const handleEditCharacter = async () => {
        if (selectedAnime && selectedPopularity && selectedVoiceActor) {
            if (editName.trim()) {
                try {
                    await updateCharacter(
                        editCharacterId!,
                        selectedAnime[0].animeId,
                        selectedPopularity[0].popularityId,
                        selectedVoiceActor[0].memberId,
                        editName,
                        editImage,
                    );
                    setEditCharacterId(null);
                    setEditName("");
                    setEditImage("");
                    await fetchCharacters();
                } catch (error) {
                    console.error("Помилка при редагуванні персонажа:", error);
                }
            } else {
                alert("Будь ласка, введіть ім'я персонажа.");
            }
        }
    };

    const columns: ColumnDef<Character>[] = [
        { accessorKey: "characterId", header: "Айді" },
        { accessorKey: "name", header: "Ім'я персонажа" },
        { accessorKey: "image", header: "Зображення" },
        { accessorKey: "animeName", header: "Аніме" },
        { accessorKey: "popularityName", header: "Популярність" },
        { accessorKey: "voiceActroName", header: "Озвучує" },
        {
            header: "Дії",
            id: "actions",
            cell: ({ row }) => {
                const character = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                                setEditCharacterId(character.characterId);
                                setEditName(character.name);
                                setEditImage(character.image || "");

                                const selectedAnimeL = animeList.find(anime => anime.animeId === character.animeId);
                                setSelectedAnime(selectedAnimeL ? [selectedAnimeL] : null);

                                const selectedPopularityL = popularityList.find(pop => pop.popularityId === character.popularityId);
                                setSelectedPopularity(selectedPopularityL ? [selectedPopularityL] : null);

                                const selectedVoiceActorL = voiceActorList.find(VA => VA.memberId === character.voiceActorId);
                                setSelectedVoiceActor(selectedVoiceActorL ? [selectedVoiceActorL] : null);

                            }}>Редагувати</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-900" onClick={() => handleDeleteCharacter(character.characterId)}>Видалити</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <div className="w-full flex flex-col space-x-3 p-4">
            <div className="flex items-center mb-4 space-x-5 p-4">
                <h1>Сторінка персонажів</h1>
                <Dialog open={editCharacterId !== null} onOpenChange={(open) => { if (!open) setEditCharacterId(null); }}>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader><DialogTitle>Додавання персонажа</DialogTitle><DialogDescription>Введіть
                            інформацію про нового персонажа.</DialogDescription></DialogHeader>

                        <div className="grid gap-4 py-4 animeDialog">
                            <div className="">
                                <Label htmlFor="name">Ім&#39;я</Label>
                                <Input id="name" value={editName} onChange={(e) => setName(e.target.value)}
                                       className="col-span-3"/>
                                <Label htmlFor="image">Зображення</Label>
                                <Input id="image" value={editImage} onChange={(e) => setImage(e.target.value)}
                                       className="col-span-3"/>
                            </div>

                            <div>
                                <Label htmlFor="anime" className="text-right">
                                    Аніме
                                </Label>
                                <div className="col-span-3">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-full justify-between">
                                                {selectedAnime ? selectedAnime[0].nameUkr : "Виберіть аніме"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4"/>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <Command>
                                                <CommandInput placeholder="Пошук аніме..."/>
                                                <CommandList>
                                                    <CommandEmpty>Аніме не знайдено.</CommandEmpty>
                                                    <CommandGroup>
                                                        {animeList.map(anime => (
                                                            <CommandItem
                                                                key={anime.animeId}
                                                                onSelect={() => setSelectedAnime(anime ? [anime] : null)}
                                                            >
                                                                <Check
                                                                    className={selectedAnime ? (selectedAnime[0].animeId === anime.animeId ? "opacity-100" : "opacity-0") : "opacity-0"}/>
                                                                {anime.nameUkr}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {/* Popularity dropdown */}
                            <div>
                                <Label htmlFor="popularity" className="text-right">Популярність</Label>
                                <div className="col-span-3">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-full justify-between">
                                                {selectedPopularity ? selectedPopularity[0].popularity : "Виберіть популярність"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4"/>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <Command>
                                                <CommandInput placeholder="Пошук популярності..."/>
                                                <CommandList>
                                                    <CommandEmpty>Популярність не знайдена.</CommandEmpty>
                                                    <CommandGroup>
                                                        {popularityList.map(popularity => (
                                                            <CommandItem
                                                                key={popularity.popularityId}
                                                                onSelect={() => setSelectedPopularity(popularity ? [popularity] : null)}
                                                            >
                                                                <Check
                                                                    className={selectedPopularity ? (selectedPopularity[0].popularityId === popularity.popularityId ? "opacity-100" : "opacity-0") : "opacity-0"}/>
                                                                {popularity.popularity}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {/* Voice Actor dropdown */}
                            <div>
                                <Label htmlFor="voiceActor" className="text-right">Актор голосу</Label>
                                <div className="col-span-3">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-full justify-between">
                                                {selectedVoiceActor ? selectedVoiceActor[0].nickname : "Виберіть актора голосу"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4"/>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <Command>
                                                <CommandInput placeholder="Пошук актора голосу..."/>
                                                <CommandList>
                                                    <CommandEmpty>Актор голосу не знайдений.</CommandEmpty>
                                                    <CommandGroup>
                                                        {voiceActorList.map(actor => (
                                                            <CommandItem
                                                                key={actor.memberId}
                                                                onSelect={() => {
                                                                    setSelectedVoiceActor(actor ? [actor] : null);

                                                                }}
                                                            >
                                                                <Check
                                                                    className={selectedVoiceActor ? (selectedVoiceActor[0].memberId === actor.memberId ? "opacity-100" : "opacity-0") : "opacity-0"}/>
                                                                {actor.nickname}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" onClick={handleEditCharacter}>Застосувати</Button>
                        </DialogFooter>
                        {addedCharacterId && (<p>Персонаж успішно додано з ID: {addedCharacterId}</p>)}
                    </DialogContent>
                </Dialog>

                <Dialog onOpenChange={(open) => !open && resetData()}>
                    <DialogTrigger asChild><Button><Plus /> Додати</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader><DialogTitle>Додавання персонажа</DialogTitle><DialogDescription>Введіть
                            інформацію про нового персонажа.</DialogDescription></DialogHeader>

                        <div className="grid gap-4 py-4 animeDialog">
                            <div className="">
                                <Label htmlFor="name">Ім&#39;я</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)}
                                       className="col-span-3"/>
                                <Label htmlFor="image">Зображення</Label>
                                <Input id="image" value={image} onChange={(e) => setImage(e.target.value)}
                                       className="col-span-3"/>
                            </div>

                            <div>
                                <Label htmlFor="anime" className="text-right">
                                    Аніме
                                </Label>
                                <div className="col-span-3">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-full justify-between">
                                                {selectedAnime ? selectedAnime[0].nameUkr : "Виберіть аніме"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4"/>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <Command>
                                                <CommandInput placeholder="Пошук аніме..."/>
                                                <CommandList>
                                                    <CommandEmpty>Аніме не знайдено.</CommandEmpty>
                                                    <CommandGroup>
                                                        {animeList.map(anime => (
                                                            <CommandItem
                                                                key={anime.animeId}
                                                                onSelect={() => setSelectedAnime(anime ? [anime] : null)}
                                                            >
                                                                <Check
                                                                    className={selectedAnime ? (selectedAnime[0].animeId === anime.animeId ? "opacity-100" : "opacity-0") : "opacity-0"}/>
                                                                {anime.nameUkr}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {/* Popularity dropdown */}
                            <div>
                                <Label htmlFor="popularity" className="text-right">Популярність</Label>
                                <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" className="w-full justify-between">
                                            {selectedPopularity ? selectedPopularity[0].popularity : "Виберіть популярність"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4"/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Command>
                                            <CommandInput placeholder="Пошук популярності..."/>
                                            <CommandList>
                                                <CommandEmpty>Популярність не знайдена.</CommandEmpty>
                                                <CommandGroup>
                                                    {popularityList.map(popularity => (
                                                        <CommandItem
                                                            key={popularity.popularityId}
                                                            onSelect={() => setSelectedPopularity(popularity ? [popularity] : null)}
                                                        >
                                                            <Check
                                                                className={selectedPopularity ? (selectedPopularity[0].popularityId === popularity.popularityId ? "opacity-100" : "opacity-0") : "opacity-0"}/>
                                                            {popularity.popularity}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                </div>
                            </div>

                            {/* Voice Actor dropdown */}
                            <div>
                                <Label htmlFor="voiceActor" className="text-right">Актор голосу</Label>
                                <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" className="w-full justify-between">
                                            {selectedVoiceActor ? selectedVoiceActor[0].nickname : "Виберіть актора голосу"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4"/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Command>
                                            <CommandInput placeholder="Пошук актора голосу..."/>
                                            <CommandList>
                                                <CommandEmpty>Актор голосу не знайдений.</CommandEmpty>
                                                <CommandGroup>
                                                    {voiceActorList.map(actor => (
                                                        <CommandItem
                                                            key={actor.memberId}
                                                            onSelect={() => {
                                                                setSelectedVoiceActor(actor ? [actor] : null);

                                                            }}
                                                        >
                                                            <Check
                                                                className={selectedVoiceActor ? (selectedVoiceActor[0].memberId === actor.memberId ? "opacity-100" : "opacity-0") : "opacity-0"}/>
                                                            {actor.nickname}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                </div>
                            </div>
                        </div>

                            <DialogFooter>
                                <Button type="button" onClick={handleAddCharacter}>Застосувати</Button>
                            </DialogFooter>
                            {addedCharacterId && (<p>Персонаж успішно додано з ID: {addedCharacterId}</p>)}
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex items-center py-4">
                <Input placeholder="Пошук за ім'ям персонажа..." value={searchQuery}
                       onChange={(event) => setSearchQuery(event.target.value)} className="max-w-sm"/>
            </div>
            <DataTable columns={columns}
                       data={characterList.filter(char => char.name.toLowerCase().includes(searchQuery.toLowerCase()))}/>
        </div>
    );
}
