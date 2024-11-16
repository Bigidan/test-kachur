export interface Episode {
    episodeId: string;
    episodeName: string;
    episodeNumber: number;

    opStart: number,
    opEnd: number,
    endStart: number,
    endEnd: number,

    url: string;
    cover: string;
}

interface AnimeProgress {
    watchId: string;
    lastEpisodeId: string;
}

export class EpisodeService {
    async getEpisodesByAnimeId(watchId: string): Promise<Episode[]> {
        // Тут ваш API запит до бази даних
        try {
            return [
                {
                    episodeId: "0",
                    episodeName: "З цього й починається кохання, ясно?",
                    episodeNumber: 1,
                    url: `http://192.168.178.26/episodes/${watchId}/1_1080.mp4`,
                    cover: "Стрьомна жінка",

                    opStart: 222,
                    opEnd: 222,
                    endStart: 222,
                    endEnd: 222,
                },
                {
                    episodeId: "1",
                    episodeName: "Це прибулець, ясно?",
                    episodeNumber: 2,
                    url: `http://192.168.178.26/episodes/${watchId}/2_1080.mp4`,
                    cover: "Стрьомна жінка",

                    opStart: 222,
                    opEnd: 222,
                    endStart: 222,
                    endEnd: 222,
                },                {
                    episodeId: "2",
                    episodeName: "Бабця проти бабці",
                    episodeNumber: 3,
                    url: `http://192.168.178.26/episodes/${watchId}/3_1080.mp4`,
                    cover: "Стрьомна жінка",

                    opStart: 222,
                    opEnd: 222,
                    endStart: 222,
                    endEnd: 222,
                },
            ]
        } catch (error) {
            console.error('Error fetching episodes:', error);
            return [];
        }
    }

    saveProgress(watchId: string, episodeId: string) {
        const progress: AnimeProgress = {
            watchId,
            lastEpisodeId: episodeId,
        };
        localStorage.setItem(`anime_progress_${watchId}`, JSON.stringify(progress));
    }

    // Отримання збереженого прогресу
    getProgress(watchId: string): AnimeProgress | null {
        const saved = localStorage.getItem(`anime_progress_${watchId}`);
        return saved ? JSON.parse(saved) : null;
    }
}