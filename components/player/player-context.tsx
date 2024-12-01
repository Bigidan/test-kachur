"use client"
// context/PlayerContext.js
import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Episode, EpisodeService} from "@/lib/db/episode-service";

interface PlayerContextType {
    watchId: string | undefined;
    currentVideo: string;
    isPlaying: boolean;
    episodes: Episode[];
    currentEpisode: Episode | null;
    playVideo: (video: string) => void;
    loadEpisodes: (watchId: string) => Promise<void>;
    playEpisode: (episode: Episode) => void;
    playNextEpisode: () => void;
    autoplayEnabled: boolean;
    toggleAutoplay: (checked: boolean) => void;
}

// Початкове значення для контексту
const PlayerContext = createContext<PlayerContextType>({
    watchId: "",
    currentVideo: "d",
    isPlaying: false,
    episodes: [],
    currentEpisode: null,
    playVideo: () => {},
    loadEpisodes: async () => {},
    playEpisode: () => {},
    playNextEpisode: () => {},
    autoplayEnabled: true,
    toggleAutoplay: () => {},
});

export const PlayerProvider = ({
    children,
    watchId,
}: Readonly<{
    children: React.ReactNode;
    watchId?: string;
}>) => {
    const [currentVideo, setCurrentVideo] = useState<string>("d");
    const [isPlaying, setIsPlaying] = useState(true);

    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

    const [autoplayEnabled, setAutoplayEnabled] = useState(true);

    const episodeService = useMemo(() => new EpisodeService(), []);

    const playVideo = (video: string) => {
        setCurrentVideo(video);
        setIsPlaying(true);
    };

    const playEpisode = useCallback((episode: Episode) => {
        setCurrentEpisode(episode);
        playVideo(episode.url);
        if (watchId) {
            episodeService.saveProgress(watchId, episode.episodeId);
        }
    }, [episodeService, watchId]);

    const playNextEpisode = useCallback(() => {
        if (!currentEpisode || !autoplayEnabled) return;

        const currentIndex = episodes.findIndex(ep => ep.episodeId === currentEpisode.episodeId);
        const nextEpisode = episodes[currentIndex + 1];

        if (nextEpisode) {
            playEpisode(nextEpisode);
        }
    }, [currentEpisode, episodes, autoplayEnabled, playEpisode]);

    const toggleAutoplay = (checked: boolean) => {
        setAutoplayEnabled(checked);

        localStorage.setItem('autoplayEnabled', JSON.stringify(checked));
    };

    const loadEpisodes = useCallback(async (animeId: string) => {
        const fetchedEpisodes = await episodeService.getEpisodesByAnimeId(animeId);
        setEpisodes(fetchedEpisodes);

        const savedProgress = episodeService.getProgress(animeId);
        if (savedProgress) {
            const lastEpisode = fetchedEpisodes.find(ep => ep.episodeId === savedProgress.lastEpisodeId);
            if (lastEpisode) {
                playEpisode(lastEpisode);
            }
        } else if (fetchedEpisodes.length > 0) {
            // Якщо немає збереженого прогресу, починаємо з першої серії
            playEpisode(fetchedEpisodes[0]);
        }
    }, [episodeService, playEpisode]);

    useEffect(() => {
        if (watchId) {
            loadEpisodes(watchId);

            const autoplayEnabled = localStorage.getItem('autoplayEnabled');
            if (autoplayEnabled) {
                setAutoplayEnabled(JSON.parse(autoplayEnabled) as boolean)
            }
        }

    }, [loadEpisodes, watchId]);

    return (
        <PlayerContext.Provider
            value={{
                watchId,
                currentVideo,
                isPlaying,
                episodes,
                currentEpisode,
                playVideo,
                loadEpisodes,
                playEpisode,
                playNextEpisode,
                autoplayEnabled,
                toggleAutoplay
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);
