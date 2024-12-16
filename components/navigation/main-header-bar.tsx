"use client";

import {
    Cloud,
    SlidersVertical,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
    Ellipsis,
    Search, SlidersHorizontal,
} from "lucide-react"

import { User as UserType } from "@/components/types/user";

import Image from 'next/image'

import React, {useEffect, useState} from 'react';
import { HeaderNavigation } from "@/components/navigation/header-navigation";
// import { ModeToggle } from "@/components/mode-toggle";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { Button } from '../ui/button';
import { DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator,
    DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu';
import Link from "next/link";
import {getSession} from "@/lib/auth/session";
import LogOutButton from "@/components/navigation/log-out-button";
import {Input} from "@/components/ui/input";
import PopAnimeComponent from "@/components/main/pop-anime-component";

const MainHeaderBar = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState<UserType | null>(null); // null для "користувача ще не завантажено"
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchUser = async () => {
        setIsLoading(true); // Встановлюємо стан завантаження
        try {
            const parsed = await getSession();
            setUser(parsed?.user as UserType);
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null); // У разі помилки вважаємо, що користувача немає
        } finally {
            setIsLoading(false); // Завершуємо завантаження
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);


    return (
        <header
            className="py-5 sticky top-0 z-40 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between" style={{ maxWidth: '70%' }}>
                <Link href="/">
                    <div className="mr-4 flex max-lg:hidden items-center justify-between space-x-2">
                        <Image src="/logo.png" alt="logo" width="70" height="70"/>
                        <h1 className="uppercase font-black text-5xl text-nowrap">Студія Качур</h1>
                    </div>
                </Link>
                <div className="flex items-center justify-between space-x-6 max-lg:justify-end">
                    <HeaderNavigation />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="focus-visible:ring-offset-0 focus-visible:ring-0">
                                <Search/>
                                <span className="sr-only">Пошук</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[1200px] max-h-[714px] p-4">
                            <div className="flex mb-4">
                                <div className="flex items-center justify-center">
                                    <Search/>
                                </div>
                                <Input placeholder="Пошук"
                                       value={searchQuery}
                                       onChange={(e) => setSearchQuery(e.target.value)}
                                       className="bg-transparent border-transparent outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
                                <Button variant="ghost" size="icon">
                                    <SlidersHorizontal/>
                                </Button>
                            </div>
                            <div>
                                <PopAnimeComponent searchQuery={searchQuery} infiniteScroll={false}/>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="mx-12">
                        {isLoading ? (
                            <Avatar>
                                <AvatarFallback><User/></AvatarFallback>
                            </Avatar>
                        ) : user ? (
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="link" size="icon">
                                <Avatar>
                                    <AvatarImage src={user.image || ""}></AvatarImage>
                                    <AvatarFallback><User/></AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>


                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel className="text-center">{user.nickname || "Гість"}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">
                                        <User />
                                        Профіль
                                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/profile/settings">
                                        <Settings />
                                        Налаштування
                                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />

                            {user.roleId == 3 ? (
                                <div>
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link href="/admin/s?s=team">
                                        <Users />
                                        Команда
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Швидкий вибір</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin/s?s=users">
                                                <UserPlus />
                                                Користувачі
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin/s?s=home">
                                                <SlidersVertical />
                                                Модерація
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin/s?s=animeGroups">
                                                <Ellipsis />
                                                Інше
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>


                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/admin/s?s=episodes">
                                    <Plus />
                                    Додати серію
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/admin/s?s=anime">
                                    <PlusCircle />
                                    Додати проєкт
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <Cloud />
                                API
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                                </div>
                            ) : null}
                            <LogOutButton/>
                        </DropdownMenuContent>

                        </DropdownMenu>
                        ) : <div className="flex text-sm flex-row gap-2">
                            <Button asChild variant="outline">
                                <Link href="/login">Увійти</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/register">Зареєструватися</Link>
                            </Button>
                        </div>
                        }
                    </div>
                    {/*<ModeToggle/>*/}



                </div>
            </div>
        </header>
    );
};

export default MainHeaderBar;