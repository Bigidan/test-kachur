import React, {Suspense} from 'react';
import {Skeleton} from '@/components/ui/skeleton';
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import HeadTitle from "@/components/ui/main/head-title";
import {PlayerProvider} from "@/components/player/player-context";
import Player from "@/components/player/player";
import PlayerComponent from "@/components/player/player-component";

import {AnimeData} from "@/components/types/anime-types";
import {getAllAnimeData} from "@/lib/db/userDB";



export default async function WatchPage({
                                            params,
                                        }: {
    params: Promise<{ watchId: string }>
}){

    const watchId = (await params).watchId

    if (isNaN(Number(watchId))) return;



    const animeFetch: Promise<AnimeData> = getAllAnimeData(Number(watchId));



    const data = await Promise.all([animeFetch]);

    const animeDataEx = data[0].anime;
    const animeGenres = data[0].genres;
    const animeTranslate = data[0].translate;
    const animeEditing = data[0].editing;
    const animeSound = data[0].sound;
    const animeVideoEditing = data[0].videoEditing;
    const animeDubDirector = data[0].dubDirector;
    const animeVocals = data[0].vocals;
    const animeVoiceActors = data[0].voiceActors;
    // const router = useRouter();

    const formatDateToString = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}${month}${year}`;
    };

    // Sample data
    // const animeData = {
    //     titleUkr: 'ДанДаДан',
    //     titleJap: 'Dandadan',
    //     titleEng: 'ダンダダン',
    //     status: 'Онгоїнґ',
    //     episodes: {now: '4', all: '12'},
    //     rating: 'IMDB: 8.6 (4 200)',
    //     type: 'ТБ-серіал',
    //     genres: ['Комедія', 'Надприродне', 'Шонен', 'Екшн', 'Романтика', 'Наукова фантастика', 'Бойовик', 'Школа'],
    //     source: 'Манґа',
    //     releaseDate: '4 жовтня 2024 року',
    //     description: `Після того, як Момо Аясе кинув її хлопець, вона починає дутися, коли натрапляє на хлопчика, над яким знущаються однокласники. Врятований її необдуманою добротою, одержимий інопланетянами хлопчик намагається заговорити з нею про позаземні інтереси, які, на його думку, вони поділяють. Відкинувши його твердження, Аясе проголошує, що вона натомість вірить у привидів, і між ними починається суперечка про те, хто з них вірить у видумане, а хто - в реальне.\n\nПосперечавшись, вони вирішують окремо відвідати місця, пов'язані з позаземним і надприродним: Аясе - з першим, а хлопчик - з другим. Коли вони досягають своїх місць, виявляється, що жоден з них не помилявся, і що як прибульці, так і привиди дійсно існують.\n\nЦе знаменує початок пригод Аясе та хлопчини, які намагаються виправити сюрреалістичні, надприродні та позаземні елементи, що оточують їх, щоб повернутися до нормального життя.`,
    //     age: '18+',
    //     studio: 'Science SARU',
    //     director: ['Ямашіро Фуґа'],
    //     translate: ['Рустам Ткаченко'],
    //     editing: ['KORGIK', 'Lem0nka'],
    //     sound: ['EchoSol', 'Dofin'],
    //     videoEditing: ['Rubycoon', 'Богом Даний'],
    //     dubDirector: ['KORGIK', 'Lem0nka', 'EchoSol'],
    //     vocals: ['Snail'],
    //     voiceActors: ['vgvoice', 'SA10', 'Anyonkopon', 'Cara Linne', 'Seraphine', 'KORGIK', 'CherryDub', 'Good_Zik', 'Sad._.Burrito', 'EchoSol', 'Basilio', 'михайлістви', 'AlioniX', 'ArtCl0ud', 'Snail', 'Роман', 'Dumbest', 'Хриня', 'Ro', 'Тріна Дубовицька'],
    //     trailerLink: 'tCeaizw7oIs',
    // };



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
                                    className="absolute left-0 p-3 rounded-br-2xl bg-orange-500">{animeDataEx[0].statusText}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button size="kachurGrad" className="gap-4">
                                    <img src="/bookmark.svg" alt=""/>
                                    <span className="uppercase font-bold">ДОДАТИ В ОБРАНЕ</span>
                                </Button>
                                <Button variant="kachurGrad" size="kachurGrad" className="gap-4">
                                    <img src="/mono.svg" width={47} height={47} alt=""/>
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
                                <span className="row_v mb-1"><Badge>{animeDataEx[0].statusText}</Badge></span>
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
                            <div >
                                <span>Переклад</span>
                                <span className="row_v gap-1">
                                    {animeTranslate.map((actor, index) => (
                                        <span key={index} data-link={actor} className="actor-item">
                                            {actor.memberNickname}
                                            {index < animeTranslate.length - 1 && ', '}
                                        </span>
                                    ))}
                                </span>
                            </div>
                            <div >
                                <span>Редактура</span>
                                <span className="row_v gap-1">
                                    {animeEditing.map((actor, index) => (
                                        <span key={index} data-link={actor} className="actor-item">
                                            {actor.memberNickname}
                                            {index < animeEditing.length - 1 && ', '}
                                        </span>
                                    ))}
                                </span>
                            </div>
                            <div >
                                <span>Саунд-дизайн та зведення</span>
                                <span className="row_v gap-1">
                                    {animeSound.map((actor, index) => (
                                        <span key={index} data-link={actor} className="actor-item">
                                            {actor.memberNickname}
                                            {index < animeSound.length - 1 && ', '}
                                        </span>
                                    ))}
                                </span>
                            </div>
                            {animeVideoEditing.length > 0 ? <div>
                                <span>Візуальний ряд</span>
                                <span className="row_v gap-1">
                                    {animeVideoEditing.map((actor, index) => (
                                        <span key={index} data-link={actor} className="actor-item">
                                            {actor.memberNickname}
                                            {index < animeVideoEditing.length - 1 && ', '}
                                        </span>
                                    ))}
                                </span>
                            </div>
                                :
                            null
                            }

                            <div>
                                <span>Режисери дубляжу</span>
                                <span className="row_v gap-1">
                                    {animeDubDirector.map((actor, index) => (
                                        <span key={index} data-link={actor} className="actor-item">
                                            {actor.memberNickname}
                                            {index < animeDubDirector.length - 1 && ', '}
                                        </span>
                                    ))}
                                </span>
                            </div>
                            {animeVocals.length > 0 ? <div>
                                <span>Вокал</span>
                                <span className="row_v gap-1">
                                    {animeVocals.map((actor, index) => (
                                        <span key={index} data-link={actor} className="actor-item">
                                            {actor.memberNickname}
                                            {index < animeVocals.length - 1 && ', '}
                                        </span>
                                    ))}
                                </span>
                            </div>
                            :
                            null
                            }

                            <div>
                                <span>Актори озвучення</span>
                                <span className="row_v gap-1">
                                    {animeVoiceActors.map((actor, index) => (
                                        <span key={index} data-link={actor} className="actor-item">
                                            {actor.memberNickname}
                                            {index < animeVoiceActors.length - 1 && ', '}
                                        </span>
                                    ))}
                                </span>
                            </div>

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
                                <img src="/watch.svg" width={37} height={37} alt=""/>
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