"use client"

import React, { useEffect, useState } from 'react';
import { usePlayer } from "@/components/player/player-context";
import {Button} from "@/components/ui/button";

const PlayerComponent = () => {
    const { episodes, playEpisode, watchId } = usePlayer();
    const [watchedEpisodes, setWatchedEpisodes] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        // Перевіряємо прогрес для кожної серії
        const checkWatchProgress = () => {
            const progress: { [key: string]: boolean } = {};

            episodes.forEach(episode => {
                const savedProgress = localStorage.getItem(
                    `video_progress_${watchId}_${episode.episodeId}`
                );

                if (savedProgress) {
                    // Вважаємо серію переглянутою, якщо пройдено більше 80% тривалості
                    // Можна додати перевірку на тривалість відео, якщо вона доступна
                    progress[episode.episodeId] = true;
                }
            });

            setWatchedEpisodes(progress);
        };

        if (episodes.length && watchId) {
            checkWatchProgress();
        }
    }, [episodes, watchId]);

    return (
        <div className="flex">
            {episodes.map((episode) => {
                const isWatched = watchedEpisodes[episode.episodeId];

                return (
                    <Button
                        key={episode.episodeId}
                        onClick={() => playEpisode(episode)}
                        className={`transition-colors ${
                            isWatched
                                ? 'bg-green-100 hover:bg-green-200'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        <div className="">
                            <span className="">
                                Епізод {episode.episodeNumber} - {episode.episodeName}
                            </span>
                            <span className={`px-2 py-1 rounded text-sm ${
                                isWatched
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-500 text-white'
                            }`}>
                                {isWatched ? 'Переглянуто' : 'Не переглянуто'}
                            </span>
                        </div>
                    </Button>
                );
            })}
        </div>
    );
};

export default PlayerComponent;