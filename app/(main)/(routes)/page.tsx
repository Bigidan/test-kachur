"use client"

import HeroSection from "@/components/main/hero-section";
import InfiniteImageScroll from "@/components/main/infinite-image";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from "@/components/ui/input";
import HeadTitle from "@/components/main/head-title";
import React, { useState } from "react";
import PopAnimeComponent from "@/components/main/pop-anime-component";


export default function Home() {

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
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
                        <Button variant="ghost" size="icon">
                            <SlidersHorizontal/>
                        </Button>
                    </div>
                </div>

                <div className="mx-auto max-w-screen-xl py-4 box-content">
                    <PopAnimeComponent searchQuery={searchQuery}/>
                </div>
            </div>
          </div>
  );
}
