import React from 'react';
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import HeadTitle from "@/components/main/head-title";
import {PlayerProvider} from "@/components/player/player-context";
import Player from "@/components/player/player";
import PlayerComponent from "@/components/player/player-component";

import {AnimeData} from "@/components/types/anime-types";
import {getAllAnimeData} from "@/lib/db/userDB";
import Image from "next/image";
import StaffHoverCard from "@/components/watch/member-hover-card";
import {cn} from "@/lib/utils";
import {notFound} from "next/navigation";




export default async function WatchPage({
    params,
}: {
    params: Promise<{ watchId: string }>
}){

    const watchId = (await params).watchId;
    if (isNaN(Number(watchId))) return notFound();

    const animeData: AnimeData = await getAllAnimeData(Number(watchId));
    const {
        anime: animeDataEx,
        genres: animeGenres,
        translate: animeTranslate,
        editing: animeEditing,
        sound: animeSound,
        videoEditing: animeVideoEditing,
        dubDirector: animeDubDirector,
        vocals: animeVocals,
        voiceActors: animeVoiceActors,
    } = animeData;

    const formatDateToString = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const monthNames = [
            'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
            'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
        ];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    };

    // const [hoveredActor, setHoveredActor] = useState<string | null>(null);

    interface StaffListProps {
        title: string;
        staff: {
            memberNickname: string | null;
            memberName: string | null;
            memberId: number | null;
            userId: number | null;
        }[];
    }
    const StaffList = ({ title, staff }: StaffListProps) => {
        if (!staff.length) return null;

        return (
            <div>
                <span>{title}</span>
                <span className="row_v gap-1 gradient-wave">
            {staff.map((member, index) => (
                <StaffHoverCard key={index} memberId={member.memberId} watchId={Number(watchId)}>
                    <span className="actor-item hover:underline ">
                        {member.memberNickname}

                    </span>{index < staff.length - 1 && ', '}
                </StaffHoverCard>
            ))}
            </span>
            </div>
        );
    };


    return (
        <div className="mx-auto flex justify-center" style={{ maxWidth: '70%' }}>
            {(

                <div className="flex flex-col w-full justify-center">
                    <div className="grid gap-10 w-full" style={{gridTemplateColumns: '3fr 9fr'}}>

                        <div className="flex flex-col row-span-2 gap-2">
                            <div className="flex flex-col w-full relative rounded-md overflow-hidden">
                                <div className="w-full h-auto" style={{aspectRatio: '11 / 16'}}>
                                    <img alt="" src={animeDataEx[0].headerImage || ""} className="w-full h-full object-cover" />
                                </div>
                                <span
                                    className="absolute right-0 p-3 rounded-bl-2xl bg-white text-red-900">{animeDataEx[0].existedEpisodes} / {animeDataEx[0].episodesExpected}</span>
                                <span
                                    className={cn(
                                        'absolute left-0 p-3 rounded-br-2xl',
                                        {
                                            'bg-orange-500': animeDataEx[0].statusId === 1,
                                            'bg-green-500': animeDataEx[0].statusId === 2,
                                            'bg-blue-500': animeDataEx[0].statusId === 3,
                                        }
                                    )}>
                                    {animeDataEx[0].statusText}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button size="kachurGrad" className="gap-4">
                                    <Image src="/bookmark.svg" alt="" width={32} height={32}/>
                                    <span className="uppercase font-bold">ДОДАТИ В ОБРАНЕ</span>
                                </Button>
                                <Button variant="kachurGrad" size="kachurGrad" className="gap-4">
                                    <Image src="/mono.svg" width={47} height={47} alt=""/>
                                    <span className="font-bold uppercase">Підтримати проєкт</span>
                                </Button>
                            </div>
                        </div>

                        <div className="col-start-2">
                            <div className="flex flex-col gap-1">
                                <span className="text-4xl font-black uppercase">{animeDataEx[0].nameUkr}</span>
                                <span className="text-2xl font-bold text-gray-500 uppercase">{animeDataEx[0].nameJap}</span>
                                <span className="text-2xl font-bold text-gray-500">{animeDataEx[0].nameEng}</span>
                            </div>
                        </div>

                        <div className="grid row_lines"
                             style={{gridTemplateRows: 'repeat(auto-fit, auto)'}}>

                            <div >
                                <span>Рейтинг</span>
                                <span className="row_v">{animeDataEx[0].rating}</span>
                            </div>
                            <div >
                                <span>Тип</span>
                                <span className="row_v">{animeDataEx[0].typeName}</span>
                            </div>
                            <div >
                                <span>Епізоди</span>
                                <span className="row_v">{animeDataEx[0].existedEpisodes} / {animeDataEx[0].episodesExpected}</span>
                            </div>
                            <div >
                                <span>Статус</span>
                                <span className="row_v mb-1">
                                    <Badge
                                        variant={((animeDataEx[0].statusId) as 1 | 2 | 3) || 1}
                                    >{animeDataEx[0].statusText}</Badge>
                                </span>
                            </div>
                            <div >
                                <span>Жанр</span>
                                <span className="row_v gap-1 w-1/2">
                                    {animeGenres.map((genre, index) => (
                                    <Badge key={index} variant="destructive">
                                        {genre.genreName}
                                    </Badge>
                                ))}
                                </span>
                            </div>
                            <div >
                                <span>Першоджерело</span>
                                <span className="row_v">{animeDataEx[0].sourceName}</span>
                            </div>
                            <div >
                                <span>Дата виходу</span>
                                <span className="row_v">{formatDateToString(animeDataEx[0].releaseDate || new Date())}</span>
                            </div>
                            <div >
                                <span>Вікові обмеження</span>
                                <span className="row_v">{animeDataEx[0].ageName}</span>
                            </div>
                            <div >
                                <span>Студія</span>
                                <span className="row_v">{animeDataEx[0].studioName}</span>
                            </div>

                            <div >
                                <span>Режисер</span>
                                <span className="row_v gap-1">
                                    {animeDataEx.map((actor, index) => (
                                        <span key={index} data-link={actor} className="actor-item">
                                            {actor.directorName}
                                        </span>
                                    ))}
                                </span>
                            </div>
                            <div >
                                <span>Озвучення</span>
                                <span className="row_v gap-1">Студія Качур</span>
                            </div>

                            <StaffList title="Переклад" staff={animeTranslate}/>
                            <StaffList title="Редактура" staff={animeEditing}/>
                            <StaffList title="Саунд-дизайн та зведення" staff={animeSound}/>
                            <StaffList title="Візуальний ряд" staff={animeVideoEditing}/>
                            <StaffList title="Режисери дубляжу" staff={animeDubDirector}/>
                            <StaffList title="Вокал" staff={animeVocals}/>
                            <StaffList title="Актори озвучення" staff={animeVoiceActors}/>


                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-6 w-full mt-16">

                        <div className="flex flex-col gap-3">
                            <HeadTitle highlight="опис" />
                            <div className="whitespace-pre-wrap text-sm">{animeDataEx[0].description}</div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="w-full h-auto aspect-video overflow-hidden rounded-md ">
                                <iframe width="100%" height="100%"
                                        src={"https://www.youtube.com/embed/" + animeDataEx[0].trailerLink}
                                        title="YouTube video player" frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                            </div>
                            <Button variant="kachurGrad" size="kachurGrad" className="gap-4">
                                <Image src="/watch.svg" width={37} height={37} alt=""/>
                                <span className="font-bold uppercase">дивитися трейлер українською</span>
                            </Button>
                        </div>

                    </div>
                    <PlayerProvider watchId={watchId}>
                        <div className="w-full mt-16">
                            <Player />
                            <PlayerComponent />
                        </div>
                    </PlayerProvider>

                    <div className="hero">

                    </div>
                </div>
            )}
        </div>
    );
};