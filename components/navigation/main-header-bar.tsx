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
} from "lucide-react"

import { User as UserType } from "@/components/types/user";

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
import {getSession} from "@/lib/auth/session";
import LogOutButton from "@/components/navigation/log-out-button";

const MainHeaderBar = async () => {

    const parsed = await getSession();
    const user = parsed?.user as UserType;


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
                        {user != undefined ? (
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
                            <DropdownMenuLabel className="text-center">Я та моя сім&#39;я</DropdownMenuLabel>
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
                                                Додавання
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin/s?s=anime">
                                                <SlidersVertical />
                                                Модерація
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin/s?s=anime_group">
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
                    <ModeToggle/>
                </div>
            </div>
        </header>
    );
};

export default MainHeaderBar;