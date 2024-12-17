"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {notFound, useParams} from "next/navigation";
import {getCharactersByActorId, getKachurColors, getKachurTeamById} from "@/lib/db/userDB";
import Link from "next/link";
import Image from "next/image";
import {
    Dialog,
    DialogClose,
    DialogContent, DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Textarea} from "@/components/ui/textarea";

interface DubberData {
    kachurTeamTable: {
        memberId: number | null;
        date: string | null;
        anime: string | null;
        kachurId: number;
        positionId: number | null;
        type: number | null;
        tiktok: string | null;
        youtube: string | null;
        telegram: string | null;
        twitch: string | null;
        instagram: string | null;
        status: string | null;
        social: string | null;
        pet: string | null;
        films: string | null;
        games: string | null;
    }
    memberNickname: string | null;
    memberName: string | null;
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

type ColorsType = {
    colors: {
        colorId: number;
        colorName: string | null;
        colorHex: string | null;
    } | null;
    team_color: {
        kachurId: number | null;
        colorId: number | null;
    }
}

export default function TeamUserId() {
    const params = useParams();
    const [dubberData, setDubberData] = useState<DubberData | null>(null); // Стан для збереження даних
    const [colorData, setColorData] = useState<ColorsType[]>([]); // Стан для збереження даних
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
        getKachurTeamById(userId)
            .then((data) => {
                if (data.length === 0) {
                    setError("No data found for this user.");
                } else {
                    setDubberData(data[0]); // Беремо перший результат

                    getCharactersByActorId(data[0].kachurTeamTable.memberId || 0, 0)
                        .then((characterData) => {
                            setProfileData(characterData);
                        });
                    getKachurColors(userId)
                        .then((colorsData) => {
                            setColorData(colorsData);
                        })
                }

            })
            .catch((err) => {
                console.error("Failed to fetch user data:", err);
                setError("Failed to fetch user data.");
            })
            .finally(() => setLoading(false));



    }, [dubberData?.kachurTeamTable.memberId, params.userId]);

        const favoriteColors = colorData
            .map((item, index) => {
                const colorName = item.colors?.colorName;
                const colorHex = item.colors?.colorHex;

                return colorName && colorHex ? (
                    <span key={item.colors?.colorId}>
                        <span
                            style={{
                                color: colorHex,
                                fontWeight: 'bold',
                                marginLeft: '8px',
                            }}
                        >
                            {colorName}
                        </span>
                        {index < colorData.length - 1 && ','}
                    </span>
                ) : null;
            })
            .filter(Boolean);

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

                {dubberData.kachurTeamTable.tiktok && (
                    <Button size="iconBig">
                        <a target="_blank" href={dubberData.kachurTeamTable.tiktok}>
                            <Image src="/tiktok_btn.png" alt="tiktok" width={50} height={50}/>
                        </a>
                    </Button>
                )}
                {dubberData.kachurTeamTable.youtube && (
                    <Button size="iconBig">
                        <a target="_blank" href={dubberData.kachurTeamTable.youtube}>
                            <Image src="/youtube_btn.png" alt="youtube" width={50} height={50}/>
                        </a>
                    </Button>
                )}
                {dubberData.kachurTeamTable.telegram && (
                    <Button size="iconBig">
                        <a target="_blank" href={dubberData.kachurTeamTable.telegram}>
                            <Image src="/telegram_btn.png" alt="telegram    " width={50} height={50}/>
                        </a>
                    </Button>
                )}
                {dubberData.kachurTeamTable.twitch && (
                    <Button size="iconBig">
                        <a target="_blank" href={dubberData.kachurTeamTable.twitch}>
                            <Image src="/twitch_btn.png" alt="twitch" width={50} height={50}/>
                        </a>
                    </Button>
                )}
                {dubberData.kachurTeamTable.instagram && (
                    <Button size="iconBig">
                        <a target="_blank" href={dubberData.kachurTeamTable.instagram}>
                            <Image src="/instagram_btn.png" alt="instagram" width={50} height={50}/>
                        </a>
                    </Button>
                )}
            </div>

            <div className="flex flex-col gap-6 flex-shrink-[0]">
                <div className="max-w-[330px]">
                    <img src={dubberData.art || ""} alt="Арт"
                         className="w-full h-full object-cover border-2 border-white rounded-md"/>
                </div>
                <div>

                    <div className="grid grid-rows-4 w-full overflow-hidden rounded-lg">
                        <div className="bg-gradient-to-b from-[#9F0101] to-[#3F0000]">
                            <div className="grid grid-cols-4 gap-4 items-center justify-items-center h-full">
                                <div></div>
                                <div className="col-span-2 uppercase font-bold text-xl pb-1">{dubberData.memberNickname}</div>
                                <div className="max-w-[41px] relative pb-2">
                                    <img src={dubberData.art || ""} alt="Арт"
                                         className="w-full h-full object-cover border-2 border-white rounded-full"/>
                                    <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-[#5CE31D] rounded-full">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row-span-2 grid grid-rows-3 bg-white items-center">
                            <div
                                className="row-start-2 bg-[#4E8CFF] rounded-lg w-fit flex justify-center items-center h-fit p-2 ml-3 -mb-1">Як справи?</div>
                            <div className="row-start-3 bg-[#4E8CFF] rounded-lg w-fit flex justify-center items-center h-fit p-2 ml-3 mb-2">Чекаємо Ваші питання тут</div>
                        </div>
                        <div className="p-4 bg-[#454545]">
                            <div className="w-full h-full bg-black rounded-full">

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="font-semibold text-[12px] bg-transparent border-transparent rounded-full outline-none hover:bg-white/10 w-full h-full text-gray-500"><div className="w-full text-left">Надіслати повідомлення...</div></Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-[800px]">
                                        <DialogHeader>
                                            <DialogTitle className="text-white/80">Кому: <span className="bg-gradient-to-b from-[#D50000] to-[#6F0000] text-transparent bg-clip-text pl-2">Студія Качур</span></DialogTitle>
                                            <DialogDescription className="text-[16px]">
                                                Від: <span className="bg-gradient-to-b from-[#D50000] to-[#6F0000] text-transparent bg-clip-text pl-2">a</span>
                                            </DialogDescription>
                                        </DialogHeader>


                                        <div className="w-full flex">
                                            <Textarea
                                            placeholder="Ваше повідомлення..."
                                            className="bg-[#F0F0F0] text-background min-h-72
                                            border-transparentoutline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                            />
                                        </div>

                                        <DialogFooter className="sm:justify-start self-end">
                                            <DialogClose asChild>
                                                <div className="flex w-full justify-between">
                                                <Button variant="secondary" className="self-end">
                                                    Скасувати
                                                </Button>
                                                    <Button variant="kachurGrad" className="self-end uppercase font-bold">НАДІСЛАТИ</Button>
                                                </div>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 w-[60%]">

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                    <div className="">
                        <h2 className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF0000] to-[#B60000] font-extrabold text-3xl uppercase">{dubberData.memberNickname?.toUpperCase()}</h2>
                        <h3 className="opacity-70 uppercase font-semibold">{dubberData.kachurTeamTable.status?.toUpperCase()}</h3>
                        <h3>{dubberData.kachurTeamTable.date}</h3>
                        <h3 className="mb-4">{dubberData.kachurTeamTable.social}</h3>

                        <h4><span className="opacity-70">Домашній улюбленець:</span> {dubberData.kachurTeamTable.pet}</h4>
                        <h4><span className="opacity-70">Улюблений колір:</span>{favoriteColors.length > 0 ? favoriteColors : ' Немає даних'}</h4>
                        <h4><span className="opacity-70">Улюблені аніме:</span> {dubberData.kachurTeamTable.anime}</h4>
                        <h4><span className="opacity-70">Улюблені фільми:</span> {dubberData.kachurTeamTable.films}</h4>
                        <h4><span className="opacity-70">Улюблені ігри:</span> {dubberData.kachurTeamTable.games}</h4>
                    </div>
                    <div className=" h-fit flex flex-col border-white border-2 rounded-md p-3">
                        <div
                            className="bg-gradient-to-b from-[#B90000] to-[#730000] font-extrabold rounded-md h-auto flex justify-center items-center self-center px-2 py-1.5 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                            <div>{dubberData.memberNickname?.toUpperCase()}’S PLAYLIST</div>
                        </div>
                        <div className="p-6 grid-cols-2">

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