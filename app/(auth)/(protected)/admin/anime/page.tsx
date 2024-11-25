"use client"
// AnimePage.tsx
import { useEffect, useState } from "react";
import {
    getAllAnime,
    updateAnime,
    deleteAnime,
    addAnime,
    getAllGenres,
    getTeam,
    getAllAnimeRelateds, saveAssociationsToDatabase, getAllAnimeData
} from "@/lib/db/admin";
import { Anime } from "@/components/types/anime-types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/main/data-table";
import { Button } from "@/components/ui/button";
import {ArrowUpDown, MoreHorizontal, Plus} from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover";
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from "@/components/ui/command";


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";

type ReferenceItem = {
    id: number;
    name: string;
};

const formatDateToString = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}${month}${year}`;
};

const parseStringToDate = (dateString: string): Date => {
    const day = parseInt(dateString.slice(0, 2), 10);
    const month = parseInt(dateString.slice(2, 4), 10) - 1;
    const year = parseInt(dateString.slice(4, 8), 10);
    return new Date(year, month, day);
};

export default function AnimePage() {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [animeTypes, setAnimeTypes] = useState<ReferenceItem[]>([]);
    const [animeStatuses, setAnimeStatuses] = useState<ReferenceItem[]>([]);
    const [animeSources, setAnimeSources] = useState<ReferenceItem[]>([]);
    const [animeAges, setAnimeAges] = useState<ReferenceItem[]>([]);
    const [animeStudios, setAnimeStudios] = useState<ReferenceItem[]>([]);
    const [directors, setDirectors] = useState<ReferenceItem[]>([]);

    const [searchQuery, setSearchQuery] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [editingAnimeId, setEditingAnimeId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<Anime>>({});
    const [selectedType, setSelectedType] = useState<{id: number, name: string}[] | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<{id: number, name: string}[] | null>(null);
    const [selectedSource, setSelectedSource] = useState<{id: number, name: string}[] | null>(null);
    const [selectedAge, setSelectedAge] = useState<{id: number, name: string}[] | null>(null);
    const [selectedStudio, setSelectedStudio] = useState<{id: number, name: string}[] | null>(null);
    const [selectedDirector, setSelectedDirector] = useState<{id: number, name: string}[] | null>(null);
    const [openTypeSelect, setOpenTypeSelect] = useState(false);
    const [openStatusSelect, setOpenStatusSelect] = useState(false);
    const [openSourceSelect, setOpenSourceSelect] = useState(false);
    const [openAgeSelect, setOpenAgeSelect] = useState(false);
    const [openStudioSelect, setOpenStudioSelect] = useState(false);
    const [openDirectorSelect, setOpenDirectorSelect] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [isAddOpen, setIsAddDialogOpen] = useState(false);


    const [genres, setGenres] = useState<ReferenceItem[]>([]);
    const [teamMembers, setTeamMembers] = useState<ReferenceItem[]>([]);

    const [isAssociationsDialogOpen, setIsAssociationsDialogOpen] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState<{ id: number, name: string }[]>([]);
    const [selectedTranslators, setSelectedTranslators] = useState<{ id: number, name: string }[]>([]);
    const [selectedEditors, setSelectedEditors] = useState<{ id: number, name: string }[]>([]);
    const [selectedSoundDesigners, setSelectedSoundDesigners] = useState<{ id: number, name: string }[]>([]);
    const [selectedVisualArtists, setSelectedVisualArtists] = useState<{ id: number, name: string }[]>([]);
    const [selectedDubDirectors, setSelectedDubDirectors] = useState<{ id: number, name: string }[]>([]);
    const [selectedVocals, setSelectedVocals] = useState<{ id: number, name: string }[]>([]);
    const [selectedVoiceActors, setSelectedVoiceActors] = useState<{ id: number, name: string }[]>([]);



    const toggleSelection = (
        item: { id: number, name: string },
        selected: { id: number, name: string }[],
        setSelected: React.Dispatch<React.SetStateAction<{ id: number, name: string }[]>>
    ) => {
        setSelected((prev) =>
            prev.some(i => i.id === item.id)
                ? prev.filter(i => i.id !== item.id) // Видаляємо, якщо елемент вже обраний
                : [...prev, item] // Додаємо, якщо елемент ще не обраний
        );
    };


    const handleSaveAssociations = async () => {
        if (editingAnimeId)
        try {
            await saveAssociationsToDatabase({
                animeId: editingAnimeId,
                genres: selectedGenres.map(g => g.id),
                translators: selectedTranslators.map(t => t.id),
                editors: selectedEditors.map(e => e.id),
                soundDesigners: selectedSoundDesigners.map(s => s.id),
                visualArtists: selectedVisualArtists.map(v => v.id),
                dubDirectors: selectedDubDirectors.map(d => d.id),
                vocals: selectedVocals.map(v => v.id),
                voiceActors: selectedVoiceActors.map(a => a.id),
            });
            alert("Зв'язки збережено успішно");
        } catch (error) {
            console.error("Помилка при збереженні зв'язків:", error);
        }
    };




    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const data = await getAllAnimeData();
                setAnimes(data.animes);
                setAnimeTypes(data.types);
                setAnimeStatuses(data.statuses);
                setAnimeSources(data.sources);
                setAnimeAges(data.ages);
                setAnimeStudios(data.studios);
                setDirectors(data.directors);
            } catch (error) {
                console.error('Failed to fetch anime data:', error);
                // Тут можна додати відображення помилки для користувача
            }
        };

        fetchAllData();

        fetchGenres();
        fetchTeamMembers();
    }, []);

    const fetchAnimes = async () => {
        const data = await getAllAnime();
        setAnimes(data);
    };

    const handleUpdateAnime = async () => {
        if (
            !selectedType || !selectedStatus || !selectedSource ||
            !selectedAge || !selectedStudio || !selectedDirector || !editingAnimeId
        ) return;

        try {
            await updateAnime(
                editingAnimeId,
                selectedType[0].id,
                selectedStatus[0].id,
                selectedSource[0].id,
                selectedAge[0].id,
                selectedStudio[0].id,
                selectedDirector[0].id,
                formData.nameUkr || "",
                formData.nameJap || "",
                formData.nameEng || "",
                formData.episodesExpected || 0,
                formData.rating || "",
                formData.releaseDate || new Date(),
                formData.description || "",
                formData.trailerLink || "",
                formData.headerImage || "",
                formData.shortDescription || "",
            );

            await fetchAnimes();
            resetForm();
        } catch (error) {
            console.error("Помилка при оновленні аніме:", error);
            alert("Помилка при оновленні аніме");
        }
    };
    const handleAddAnime = async () => {
        if (
            !selectedType || !selectedStatus || !selectedSource ||
            !selectedAge || !selectedStudio || !selectedDirector
        ) return;
        try {
            await addAnime(
                selectedType[0].id,
                selectedStatus[0].id,
                selectedSource[0].id,
                selectedAge[0].id,
                selectedStudio[0].id,
                selectedDirector[0].id,
                formData.nameUkr || "",
                formData.nameJap || "",
                formData.nameEng || "",
                formData.episodesExpected || 0,
                formData.rating || "",
                formData.releaseDate || new Date(),
                formData.description || "",
                formData.trailerLink || "",
                formData.headerImage || "",
                formData.shortDescription || "",
            );

            await fetchAnimes();
            resetForm();
        } catch (error) {
            console.error("Помилка при додаванні аніме:", error);
            alert("Помилка при додаванні аніме");
        }
    };
    const handleDeleteAnime = async (animeId: number) => {
        try {
            await deleteAnime(animeId);
            await fetchAnimes();
        } catch (error) {
            console.error("Помилка при видаленні аніме:", error);
            alert("Помилка при видаленні аніме");
        }
    };


    const openConfirmationDialog = () => {
        setIsDialogOpen(true);
    };

    const fetchGenres = async () => {
        const data = await getAllGenres();
        const g = data.map((x) => ({ id: x.genreId, name: x.genreName }));
        setGenres(g);
    };
    const fetchTeamMembers = async () => {
        const data = await getTeam();
        const g = data.map((x) => ({ id: x.memberId, name: (x.nickname ? x.nickname : "") }));
        setTeamMembers(g);
    };


    const resetForm = () => {
        setFormData({});
        setSelectedType(null);
        setSelectedStatus(null);
        setSelectedSource(null);
        setSelectedAge(null);
        setSelectedStudio(null);
        setSelectedDirector(null);
        setIsEditing(false);
        setEditingAnimeId(null);
        setIsAddDialogOpen(false);

        setIsAssociationsDialogOpen(false);
        setSelectedGenres([]);
        setSelectedTranslators([]);
        setSelectedEditors([]);
        setSelectedSoundDesigners([]);
        setSelectedVisualArtists([]);
        setSelectedDubDirectors([]);
        setSelectedVocals([]);
        setSelectedVoiceActors([]);
    };

    const startEditing = (anime: Anime) => {
        setIsEditing(true);
        setEditingAnimeId(anime.animeId);
        setFormData({
            nameUkr: anime.nameUkr,
            nameJap: anime.nameJap,
            nameEng: anime.nameEng,
            episodesExpected: anime.episodesExpected,
            rating: anime.rating,
            releaseDate: anime.releaseDate,
            description: anime.description,
            trailerLink: anime.trailerLink,
            headerImage: anime.headerImage,
        });

        const selectedType = animeTypes.find(type => type.id === anime.typeId);
        setSelectedType(selectedType ? [selectedType] : null);

        const selectedStatus = animeStatuses.find(status => status.id === anime.statusId);
        setSelectedStatus(selectedStatus ? [selectedStatus] : null);

        const selectedSource = animeSources.find(source => source.id === anime.sourceId);
        setSelectedSource(selectedSource ? [selectedSource] : null);

        const selectedAge = animeAges.find(age => age.id === anime.ageId);
        setSelectedAge(selectedAge ? [selectedAge] : null);

        const selectedStudio = animeStudios.find(studio => studio.id === anime.studioId);
        setSelectedStudio(selectedStudio ? [selectedStudio] : null);

        const selectedDirector = directors.find(director => director.id === anime.directorId);
        setSelectedDirector(selectedDirector ? [selectedDirector] : null);
    };
    const startAdding = () => {
        setIsAddDialogOpen(true);
    };
    const startMultiAdding = async (anime: Anime) => {
        setIsAssociationsDialogOpen(true);
        setEditingAnimeId(anime.animeId);

        const allItems = await getAllAnimeRelateds(anime.animeId);

        const genreIds = new Set<number>();
        const translatorIds = new Set<number>();
        const editorIds = new Set<number>();
        const soundDesignerIds = new Set<number>();
        const visualArtistIds = new Set<number>();
        const dubDirectorIds = new Set<number>();
        const vocalIds = new Set<number>();
        const voiceActorIds = new Set<number>();

        allItems.forEach((item) => {
            if (item.anime_genre && item.anime_genre.genreId) {
                genreIds.add(item.anime_genre.genreId);
            }
            if (item.anime_translate && item.anime_translate.memberId) {
                translatorIds.add(item.anime_translate.memberId);
            }
            if (item.anime_editing && item.anime_editing.memberId) {
                editorIds.add(item.anime_editing.memberId);
            }
            if (item.anime_sound && item.anime_sound.memberId) {
                soundDesignerIds.add(item.anime_sound.memberId);
            }
            if (item.anime_video_editing && item.anime_video_editing.memberId) {
                visualArtistIds.add(item.anime_video_editing.memberId);
            }
            if (item.anime_dub_director && item.anime_dub_director.memberId) {
                dubDirectorIds.add(item.anime_dub_director.memberId);
            }
            if (item.anime_vocals && item.anime_vocals.memberId) {
                vocalIds.add(item.anime_vocals.memberId);
            }
            if (item.anime_voice_actors && item.anime_voice_actors.memberId) {
                voiceActorIds.add(item.anime_voice_actors.memberId);
            }
        });

        const selectedGenres = genres.filter((genre) => genreIds.has(genre.id));

        // Фільтруємо з `teamMembers` відповідні типи учасників
        const selectedTranslators = teamMembers.filter((member) => translatorIds.has(member.id));
        const selectedEditors = teamMembers.filter((member) => editorIds.has(member.id));
        const selectedSoundDesigners = teamMembers.filter((member) => soundDesignerIds.has(member.id));
        const selectedVisualArtists = teamMembers.filter((member) => visualArtistIds.has(member.id));
        const selectedDubDirectors = teamMembers.filter((member) => dubDirectorIds.has(member.id));
        const selectedVocals = teamMembers.filter((member) => vocalIds.has(member.id));
        const selectedVoiceActors = teamMembers.filter((member) => voiceActorIds.has(member.id));


        setSelectedGenres(selectedGenres);
        setSelectedTranslators(selectedTranslators);
        setSelectedEditors(selectedEditors);
        setSelectedSoundDesigners(selectedSoundDesigners);
        setSelectedVisualArtists(selectedVisualArtists);
        setSelectedDubDirectors(selectedDubDirectors);
        setSelectedVocals(selectedVocals);
        setSelectedVoiceActors(selectedVoiceActors);
        //
        // const selectedTranslatorsL = animeStatuses.find(status => status.id === anime.statusId);
        // setSelectedTranslators(selectedTranslatorsL ? [selectedTranslatorsL] : null);
        //
        // const selectedEditorsL = animeSources.find(source => source.id === anime.sourceId);
        // setSelectedEditors(selectedEditorsL ? [selectedEditorsL] : null);
        //
        // const selectedSoundDesignersL = animeAges.find(age => age.id === anime.ageId);
        // setSelectedSoundDesigners(selectedSoundDesignersL ? [selectedSoundDesignersL] : null);
        //
        // const selectedVisualArtistsL = animeStudios.find(studio => studio.id === anime.studioId);
        // setSelectedVisualArtists(selectedVisualArtistsL ? [selectedVisualArtistsL] : null);
        //
        // const selectedDubDirectorsL = directors.find(director => director.id === anime.directorId);
        // setSelectedDubDirectors(selectedDubDirectorsL ? [selectedDubDirectorsL] : null);
        //
        // const selectedVocalsL
        // setSelectedVocals(selectedVocalsL ? [selectedVocalsL] : null);
        //
        // const selectedVoiceActorsL
        // setSelectedVoiceActors(selectedVoiceActorsL ? [selectedVoiceActorsL] : null);
    }

    const columns: ColumnDef<Anime>[] = [
        {
            accessorKey: "animeId",
            header: "ID",
        },
        {
            accessorKey: "nameUkr",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Назва (укр)
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "nameJap",
            header: "Назва (яп)",
        },
        {
            accessorKey: "nameEng",
            header: "Назва (анг)",
        },
        {
            accessorKey: "episodesExpected",
            header: "Очікується серій",
        },
        {
            accessorKey: "rating",
            header: "Рейтинг",
        },
        {
            accessorKey: "statusText",
            header: "Статус",
        },
        {
            header: "Дії",
            id: "actions",
            cell: ({ row }) => {
                const anime = row.original;

                return (
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => startEditing(anime)}>
                                    Редагувати
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => startMultiAdding(anime)}>
                                    Зв&#39;язки
                                </DropdownMenuItem>
                                
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-900"
                                    onClick={() => openConfirmationDialog()}
                                >
                                    Видалити
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Справді видалити аніме {anime.nameUkr}?</DialogTitle>
                                    <DialogDescription>
                                        Цю дію неможливо буде скасувати. Перед видаленням аніме доведеться видалити всі прив&#39;язані записи.
                                        <span className="text-red-900"> Можливо краще приховати?</span>
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="sm:justify-start">
                                    <Button variant="destructive"
                                            onClick={() => handleDeleteAnime(anime.animeId)}>
                                        Видалити
                                    </Button>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">
                                            Скасувати
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                );
            },
        },
    ];



    return (
        <div className="w-full flex flex-col space-x-3 p-4">
            <div className="flex items-center mb-4 space-x-5 p-4">
                <h1>Аніме</h1>
                <div>
                    <Button onClick={() => startAdding()}>
                        <Plus/> Додати
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={(open) => !open && resetForm()}>
                        <DialogContent className="sm:max-w-[1225px]">
                            <DialogHeader>
                                <DialogTitle>Додавання аніме</DialogTitle>
                                <DialogDescription>
                                    Введіть дані нового аніме
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4 animeDialog">
                                <div>
                                    <Label htmlFor="type" className="text-right">
                                        Тип
                                    </Label>
                                    <div className="col-span-3">
                                        <Popover open={openTypeSelect} onOpenChange={setOpenTypeSelect}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openTypeSelect}
                                                    className="w-full justify-between"
                                                >
                                                    {selectedType ? selectedType[0].name : "Виберіть тип..."}
                                                    <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[400px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Пошук типу..."/>
                                                    <CommandList>
                                                        <CommandEmpty>Типи не знайдено.</CommandEmpty>
                                                        <CommandGroup>
                                                            {animeTypes.map((type) => (
                                                                <CommandItem
                                                                    key={type.id}
                                                                    value={type.name}
                                                                    onSelect={() => {
                                                                        setSelectedType(type ? [type] : null);
                                                                        setOpenTypeSelect(false);
                                                                    }}
                                                                >
                                                                    {type.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="status" className="text-right">
                                        Статус
                                    </Label>
                                    <div className="col-span-3">
                                        <Popover open={openStatusSelect} onOpenChange={setOpenStatusSelect}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openStatusSelect}
                                                    className="w-full justify-between"
                                                >
                                                    {selectedStatus ? selectedStatus[0].name : "Виберіть статус..."}
                                                    <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[400px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Пошук статусу..."/>
                                                    <CommandList>
                                                        <CommandEmpty>Статуси не знайдено.</CommandEmpty>
                                                        <CommandGroup>
                                                            {animeStatuses.map((status) => (
                                                                <CommandItem
                                                                    key={status.id}
                                                                    value={status.name}
                                                                    onSelect={() => {
                                                                        setSelectedStatus(status ? [status] : null);
                                                                        setOpenStatusSelect(false);
                                                                    }}
                                                                >
                                                                    {status.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="source" className="text-right">
                                        Джерело
                                    </Label>
                                    <div className="col-span-3">
                                        <Popover open={openSourceSelect} onOpenChange={setOpenSourceSelect}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openSourceSelect}
                                                    className="w-full justify-between"
                                                >
                                                    {selectedSource ? selectedSource[0].name : "Виберіть джерело..."}
                                                    <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[400px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Пошук джерела..."/>
                                                    <CommandList>
                                                        <CommandEmpty>Джерела не знайдено.</CommandEmpty>
                                                        <CommandGroup>
                                                            {animeSources.map((source) => (
                                                                <CommandItem
                                                                    key={source.id}
                                                                    value={source.name}
                                                                    onSelect={() => {
                                                                        setSelectedSource(source ? [source] : null);
                                                                        setOpenSourceSelect(false);
                                                                    }}
                                                                >
                                                                    {source.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="age" className="text-right">
                                        Вікова категорія
                                    </Label>
                                    <div className="col-span-3">
                                        <Popover open={openAgeSelect} onOpenChange={setOpenAgeSelect}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openAgeSelect}
                                                    className="w-full justify-between"
                                                >
                                                    {selectedAge ? selectedAge[0].name : "Виберіть вікову категорію..."}
                                                    <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[400px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Пошук вікової категорії..."/>
                                                    <CommandList>
                                                        <CommandEmpty>Вікові категорії не знайдено.</CommandEmpty>
                                                        <CommandGroup>
                                                            {animeAges.map((age) => (
                                                                <CommandItem
                                                                    key={age.id}
                                                                    value={age.name}
                                                                    onSelect={() => {
                                                                        setSelectedAge(age ? [age] : null);
                                                                        setOpenAgeSelect(false);
                                                                    }}
                                                                >
                                                                    {age.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="studio" className="text-right">
                                        Студія
                                    </Label>
                                    <div className="col-span-3">
                                        <Popover open={openStudioSelect} onOpenChange={setOpenStudioSelect}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openStudioSelect}
                                                    className="w-full justify-between"
                                                >
                                                    {selectedStudio ? selectedStudio[0].name : "Виберіть студію..."}
                                                    <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[400px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Пошук студії..."/>
                                                    <CommandList>
                                                        <CommandEmpty>Студії не знайдено.</CommandEmpty>
                                                        <CommandGroup>
                                                            {animeStudios.map((studio) => (
                                                                <CommandItem
                                                                    key={studio.id}
                                                                    value={studio.name}
                                                                    onSelect={() => {
                                                                        setSelectedStudio(studio ? [studio] : null);
                                                                        setOpenStudioSelect(false);
                                                                    }}
                                                                >
                                                                    {studio.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="director" className="text-right">
                                        Режисер
                                    </Label>
                                    <div className="col-span-3">
                                        <Popover open={openDirectorSelect} onOpenChange={setOpenDirectorSelect}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openDirectorSelect}
                                                    className="w-full justify-between"
                                                >
                                                    {selectedDirector ? selectedDirector[0].name : "Виберіть режисера..."}
                                                    <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[400px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Пошук режисера..."/>
                                                    <CommandList>
                                                        <CommandEmpty>Режисери не знайдені.</CommandEmpty>
                                                        <CommandGroup>
                                                            {directors.map((director) => (
                                                                <CommandItem
                                                                    key={director.id}
                                                                    value={director.name}
                                                                    onSelect={() => {
                                                                        setSelectedDirector(director ? [director] : null);
                                                                        setOpenDirectorSelect(false);
                                                                    }}
                                                                >
                                                                    {director.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="nameUkr" className="text-right">
                                        Назва (укр)
                                    </Label>
                                    <Input
                                        id="nameUkr"
                                        value={formData.nameUkr || ""}
                                        onChange={(e) => setFormData({...formData, nameUkr: e.target.value})}
                                        className="col-span-3"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="nameJap" className="text-right">
                                        Назва (яп)
                                    </Label>
                                    <Input
                                        id="nameJap"
                                        value={formData.nameJap || ""}
                                        onChange={(e) => setFormData({...formData, nameJap: e.target.value})}
                                        className="col-span-3"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="nameEng" className="text-right">
                                        Назва (англ)
                                    </Label>
                                    <Input
                                        id="nameEng"
                                        value={formData.nameEng || ""}
                                        onChange={(e) => setFormData({...formData, nameEng: e.target.value})}
                                        className="col-span-3"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="episodesExpected" className="text-right">
                                        Очікується епізодів
                                    </Label>
                                    <InputOTP maxLength={2}
                                              id="episodesExpected"
                                              value={String(formData.episodesExpected || 0)}
                                              onChange={(e) => setFormData({...formData, episodesExpected: Number(e)})}
                                              className="col-span-3">
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0}/>
                                            <InputOTPSlot index={1}/>
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                <div>
                                    <Label htmlFor="rating" className="text-right">
                                        Рейтинг
                                    </Label>
                                    <Input
                                        id="rating"
                                        value={formData.rating || ""}
                                        onChange={(e) => setFormData({...formData, rating: e.target.value})}
                                        className="col-span-3"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="releaseDate" className="text-right">
                                        Дата виходу
                                    </Label>
                                    <InputOTP maxLength={8}
                                              id="releaseDate"
                                              value={formData.releaseDate ? formatDateToString(formData.releaseDate) : '0000000'}
                                              onChange={(e) => setFormData({
                                                  ...formData,
                                                  releaseDate: parseStringToDate(e)
                                              })}
                                              className="col-span-3">
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0}/>
                                            <InputOTPSlot index={1}/>
                                        </InputOTPGroup>
                                        <InputOTPSeparator/>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={2}/>
                                            <InputOTPSlot index={3}/>
                                        </InputOTPGroup>
                                        <InputOTPSeparator/>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={4}/>
                                            <InputOTPSlot index={5}/>
                                            <InputOTPSlot index={6}/>
                                            <InputOTPSlot index={7}/>
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-right">
                                        Опис
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description || ""}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="col-span-3"/>
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-right">
                                        Короткий опис
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.shortDescription || ""}
                                        onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                                        className="col-span-3"/>
                                </div>


                                <div>
                                    <Label htmlFor="trailerLink" className="text-right">
                                        Трейлер
                                    </Label>
                                    <Input
                                        id="trailerLink"
                                        value={formData.trailerLink || ""}
                                        onChange={(e) => setFormData({...formData, trailerLink: e.target.value})}
                                        className="col-span-3"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="headerImage" className="text-right">
                                        Зображення
                                    </Label>
                                    <Input
                                        id="headerImage"
                                        value={formData.headerImage || ""}
                                        onChange={(e) => setFormData({...formData, headerImage: e.target.value})}
                                        className="col-span-3"
                                    />
                                </div>

                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Скасувати
                                </Button>
                                <Button type="button" onClick={handleAddAnime}>
                                    Додати
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex items-center py-4">
                <Input
                    placeholder="Пошук аніме..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="max-w-sm"
                />
            </div>

            <DataTable
                columns={columns}
                data={animes.filter(anime =>
                    anime.nameUkr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    anime.nameJap.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    anime.nameEng.toLowerCase().includes(searchQuery.toLowerCase())
                )}
            />


            <Dialog open={isEditing} onOpenChange={(open) => !open && resetForm()}>
                <DialogContent className="sm:max-w-[1225px]">
                    <DialogHeader>
                        <DialogTitle>Редагування аніме</DialogTitle>
                        <DialogDescription>
                            Змініть дані аніме
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4 animeDialog">
                        <div>
                            <Label htmlFor="type" className="text-right">
                                Тип
                            </Label>
                            <div className="col-span-3">
                                <Popover open={openTypeSelect} onOpenChange={setOpenTypeSelect}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openTypeSelect}
                                            className="w-full justify-between"
                                        >
                                            {selectedType ? selectedType[0].name : "Виберіть тип..."}
                                            <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Пошук типу..."/>
                                            <CommandList>
                                                <CommandEmpty>Типи не знайдено.</CommandEmpty>
                                                <CommandGroup>
                                                    {animeTypes.map((type) => (
                                                        <CommandItem
                                                            key={type.id}
                                                            value={type.name}
                                                            onSelect={() => {
                                                                setSelectedType(type ? [type] : null);
                                                                setOpenTypeSelect(false);
                                                            }}
                                                        >
                                                            {type.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="status" className="text-right">
                                Статус
                            </Label>
                            <div className="col-span-3">
                                <Popover open={openStatusSelect} onOpenChange={setOpenStatusSelect}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openStatusSelect}
                                            className="w-full justify-between"
                                        >
                                            {selectedStatus ? selectedStatus[0].name : "Виберіть статус..."}
                                            <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Пошук статусу..."/>
                                            <CommandList>
                                                <CommandEmpty>Статуси не знайдено.</CommandEmpty>
                                                <CommandGroup>
                                                    {animeStatuses.map((status) => (
                                                        <CommandItem
                                                            key={status.id}
                                                            value={status.name}
                                                            onSelect={() => {
                                                                setSelectedStatus(status ? [status] : null);
                                                                setOpenStatusSelect(false);
                                                            }}
                                                        >
                                                            {status.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="source" className="text-right">
                                Джерело
                            </Label>
                            <div className="col-span-3">
                                <Popover open={openSourceSelect} onOpenChange={setOpenSourceSelect}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openSourceSelect}
                                            className="w-full justify-between"
                                        >
                                            {selectedSource ? selectedSource[0].name : "Виберіть джерело..."}
                                            <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Пошук джерела..."/>
                                            <CommandList>
                                                <CommandEmpty>Джерела не знайдено.</CommandEmpty>
                                                <CommandGroup>
                                                    {animeSources.map((source) => (
                                                        <CommandItem
                                                            key={source.id}
                                                            value={source.name}
                                                            onSelect={() => {
                                                                setSelectedSource(source ? [source] : null);
                                                                setOpenSourceSelect(false);
                                                            }}
                                                        >
                                                            {source.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="age" className="text-right">
                                Вікова категорія
                            </Label>
                            <div className="col-span-3">
                                <Popover open={openAgeSelect} onOpenChange={setOpenAgeSelect}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openAgeSelect}
                                            className="w-full justify-between"
                                        >
                                            {selectedAge ? selectedAge[0].name : "Виберіть вікову категорію..."}
                                            <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Пошук вікової категорії..."/>
                                            <CommandList>
                                                <CommandEmpty>Вікові категорії не знайдено.</CommandEmpty>
                                                <CommandGroup>
                                                    {animeAges.map((age) => (
                                                        <CommandItem
                                                            key={age.id}
                                                            value={age.name}
                                                            onSelect={() => {
                                                                setSelectedAge(age ? [age] : null);
                                                                setOpenAgeSelect(false);
                                                            }}
                                                        >
                                                            {age.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="studio" className="text-right">
                                Студія
                            </Label>
                            <div className="col-span-3">
                                <Popover open={openStudioSelect} onOpenChange={setOpenStudioSelect}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openStudioSelect}
                                            className="w-full justify-between"
                                        >
                                            {selectedStudio ? selectedStudio[0].name : "Виберіть студію..."}
                                            <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Пошук студії..."/>
                                            <CommandList>
                                                <CommandEmpty>Студії не знайдено.</CommandEmpty>
                                                <CommandGroup>
                                                    {animeStudios.map((studio) => (
                                                        <CommandItem
                                                            key={studio.id}
                                                            value={studio.name}
                                                            onSelect={() => {
                                                                setSelectedStudio(studio ? [studio] : null);
                                                                setOpenStudioSelect(false);
                                                            }}
                                                        >
                                                            {studio.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="director" className="text-right">
                                Режисер
                            </Label>
                            <div className="col-span-3">
                                <Popover open={openDirectorSelect} onOpenChange={setOpenDirectorSelect}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openDirectorSelect}
                                            className="w-full justify-between"
                                        >
                                            {selectedDirector ? selectedDirector[0].name : "Виберіть режисера..."}
                                            <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Пошук режисера..."/>
                                            <CommandList>
                                                <CommandEmpty>Режисери не знайдені.</CommandEmpty>
                                                <CommandGroup>
                                                    {directors.map((director) => (
                                                        <CommandItem
                                                            key={director.id}
                                                            value={director.name}
                                                            onSelect={() => {
                                                                setSelectedDirector(director ? [director] : null);
                                                                setOpenDirectorSelect(false);
                                                            }}
                                                        >
                                                            {director.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="nameUkr" className="text-right">
                                Назва (укр)
                            </Label>
                            <Input
                                id="nameUkr"
                                value={formData.nameUkr || ""}
                                onChange={(e) => setFormData({...formData, nameUkr: e.target.value})}
                                className="col-span-3"
                            />
                        </div>
                        <div>
                            <Label htmlFor="nameJap" className="text-right">
                                Назва (яп)
                            </Label>
                            <Input
                                id="nameJap"
                                value={formData.nameJap || ""}
                                onChange={(e) => setFormData({...formData, nameJap: e.target.value})}
                                className="col-span-3"
                            />
                        </div>
                        <div>
                            <Label htmlFor="nameEng" className="text-right">
                                Назва (англ)
                            </Label>
                            <Input
                                id="nameEng"
                                value={formData.nameEng || ""}
                                onChange={(e) => setFormData({...formData, nameEng: e.target.value})}
                                className="col-span-3"
                            />
                        </div>

                        <div>
                            <Label htmlFor="episodesExpected" className="text-right">
                                Очікується епізодів
                            </Label>

                            <InputOTP maxLength={2}
                                      id="episodesExpected"
                                      value={String(formData.episodesExpected || 0)}
                                      onChange={(e) => setFormData({...formData, episodesExpected: Number(e)})}
                                      className="col-span-3">
                                <InputOTPGroup>
                                    <InputOTPSlot index={0}/>
                                    <InputOTPSlot index={1}/>
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        <div>
                            <Label htmlFor="rating" className="text-right">
                                Рейтинг
                            </Label>
                            <Input
                                id="rating"
                                value={formData.rating || ""}
                                onChange={(e) => setFormData({...formData, rating: e.target.value})}
                                className="col-span-3"
                            />
                        </div>

                        <div>
                            <Label htmlFor="releaseDate" className="text-right">
                                Дата виходу
                            </Label>

                            <InputOTP maxLength={8}
                                      id="releaseDate"
                                      value={formData.releaseDate ? formatDateToString(formData.releaseDate) : ''}
                                      onChange={(e) => setFormData({...formData, releaseDate: parseStringToDate(e)})}
                                      className="col-span-3">
                                <InputOTPGroup>
                                    <InputOTPSlot index={0}/>
                                    <InputOTPSlot index={1}/>
                                </InputOTPGroup>
                                <InputOTPSeparator/>
                                <InputOTPGroup>
                                    <InputOTPSlot index={2}/>
                                    <InputOTPSlot index={3}/>
                                </InputOTPGroup>
                                <InputOTPSeparator/>
                                <InputOTPGroup>
                                    <InputOTPSlot index={4}/>
                                    <InputOTPSlot index={5}/>
                                    <InputOTPSlot index={6}/>
                                    <InputOTPSlot index={7}/>
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <div>
                            <Label htmlFor="description" className="text-right">
                                Опис
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description || ""}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="col-span-3"/>
                        </div>

                        <div>
                            <Label htmlFor="description" className="text-right">
                                Короткий опис
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.shortDescription || ""}
                                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                                className="col-span-3"/>
                        </div>


                        <div>
                            <Label htmlFor="trailerLink" className="text-right">
                                Трейлер
                            </Label>
                            <Input
                                id="trailerLink"
                                value={formData.trailerLink || ""}
                                onChange={(e) => setFormData({...formData, trailerLink: e.target.value})}
                                className="col-span-3"
                            />
                        </div>
                        <div>
                            <Label htmlFor="headerImage" className="text-right">
                                Зображення
                            </Label>
                            <Input
                                id="trailerLink"
                                value={formData.headerImage || ""}
                                onChange={(e) => setFormData({...formData, headerImage: e.target.value})}
                                className="col-span-3"
                            />
                        </div>

                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={resetForm}>
                            Скасувати
                        </Button>
                        <Button type="button" onClick={handleUpdateAnime}>
                            Зберегти
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <Dialog open={isAssociationsDialogOpen} onOpenChange={(open) => !open && resetForm()}>
                <DialogContent className="sm:max-w-[1225px]">
                    <DialogHeader>
                        <DialogTitle>Призначення зв&#39;язків</DialogTitle>
                        <DialogDescription>Виберіть жанри, перекладачів, редакторів, звукорежисерів та інших учасників.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4 animeDialog">
                        {/* Вибір жанрів */}
                        <div>
                            <Label htmlFor="genres" className="text-right">Жанри</Label>
                            <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline"
                                                role="combobox"
                                                className="w-full justify-between">
                                            {selectedGenres.length > 0
                                                ? `Обрано жанрів: ${selectedGenres.length} `
                                                : "Оберіть жанри"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[450px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Пошук жанрів..."/>
                                            <CommandList>
                                                <CommandGroup>
                                                    {genres.map((genre) => (
                                                        <CommandItem key={genre.id}
                                                                     onSelect={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}>
                                                            <Checkbox
                                                                checked={selectedGenres.some(g => g.id === genre.id)}/>
                                                            <span className="ml-2">{genre.id} - {genre.name}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Вибір перекладачів */}
                        <div>
                            <Label htmlFor="translators" className="text-right">Перекладачі</Label>
                            <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline"
                                                className="w-full justify-between">
                                            {selectedTranslators.length > 0
                                                ? `Обрано перекладачів: ${selectedTranslators.length} `
                                                : "Оберіть перекладачів"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent  className="w-[450px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Пошук перекладачів..."/>
                                            <CommandList>
                                                <CommandGroup>
                                                    {teamMembers.map((translator) => (
                                                        <CommandItem key={translator.id}
                                                                     onSelect={() => toggleSelection(translator, selectedTranslators, setSelectedTranslators)}>
                                                            <Checkbox
                                                                checked={selectedTranslators.some(t => t.id === translator.id)}/>
                                                            <span
                                                                className="ml-2">{translator.id} - {translator.name}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Вибір редакторів */}
                        <div>
                            <Label htmlFor="editors" className="text-right">Редактори</Label>
                            <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline"
                                                className="w-full justify-between">
                                            {selectedEditors.length > 0
                                                ? `Обрано редакторів: ${selectedEditors.length} `
                                                : "Оберіть редакторів"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent  className="w-[450px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Пошук редакторів..."/>
                                            <CommandList>
                                                <CommandGroup>
                                                    {teamMembers.map((editor) => (
                                                        <CommandItem key={editor.id}
                                                                     onSelect={() => toggleSelection(editor, selectedEditors, setSelectedEditors)}>
                                                            <Checkbox
                                                                checked={selectedEditors.some(e => e.id === editor.id)}/>
                                                            <span className="ml-2">{editor.id} - {editor.name}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Повторити аналогічний блок для звукорежисерів, візуальних дизайнерів, режисерів дубляжу, вокалістів, акторів озвучування */}
                        {/* Вибір Саунд-дизайн та зведення */}
                        <div>
                            <Label htmlFor="editors" className="text-right">Саунд-дизайн та зведення</Label>
                            <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline"
                                                className="w-full justify-between">
                                            {selectedSoundDesigners.length > 0
                                                ? `Обрано звукарів: ${selectedSoundDesigners.length}`
                                                : "Оберіть звукарів"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Command>
                                            <CommandInput placeholder="Пошук звукарів..."/>
                                            <CommandList>
                                                <CommandGroup>
                                                    {teamMembers.map((editor) => (
                                                        <CommandItem key={editor.id}
                                                                     onSelect={() => toggleSelection(editor, selectedSoundDesigners, setSelectedSoundDesigners)}>
                                                            <Checkbox
                                                                checked={selectedSoundDesigners.some(e => e.id === editor.id)}/>
                                                            <span className="ml-2">{editor.id} - {editor.name}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Вибір Візуальний ряд */}
                        <div>
                            <Label htmlFor="visual" className="text-right">Візуальний ряд</Label>
                            <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline"
                                                className="w-full justify-between">
                                            {selectedVisualArtists.length > 0
                                                ? `Обрано візуальників: ${selectedVisualArtists.length}`
                                                : "Оберіть візуальників"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Command>
                                            <CommandInput placeholder="Пошук візуальників..."/>
                                            <CommandList>
                                                <CommandGroup>
                                                    {teamMembers.map((t) => (
                                                        <CommandItem key={t.id}
                                                                     onSelect={() => toggleSelection(t, selectedVisualArtists, setSelectedVisualArtists)}>
                                                            <Checkbox
                                                                checked={selectedVisualArtists.some(e => e.id === t.id)}/>
                                                            <span className="ml-2">{t.id} - {t.name}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Вибір Режисери дубляжу */}
                        <div>
                            <Label htmlFor="dubDirector" className="text-right">Режисери дубляжу</Label>
                            <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline"
                                                className="w-full justify-between">
                                            {selectedDubDirectors.length > 0
                                                ? `Обрано режисерів: ${selectedDubDirectors.length}`
                                                : "Оберіть режисерів"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Command>
                                            <CommandInput placeholder="Пошук режисерів..."/>
                                            <CommandList>
                                                <CommandGroup>
                                                    {teamMembers.map((t) => (
                                                        <CommandItem key={t.id}
                                                                     onSelect={() => toggleSelection(t, selectedDubDirectors, setSelectedDubDirectors)}>
                                                            <Checkbox
                                                                checked={selectedDubDirectors.some(e => e.id === t.id)}/>
                                                            <span className="ml-2">{t.id} - {t.name}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Вибір Вокал */}
                        <div>
                            <Label htmlFor="vocal" className="text-right">Вокал</Label>
                            <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline"
                                                className="w-full justify-between">
                                            {selectedVocals.length > 0
                                                ? `Обрано вокалістів: ${selectedVocals.length}`
                                                : "Оберіть вокалістів"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[450px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Пошук вокалістів..."/>
                                            <CommandList>
                                                <CommandGroup>
                                                    {teamMembers.map((vocal) => (
                                                        <CommandItem key={vocal.id}
                                                                     onSelect={() => toggleSelection(vocal, selectedVocals, setSelectedVocals)}>
                                                            <Checkbox
                                                                checked={selectedVocals.some(e => e.id === vocal.id)}/>
                                                            <span className="ml-2">{vocal.id} - {vocal.name}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Вибір Актори озвучення */}
                        <div>
                            <Label htmlFor="voiceActors" className="text-right">Актори озвучення</Label>
                            <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline"
                                                className="w-full justify-between">
                                            {selectedVoiceActors.length > 0
                                                ? `Обрано акторів: ${selectedVoiceActors.length}`
                                                : "Оберіть акторів"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[450px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Пошук акторів..."/>
                                            <CommandList>
                                                <CommandGroup>
                                                    {teamMembers.map((voiceActors) => (
                                                        <CommandItem key={voiceActors.id}
                                                                     onSelect={() => toggleSelection(voiceActors, selectedVoiceActors, setSelectedVoiceActors)}>
                                                            <Checkbox
                                                                checked={selectedVoiceActors.some(e => e.id === voiceActors.id)}/>
                                                            <span
                                                                className="ml-2">{voiceActors.id} - {voiceActors.name}</span>
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
                        <Button onClick={handleSaveAssociations}>Зберегти</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </div>
    );
}