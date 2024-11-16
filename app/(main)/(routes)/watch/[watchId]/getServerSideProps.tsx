
import { GetStaticProps} from 'next';
import {getAllAnimeData} from "@/lib/db/userDB";
import {AnimeData} from "@/components/types/anime-types";

export const getServerSideProps = (async (context) => {
    const { watchId } = context.params as { watchId: string };
    console.log("context.params", context.params);

    if (!watchId) {
        return { notFound: true };  // Якщо watchId відсутній
    }

    const animeData = await getAllAnimeData(Number(watchId));

    if (!animeData) {
        return { notFound: true };  // Якщо дані не знайдено, відправляємо 404
    }

    return {
        props: {
            watchId,
            animeData, // Передаємо animeData як пропс
        },
    };
}) satisfies GetStaticProps<{
    watchId: string;
    animeData: AnimeData;
}>;
