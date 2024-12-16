'use client';

import React, {useEffect, useState, useCallback, useRef} from 'react';
import { getPopularAnimeBySearch } from "@/lib/db/userDB";
import { cn } from "@/lib/utils";

import Link from "next/link";
import {Skeleton} from "@/components/ui/skeleton";
import {Loader} from "lucide-react";

const INITIAL_ANIME_LIMIT = 9;

const PopAnimeComponent = ({
    searchQuery,
    infiniteScroll = true
}: {
    searchQuery: string,
    infiniteScroll?: boolean
}) => {
    const [data, setData] = useState<{animeId: number, nameUkr: string, episodesExpected: number | null, headerImage: string | null, statusName: string | null, statusId: number | null, existedEpisodes: number}[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMoreAnime, setHasMoreAnime] = useState(true);
    const [page, setPage] = useState(1);

    const loadMoreRef = useRef<HTMLDivElement>(null);

    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getPopularAnimeBySearch(searchQuery, INITIAL_ANIME_LIMIT, 0);
            setData(result);
            setHasMoreAnime(result.length === INITIAL_ANIME_LIMIT);
        } catch (error) {
            console.error("Error fetching anime data:", error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    const loadMoreAnime = useCallback(async () => {
        const nextPage = page + 1;
        try {
            const result = await getPopularAnimeBySearch(
                searchQuery,
                INITIAL_ANIME_LIMIT,
                (nextPage - 1) * INITIAL_ANIME_LIMIT
            );

            if (result.length > 0) {
                setData(prev => [...prev, ...result]);
                setPage(nextPage);
                setHasMoreAnime(result.length === INITIAL_ANIME_LIMIT);
            } else {
                setHasMoreAnime(false);
            }
        } catch (error) {
            console.error("Error loading more anime:", error);
        }
    }, [searchQuery, page]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    useEffect(() => {
        if (!infiniteScroll) return; // Exit if infinite scroll is disabled

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && hasMoreAnime && !loading) {
                    loadMoreAnime();
                }
            },
            { threshold: 1.0 }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [hasMoreAnime, loadMoreAnime, loading, infiniteScroll]);

    // If no data and still loading, show skeleton
    if (data.length === 0 || loading) {
        return <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] grid-rows-[auto] gap-10">
            <div className="row-span-2 col-span-2">
                <div className="flex flex-col h-full relative rounded-md overflow-hidden">
                    <Skeleton className="w-auto h-full" style={{aspectRatio: '11 / 16'}}/>
                </div>
            </div>
            {[...Array(8)].map((_, index) => (
                <div key={index} className="flex flex-col gap-2">
                    <Skeleton className="w-full h-auto" style={{aspectRatio: '11 / 16'}}/>
                    <Skeleton className="w-full h-[17px]"/>
                    <Skeleton className="w-full h-[17px]"/>
                </div>
            ))}
        </div>;
    }

    const firstAnime = data[0]; // перший елемент
    const restAnime = data.slice(1); // всі решта

    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] grid-rows-[auto] gap-10">
            {/* Перший елемент */}
            <Link className="row-span-2 col-span-2" href={`/watch/${firstAnime.animeId}`}>
                <div className="flex flex-col h-full relative rounded-md overflow-hidden">
                    <div className="w-auto h-full" style={{aspectRatio: '11 / 16'}}>
                        <img
                            alt=""
                            src={firstAnime.headerImage || ''}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {firstAnime.episodesExpected && firstAnime.episodesExpected > 0 ? (
                        <span className="absolute right-0 py-2 px-5 rounded-bl-2xl bg-white text-red-900 text-2xl">
                            {firstAnime.existedEpisodes} / {firstAnime.episodesExpected}
                        </span>
                    ) : (
                        <span className="absolute right-0 py-2 px-5 rounded-bl-2xl bg-white text-red-900 text-2xl">
                            Фільм
                        </span>
                    )}
                    <span
                        className={cn('absolute left-0 py-2 px-5 rounded-br-2xl text-2xl', {
                            'bg-orange-500': firstAnime.statusId === 1,
                            'bg-green-500': firstAnime.statusId === 2,
                            'bg-blue-500': firstAnime.statusId === 3,
                        })}
                    >
                        {firstAnime.statusName}
                    </span>
                </div>
            </Link>

            {/* Інші елементи */}
            {restAnime.map((anime, index) => (
                <Link key={index} className="flex flex-col gap-2 text-[12px]" href={`/watch/${anime.animeId}`}>
                    <div className="flex flex-col w-full relative rounded-md overflow-hidden">
                        <div className="w-full h-auto" style={{ aspectRatio: '11 / 16' }}>
                            <img alt="" src={anime.headerImage || ''} className="w-full h-full object-cover" />
                        </div>
                        {anime.episodesExpected && anime.episodesExpected > 0 ? (
                            <span className="absolute right-0 py-1 px-2 rounded-bl-xl bg-white text-red-900">
                                {anime.existedEpisodes} / {anime.episodesExpected}
                            </span>
                        ) : (
                            <span className="absolute right-0 py-1 px-2 rounded-bl-xl bg-white text-red-900">
                                Фільм
                            </span>
                        )}
                        <span
                            className={cn('absolute left-0 py-1 px-2 rounded-br-xl font-normal', {
                                'bg-orange-500': anime.statusId === 1,
                                'bg-green-500': anime.statusId === 2,
                                'bg-blue-500': anime.statusId === 3,
                            })}
                        >
                            {anime.statusName}
                        </span>
                    </div>

                    <div className="text-center text-sm">{anime.nameUkr}</div>
                </Link>
            ))}

            {infiniteScroll && (
                <div
                    ref={loadMoreRef}
                    className="w-full flex justify-center col-span-full mt-4"
                >
                    {hasMoreAnime ? (
                        <Loader className="animate-spin" style={{ width: "40px", height: "40px" }} />
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default PopAnimeComponent;