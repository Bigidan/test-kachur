import {
    Cloud,
    Keyboard,
    SlidersVertical,
    LogOut,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
    Ellipsis,
} from "lucide-react"

import Image from 'next/image'

import React from 'react';
import { HeaderNavigation } from "@/components/navigation/header-navigation";
import { ModeToggle } from "@/components/mode-toggle";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { Button } from '../ui/button';
import { DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator,
    DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu';
import Link from "next/link";

const MainHeaderBar = async () => {
    return (
        <header
            className="p-5 sticky top-0 z-40 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-around">
                <Link href="/">
                    <div className="mr-4 flex max-lg:hidden items-center justify-between space-x-2">
                        <Image src="/logo.png" alt="logo" width="70" height="70"/>
                        <h1 className="uppercase font-black text-5xl text-nowrap">Студія Качур</h1>
                    </div>
                </Link>
                <div className="flex items-center justify-between space-x-6 max-lg:justify-end">
                    <HeaderNavigation />
                    <div className="mx-12">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="link" size="icon">
                                <Avatar>
                                    <AvatarImage src="https://avatars.githubusercontent.com/u/73254585?v=4"></AvatarImage>
                                    <AvatarFallback> </AvatarFallback>

                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel className="text-center">Я та моя сім'я</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <User />
                                    Профіль
                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings />
                                    Налаштування
                                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Keyboard />
                                    Скорочення клавіш
                                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Users />
                                    Команда
                                </DropdownMenuItem>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Швидкий вибір</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>
                                                <UserPlus />
                                                Додавання
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <SlidersVertical />
                                                Модерація
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <Ellipsis />
                                                Інше
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Plus />
                                Додати серію
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <PlusCircle />
                                Додати проєкт
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <Cloud />
                                API
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <LogOut />
                                Вийти з облікового запису
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                    <ModeToggle/>
                </div>
            </div>
        </header>
    );
};

export default MainHeaderBar;