"use client"

import {
    Sidebar,
    SidebarProvider,
    SidebarTrigger,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarFooter, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
} from "@/components/ui/sidebar";

import {Suspense, useState} from 'react';

import Link from "next/link";
import { Home, LayoutGrid, Layers, SquareLibrary, FileUser, LayoutDashboard, Pen, Users, UserRoundCog, Image as ImageIco, FileVideo } from "lucide-react";

import Image from "next/image";
import * as React from "react";
import HomePage from "@/app/(auth)/(protected)/admin/home/page";
import AnimePage from "@/app/(auth)/(protected)/admin/anime/page";
import EpisodesPage from "@/app/(auth)/(protected)/admin/episodes/page";
import CharacterPage from "@/app/(auth)/(protected)/admin/character/page";
import AnimeGroupPage from "@/app/(auth)/(protected)/admin/anime-group/page";
import TeamPage from "@/app/(auth)/(protected)/admin/team/page";
import RolePage from "@/app/(auth)/(protected)/admin/role/page";
import UserPage from "@/app/(auth)/(protected)/admin/user/page";
import GenrePage from "@/app/(auth)/(protected)/admin/genre/page";

const items = [
    { title: "Головна", key: "home", icon: Home },
    { title: "Аніме", key: "anime", icon: LayoutGrid },
    { title: "Епізоди", key: "episodes", icon: Layers },
];

const data = [
    { title: "Жанри", key: "genres", icon: SquareLibrary },
    { title: "Персонажі", key: "characters", icon: FileUser },
    { title: "Групи для аніме", key: "animeGroups", icon: LayoutDashboard },
];

const administrative = [
    { title: "Команда", key: "team", icon: Users },
    { title: "Ролі", key: "roles", icon: Pen },
    { title: "Користувачі", key: "users", icon: UserRoundCog },
];

const files = [
    { title: "Зображення", key: "images", icon: ImageIco },
    { title: "Відео", key: "video", icon: FileVideo },
];

const AdminPage = () =>  {
    const [activePage, setActivePage] = useState("home");

    // Функція для рендеру вмісту залежно від обраної сторінки
    const renderPage = () => {
        switch (activePage) {
            case "home":
                return <HomePage />;
            case "anime":
                return <AnimePage />;
            case "episodes":
                return <EpisodesPage />;
            case "genres":
                return <GenrePage />;
            case "characters":
                return <CharacterPage />;
            case "animeGroups":
                return <AnimeGroupPage />;
            case "team":
                return <TeamPage />;
            case "roles":
                return <RolePage />;
            case "users":
                return <UserPage />;

            default:
                return <div>Виберіть пункт меню</div>;
        }
    };

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <Link href="/">
                    <SidebarHeader className="flex flex-row items-center space-x-3">
                        <Image src="/logo.png" alt="logo" width="40" height="40"/>
                        <div className="group-data-[collapsible=icon]:hidden text-nowrap">Адмін-панель</div>
                    </SidebarHeader>
                </Link>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Основне</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.key}>
                                        <SidebarMenuButton asChild>
                                            <button onClick={() => setActivePage(item.key)}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Дані</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {data.map((item) => (
                                    <SidebarMenuItem key={item.key}>
                                        <SidebarMenuButton asChild>
                                            <button onClick={() => setActivePage(item.key)}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Адміністрування</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {administrative.map((item) => (
                                    <SidebarMenuItem key={item.key}>
                                        <SidebarMenuButton asChild>
                                            <button onClick={() => setActivePage(item.key)}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Керування файлами</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {files.map((item) => (
                                    <SidebarMenuItem key={item.key}>
                                        <SidebarMenuButton asChild>
                                            <button onClick={() => setActivePage(item.key)}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter className="group-data-[collapsible=icon]:hidden text-nowrap">Футер</SidebarFooter>
            </Sidebar>
            <Suspense fallback={<p>sss</p>}>
                <main className="w-full">
                    <SidebarTrigger />
                    <div>
                        {renderPage()}
                    </div>
                </main>
            </Suspense>
        </SidebarProvider>
    )
}

export default AdminPage;
