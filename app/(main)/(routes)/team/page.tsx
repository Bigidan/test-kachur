"use client"

import React, {useEffect, useState} from 'react';
import Link from "next/link";
import HeadTitle from "@/components/main/head-title";
import {getKachurTeam} from "@/lib/db/userDB";

type ProfileType = {
    userId: number;
    nickname: string;
    art: string | null;
}

const TeamViewPage = () => {
    const [actors, setActors] = useState<ProfileType[]>([]);
    const [guestActors, setGuestActors] = useState<ProfileType[]>([]);
    const [translaters, setTranslaters] = useState<ProfileType[]>([]);
    const [visual, setVisual] = useState<ProfileType[]>([]);
    const [creators, setCreators] = useState<ProfileType[]>([]);

    useEffect(() => {
        getKachurTeam().then((result) => {
            setActors(result[0] || []);
            setGuestActors(result[1] || []);
            setTranslaters(result[2] || []);
            setVisual(result[3] || []);
            setCreators(result[4] || []);
        });

    }, []);

    return (
        <div className="mx-auto max-w-screen-xl flex flex-col justify-center gap-5">

            <div className="grid grid-cols-[repeat(auto-fill,minmax(40%,1fr))] gap-32">
                <div className="flex flex-col pr-36">
                    <HeadTitle text="НАШІ" highlight="АКТОРИ" className="py-1 text-[40px]"/>
                    <HeadTitle text="НАШІ" highlight="ГОЛОСИ" className="py-1 self-end text-[40px]"/>
                    <HeadTitle text="НАШІ" highlight="КАЧУРЯТА" className="py-1 text-[40px]"/>
                    <HeadTitle text="НАША" highlight="СІМ'Я" className="py-1 self-end text-[40px]"/>
                </div>
                <div className="flex flex-col gap-12">
                    <div className="text-center">Засновники &#34;Студії Качур&#34;</div>
                    <div className="max-w-screen-xl grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-32">
                        {
                            creators?.map((profile: ProfileType) => {
                                return (
                                    <Link key={profile.userId} href={`/team/${profile.userId}`} className="contents">
                                        <div
                                            className="flex flex-col items-center justify-start bg-transparent rounded-md overflow-hidden w-full relative"
                                            style={{cursor: "pointer", aspectRatio: 9 / 13}}
                                        >
                                            <img
                                                src={profile.art || ""}
                                                alt={profile.nickname}
                                                className="w-full object-cover"
                                                style={{aspectRatio: 9 / 11}}
                                            />
                                            <div
                                                className="flex flex-col justify-center bg-gradient-to-b from-[#B90000] to-[#730000] p-1 text-wrap items-center text-center text-white w-full h-full text-background gap-1">
                                                <h4 className="text-sm uppercase font-bold m-0 p-0 leading-none">
                                                    {profile.nickname}
                                                </h4>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        }
                    </div>
                </div>
            </div>

            <div className="text-center font-bold text-[20px] my-12">
                Актори
            </div>

            <div className="max-w-screen-xl flex flex-wrap gap-32 justify-center">
                {
                    actors?.map((profile: ProfileType) => {
                        return (
                            <Link key={profile.userId} href={`/team/${profile.userId}`} className="contents">
                                <div
                                    className="flex flex-col items-center justify-start bg-transparent rounded-md overflow-hidden w-[calc(25%-8rem)] min-w-[160px] relative"
                                    style={{cursor: "pointer", aspectRatio: 9 / 13}}
                                >
                                    <img
                                        src={profile.art || ""}
                                        alt={profile.nickname}
                                        className="w-full object-cover"
                                        style={{aspectRatio: 9 / 11}}
                                    />
                                    <div
                                        className="flex flex-col justify-center bg-gradient-to-b from-[#B90000] to-[#730000] p-1 text-wrap items-center text-center text-white w-full h-full text-background gap-1">
                                        <h4 className="text-sm uppercase font-bold m-0 p-0 leading-none">
                                            {profile.nickname}
                                        </h4>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                }
            </div>

            <div className="max-w-screen-xl flex flex-wrap justify-around my-12">
                <div className="flex flex-col gap-12">
                    <div className="text-center">Запрошені Актори</div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] min-[366px]:grid-cols-2 gap-32">
                        {
                            guestActors?.map((profile: ProfileType) => {
                                return (
                                    <Link key={profile.userId} href={`/team/${profile.userId}`} className="contents">
                                        <div
                                            className="flex flex-col items-center justify-start bg-transparent rounded-md overflow-hidden w-full relative"
                                            style={{cursor: "pointer", aspectRatio: 9 / 13}}
                                        >
                                            <img
                                                src={profile.art || ""}
                                                alt={profile.nickname}
                                                className="w-full object-cover"
                                                style={{aspectRatio: 9 / 11}}
                                            />
                                            <div
                                                className="flex flex-col justify-center bg-gradient-to-b from-[#B90000] to-[#730000] p-1 text-wrap items-center text-center text-white w-full h-full text-background gap-1">
                                                <h4 className="text-sm uppercase font-bold m-0 p-0 leading-none">
                                                    {profile.nickname}
                                                </h4>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="flex flex-col gap-12">
                    <div className="text-center">Перекладач</div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-32">
                        {
                            translaters?.map((profile: ProfileType) => {
                                return (
                                    <Link key={profile.userId} href={`/team/${profile.userId}`} className="contents">
                                        <div
                                            className="flex flex-col items-center justify-start bg-transparent rounded-md overflow-hidden w-full relative"
                                            style={{cursor: "pointer", aspectRatio: 9 / 13}}
                                        >
                                            <img
                                                src={profile.art || ""}
                                                alt={profile.nickname}
                                                className="w-full object-cover"
                                                style={{aspectRatio: 9 / 11}}
                                            />
                                            <div
                                                className="flex flex-col justify-center bg-gradient-to-b from-[#B90000] to-[#730000] p-1 text-wrap items-center text-center text-white w-full h-full text-background gap-1">
                                                <h4 className="text-sm uppercase font-bold m-0 p-0 leading-none">
                                                    {profile.nickname}
                                                </h4>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="flex flex-col gap-12">
                    <div className="text-center">Візуальний ряд</div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-32">
                        {
                            visual?.map((profile: ProfileType) => {
                                return (
                                    <Link key={profile.userId} href={`/team/${profile.userId}`} className="contents">
                                        <div
                                            className="flex flex-col items-center justify-start bg-transparent rounded-md overflow-hidden w-full relative"
                                            style={{cursor: "pointer", aspectRatio: 9 / 13}}
                                        >
                                            <img
                                                src={profile.art || ""}
                                                alt={profile.nickname}
                                                className="w-full object-cover"
                                                style={{aspectRatio: 9 / 11}}
                                            />
                                            <div
                                                className="flex flex-col justify-center bg-gradient-to-b from-[#B90000] to-[#730000] p-1 text-wrap items-center text-center text-white w-full h-full text-background gap-1">
                                                <h4 className="text-sm uppercase font-bold m-0 p-0 leading-none">
                                                    {profile.nickname}
                                                </h4>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        }
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TeamViewPage;
