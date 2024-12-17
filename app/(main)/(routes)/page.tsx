"use client"

import HeroSection from "@/components/main/hero-section";
import InfiniteImageScroll from "@/components/main/infinite-image";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from "@/components/ui/input";
import HeadTitle from "@/components/main/head-title";
import React, {useEffect, useState} from "react";
import PopAnimeComponent from "@/components/main/pop-anime-component";
import {getAllGenres} from "@/lib/db/userDB";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Badge} from "@/components/ui/badge";


type Genre = {
    genreId: number;
    genreName: string;
};

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');

    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        // Отримання жанрів при завантаженні компонента
        const fetchGenres = async () => {
            const data = await getAllGenres();
            setGenres(data);
        };

        fetchGenres();
    }, []);


    const handleGenreSelect = (genreId: number) => {
        setSelectedGenres((prev) =>
            prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
        );
    };

    return (
        <div>
            <div className="hero h-full w-full overflow-hidden flex">
                <HeroSection />
            </div>
            <div className="hero">

                <div className="mx-auto max-w-screen-xl flex my-5" id="target-element">
                    <HeadTitle text="наші" highlight="проєкти"/>
                </div>


                <InfiniteImageScroll images={Array.from({length: 18}, (_, i) => `/infinite/${i + 1}.png`)}/>
                <div className="mx-auto max-w-screen-xl flex flex-col justify-center py-10">
                    <div className="flex w-full h-auto bg-accent items-center rounded-md px-3">
                        <Search/>
                        <Input placeholder="Пошук"
                               value={searchQuery}
                               onChange={handleSearchChange}
                               className="bg-transparent border-transparent outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="focus-visible:ring-offset-0 focus-visible:ring-0">
                                    <SlidersHorizontal />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-[300px] max-h-[400px] overflow-y-auto p-2">
                                <ul>
                                    {genres.map((genre) => (
                                        <Badge
                                            variant="secondary"
                                            key={genre.genreId}
                                            onClick={() => handleGenreSelect(genre.genreId)}
                                            className={`cursor-pointer m-1 ${
                                                selectedGenres.includes(genre.genreId) ? "bg-blue-500/50 text-white" : "hover:bg-black/5"
                                            }`}
                                        >
                                            {genre.genreName}
                                        </Badge>
                                    ))}
                                </ul>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="mx-auto max-w-screen-xl py-4 box-content">
                    <PopAnimeComponent searchQuery={searchQuery} selectedGenres={selectedGenres}/>
                </div>
            </div>
          </div>
  );
}
