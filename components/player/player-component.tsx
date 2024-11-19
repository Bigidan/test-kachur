"use client"

import React, {useCallback, useEffect, useState} from 'react';
import { usePlayer } from "@/components/player/player-context";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeLowVision } from "react-icons/fa6";

import "./component.css";
import {cn} from "@/lib/utils";

interface VideoProgress {
    watchId: string;
    episodeId: string;
    timestamp: number;
    isWatched: boolean;
}

const PlayerComponent = () => {
    const {
        episodes,
        playEpisode,
        watchId = '',
        currentEpisode,
        autoplayEnabled
    } = usePlayer();

    const [watchedEpisodes, setWatchedEpisodes] = useState<{ [key: string]: boolean }>({});

    const updateWatchProgress = useCallback((episodeId: string, isWatched: boolean) => {

        if (!watchId?.trim()) {
            console.error('watchId is empty or undefined');
            return;
        }

        const storageKey = `video_progress_${watchId}_${episodeId}`;
        const currentProgress = localStorage.getItem(storageKey);
        let progress: VideoProgress;

        if (currentProgress) {
            progress = JSON.parse(currentProgress) as VideoProgress;
            progress.isWatched = isWatched;
        } else {
            progress = {
                watchId: watchId.trim(),
                episodeId,
                timestamp: 0,
                isWatched,
            };
        }

        localStorage.setItem(storageKey, JSON.stringify(progress));

        setWatchedEpisodes(prev => ({
            ...prev,
            [episodeId]: isWatched
        }));
    }, [watchId]);

    const toggleWatchStatus = (episodeId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Предотвращаем запуск эпизода при клике на иконку
        const currentStatus = watchedEpisodes[episodeId] || false;
        updateWatchProgress(episodeId, !currentStatus);
    };

    useEffect(() => {
        if (currentEpisode && autoplayEnabled) {
            updateWatchProgress(currentEpisode.episodeId, true);
        }
    }, [currentEpisode, autoplayEnabled, updateWatchProgress]);

    useEffect(() => {
        const checkWatchProgress = () => {
            const progress: { [key: string]: boolean } = {};

            if (!watchId.trim()) return;

            episodes.forEach(episode => {
                const storageKey = `video_progress_${watchId}_${episode.episodeId}`;
                const savedProgress = localStorage.getItem(storageKey);

                if (savedProgress) {
                    const parsedProgress = JSON.parse(savedProgress) as VideoProgress;
                    progress[episode.episodeId] = parsedProgress.isWatched;
                }
            });

            setWatchedEpisodes(progress);
        };

        if (episodes.length && watchId.trim()) {
            checkWatchProgress();
        }
    }, [episodes, watchId]);

    if (!watchId.trim()) {
        return <div>Завантаження...</div>;
    }

    return (
        <div className="my-5">
            <div className="grid gap-3 watch" style={{ gridTemplateColumns: 'repeat(auto-fill, 160px)', gridTemplateRows: 'repeat(auto-fill,48px)' }}>
                {episodes.map((episode) => {
                    const isWatched = watchedEpisodes[episode.episodeId];
                    const isActive = currentEpisode?.episodeId === episode.episodeId;

                    return (
                        <Button
                            key={episode.episodeId}
                            onClick={() => playEpisode(episode)}
                            variant="secondary"
                            className={cn(
                                "h-full flex justify-between items-center episode-button",
                                isActive && "active",
                                "relative transition-all duration-300"
                            )}>
                                <span className="font-semibold relative z-10">
                                    {episode.episodeNumber} серія
                                </span>
                            <span
                                className="w-8 h-8 flex items-center cursor-pointer hover:opacity-70 relative z-10"
                                onClick={(e) => toggleWatchStatus(episode.episodeId, e)}
                            >
                                    {isWatched ?
                                        <FaEye size={25} /> :
                                        <FaEyeLowVision size={25} className="opacity-30" />
                                    }
                                </span>
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};

export default PlayerComponent;