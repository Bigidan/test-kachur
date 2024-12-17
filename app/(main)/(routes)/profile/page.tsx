"use client"

import React, { useEffect, useState } from 'react';
import { User as UserType } from "@/components/types/user";
import { getSession } from "@/lib/auth/session";
import { Loader } from "lucide-react";
import {getUserFavorites, setNewUserImage} from "@/lib/db/userDB";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import PhotoUpload from "@/components/file/photo-upload";

type Fav = {
    animeId: number | null;
    nameUkr: string | null;
    headerImage: string | null;
    statusId: number | null;
    statusName: string | null;
}

const ProfilePage = () => {

    const [user, setUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [fav, setFav] = useState<Fav[]>([]);

    const fetchUser = async () => {
        setIsLoading(true); // Встановлюємо стан завантаження
        try {
            const parsed = await getSession();
            setUser(parsed?.user as UserType);
        } catch (error) {
            console.error("Error fetching user:", error);
            window.location.href = '/login';
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFavorites = async (userId: number) => {
        if (userId) {
            try {
                const favorites = await getUserFavorites(userId);
                setFav(favorites);
                console.log(favorites);
            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user?.userId) {
            fetchFavorites(user.userId);
        }
    }, [user]);

    const handleImageChange = (fileUrl: string | null, user: UserType) => {
        user.image = fileUrl;
        if (fileUrl) {
            setUser(user);
            setNewUserImage(fileUrl, user.userId);
        }
    }

    return (
        <div className="mx-auto flex justify-center" style={{maxWidth: '70%'}}>
            {isLoading ? (
                    <div className="w-full h-full flex justify-center items-center">
                        <Loader className="animate-spin" style={{ width: "40px", height: "40px" }} />
                    </div>
            ) : user ? (
                <div className="flex flex-row w-full gap-2">
                    <div className="flex flex-col border-r-2 p-2 min-w-[220px]">
                        <img src={user.image || ""} alt="" style={{ width: "200px", height: "200px" }} className="rounded-md" />
                        <div className="border-y-2 py-2 my-2">{user.nickname}</div>
                        <div className="my-1">Змінити зображення профілю:</div>
                        <PhotoUpload fileName={user.nickname} onFileUpload={(fileUrl) => {
                            handleImageChange(fileUrl, user);
                        }}/>



                    </div>
                    <div className="flex flex-col p-2">
                        <div className="uppercase font-bold text-[25px] border-b-2 mb-4">
                            Обрані проєкти
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                        {
                            fav?.map((fav: Fav, index) => (
                                <Link href={"/watch/" + fav.animeId} key={index} className="hover:bg-white/5 transition rounded-md overflow-hidden" >
                                    <div className="flex flex-row gap-2">
                                        <img src={fav.headerImage || ""} alt="" className="w-[90px] rounded-md" style={{ aspectRatio: 9 / 13, objectFit: "cover" }} />
                                        <div className="text-wrap text-[20px] flex flex-col gap-2">
                                            {fav.nameUkr}
                                            <Badge className="w-fit"
                                                variant={((fav.statusId) as 1 | 2 | 3) || 1}
                                            >{fav.statusName}</Badge>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                        </div>
                    </div>
                </div>
            ) :
                <div className="flex text-sm flex-row gap-2">
                    Помилка отримання даних.
                </div>
            }
        </div>
    );
};

export default ProfilePage;
