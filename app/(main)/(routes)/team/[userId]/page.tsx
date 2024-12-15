"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {notFound, useParams} from "next/navigation";
import { getCharactersByActorId, getDubberPage} from "@/lib/db/userDB";
import Link from "next/link";

interface DubberData {
    memberNickname: string | null;
    memberName: string | null;
    memberId: number;
    userId: number | null;
    art: string | null;
}

type ProfileType = {
    name: string;
    animeId: number | null;
    image: string | null;
    popularityId: number | null;
    characterId: number;
    voiceActorId: number | null;
    animeName: string | null;
}

export default function TeamUserId() {
    const params = useParams();
    const [dubberData, setDubberData] = useState<DubberData | null>(null); // Стан для збереження даних
    const [loading, setLoading] = useState<boolean>(true); // Стан для відображення завантаження
    const [error, setError] = useState<string | null>(null); // Стан для обробки помилок

    const [profileData, setProfileData] = useState<ProfileType[] | null>(null);


    useEffect(() => {
        const userIdString = params.userId;

        if (typeof userIdString !== "string") {
            console.error("Invalid userId: not a string.");
            setError("Invalid userId: not a string.");
            setLoading(false);
            return;
        }

        const userId = parseInt(userIdString, 10);

        if (isNaN(userId)) {
            console.error("Invalid userId: cannot be converted to a number.");
            setError("Invalid userId: cannot be converted to a number.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // Завантажуємо дані
        getDubberPage(userId)
            .then((data) => {
                if (data.length === 0) {
                    setError("No data found for this user.");
                } else {
                    setDubberData(data[0]); // Беремо перший результат

                    getCharactersByActorId(data[0].memberId || 0, 0)
                        .then((characterData) => {
                            setProfileData(characterData);
                        })
                }

            })
            .catch((err) => {
                console.error("Failed to fetch user data:", err);
                setError("Failed to fetch user data.");
            })
            .finally(() => setLoading(false));



    }, [dubberData?.memberId, params.userId]);

    if (loading) {
        return <div>Завантаження...</div>;
    }

    if (error) {
        return notFound();
    }

    if (!dubberData) {
        return notFound();
    }

    return (
        <div className="flex flex-wrap justify-center gap-4 w-full">
            <div className="flex flex-col gap-1.5">
                <Button size="iconBig">

                </Button>
                <Button size="iconBig">

                </Button>
                <Button size="iconBig">

                </Button>
            </div>

            <div className="flex flex-col gap-6 flex-shrink-[0]">
                <div className="max-w-[330px]">
                    <img src={dubberData.art || ""} alt="Арт"
                         className="w-full h-full object-cover border-2 border-white rounded-md"/>
                </div>
                <div>
                    {dubberData.memberNickname}
                </div>
            </div>

            <div className="flex flex-col gap-6 w-[60%]">

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                    <div className="">
                        <h2 className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF0000] to-[#B60000] font-extrabold text-3xl uppercase">SERAPHINE</h2>
                        <h3 className="opacity-70 uppercase font-semibold">Даберка</h3>
                        <h3>19 років, 10.08.2005</h3>
                        <h3 className="mb-4">ENFP</h3>

                        <h4><span className="opacity-70">Домашній улюбленець:</span> Кіт (Лакі)</h4>
                        <h4><span className="opacity-70">Улюблений колір:</span> Жовтий, Ліловий</h4>
                        <h4><span className="opacity-70">Улюблені аніме:</span> Винищувач демонів, Ця порцелянова
                            лялечка закохалася, Зошит Смерті, Хьока, Монолог травниці, Шарлотта, Світанкова Йона,
                            Обіцяний Неверленд</h4>
                        <h4><span className="opacity-70">Улюблені фільми:</span> Нова Людина-Павук, Гаррі Потетр, Крик,
                            Містер і Місіс Сміт, Шерлок, Зоотрополіс, Червоне повідомлення, Малюк на драйві, Як я
                            зустрів вашу маму, Бруклін99, Круелла, Kingsman: Таємна служба, Обдарована, Життя і мета
                            собаки, Дивні Дива, Стажер, Ріо, Як приборкати дракона, Аркейн</h4>
                        <h4><span className="opacity-70">Улюблені ігри:</span> VALORANT, Dead By Daylight, Fortnite,
                            Genshin Impact, Hogwarts Legacy, The Last of Us, Phasmophobia, Detroit, CS2</h4>
                    </div>
                    <div className=" h-fit flex flex-col border-white border-2 rounded-md p-3">
                        <div
                            className="bg-gradient-to-b from-[#B90000] to-[#730000] font-extrabold rounded-md h-auto flex justify-center items-center self-center px-2 py-1.5 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                            <div>SERAPHINE’S PLAYLIST</div>
                        </div>
                        <div className="p-6">
                            1
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(176px,1fr))] gap-10">
                    {
                        profileData?.map((profile: ProfileType) => {
                            return (
                                <Link key={profile.characterId} href={`/watch/${profile.animeId}`} className="contents">
                                    <div
                                        className="flex flex-col items-center justify-start bg-transparent rounded-md overflow-hidden w-full relative"
                                        style={{cursor: "pointer", aspectRatio: 9 / 13.5 }}
                                    >
                                        <img
                                            src={profile.image || ""}
                                            alt={profile.name}
                                            className="w-full object-cover"
                                            style={{aspectRatio: 9 / 10}}
                                        />
                                        <div
                                            className="flex flex-col justify-center bg-gradient-to-b from-[#B90000] to-[#730000] p-1 text-wrap items-center text-center text-white w-full h-full text-background gap-1">
                                            <h4 className="text-sm uppercase font-bold m-0 p-0 leading-none">
                                                {profile.name}
                                            </h4>
                                            <span className="text-[11px] font-semibold max-w-[90%]">{profile.animeName}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    }
                </div>
            </div>

        </div>
    );
}