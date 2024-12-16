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
    const [translators, setTranslators] = useState<ProfileType[]>([]);
    const [visual, setVisual] = useState<ProfileType[]>([]);
    const [creators, setCreators] = useState<ProfileType[]>([]);

    useEffect(() => {
        getKachurTeam().then((result) => {
            setActors(result[0] || []);
            setGuestActors(result[1] || []);
            setTranslators(result[2] || []);
            setVisual(result[3] || []);
            setCreators(result[4] || []);
        });

    }, []);

    return (
        <div className="mx-auto max-w-screen-xl flex flex-col justify-center gap-5">

            <div className="grid grid-cols-[repeat(auto-fill,minmax(40%,1fr))] gap-32">
                <div className="flex flex-col p-5 lg:p-20">
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

            <div className="max-w-screen-xl grid grid-cols-4 gap-32 justify-center justify-items-center">
                {
                    actors?.map((profile: ProfileType) => {
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
                <div className="text-center col-span-4">Запрошені Актори</div>
                {
                    guestActors?.map((profile: ProfileType) => {
                        return (
                            <div key={profile.userId} className="contents">
                                <div
                                    className="flex flex-col items-center justify-start bg-transparent rounded-md overflow-hidden w-full relative"
                                    style={{aspectRatio: 9 / 13}}
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
                            </div>
                        );
                    })
                }
                {
                    translators?.map((profile: ProfileType) => {
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
    );
};

export default TeamViewPage;
