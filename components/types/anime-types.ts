// types.ts

export type Anime = {
    animeId: number;
    typeId: number | null;
    statusId: number | null;
    statusText?: string | null;
    sourceId: number | null;
    ageId: number | null;
    studioId: number | null;
    directorId: number | null;
    nameUkr: string;
    nameJap: string;
    nameEng: string;
    episodesExpected: number | null;
    rating: string | null;
    releaseDate: Date | null;
    description: string | null;
    trailerLink: string | null;
    headerImage: string | null;
    shortDescription: string | null;
    popularity: number | null;
};

export type AnimeType = {
    id: number;
    typeName: string;
};

export type AnimeStatus = {
    id: number;
    statusName: string;
};

export type AnimeSource = {
    id: number;
    sourceName: string;
};

export type AnimeAge = {
    id: number;
    ageName: string;
};

export type AnimeStudio = {
    id: number;
    studioName: string;
};

export type Director = {
    id: number;
    directorName: string;
};


export interface AnimeData {
    dubDirector: {
        memberNickname: string | null,
        memberName: string | null,
        memberId: number | null,
        userId: number | null,
    }[];
    voiceActors: {
        memberNickname: string | null,
        memberName: string | null,
        memberId: number | null,
        userId: number | null,
    }[];
    genres: {
        genreId: number | null,
        genreName: string | null
    }[];
    sound: {
        memberNickname: string | null,
        memberName: string | null,
        memberId: number | null,
        userId: number | null,
    }[];
    vocals: {
        memberNickname: string | null,
        memberName: string | null,
        memberId: number | null,
        userId: number | null,
    }[];
    anime: {
        animeId: number,
        nameUkr: string,
        nameJap: string,
        nameEng: string,
        statusId: number | null,
        statusText: string | null,
        episodesExpected: number | null,
        rating: string | null,
        typeId: number | null,
        typeName: string | null,
        sourceId: number | null,
        sourceName: string | null,
        releaseDate: Date | null,
        description: string | null,
        ageId: number | null,
        ageName: string | null;
        studioId: number | null,
        studioName: string | null,
        directorId: number | null,
        directorName: string | null,
        trailerLink: string | null,
        headerImage: string | null;

        existedEpisodes: number,
    }[];
    translate: {
        memberNickname: string | null,
        memberName: string | null,
        memberId: number | null,
        userId: number | null,
    }[];
    editing: {
        memberNickname: string | null,
        memberName: string | null,
        memberId: number | null,
        userId: number | null,
    }[];
    videoEditing: {
        memberNickname: string | null,
        memberName: string | null,
        memberId: number | null,
        userId: number | null,
    }[];
}


export interface CommentsType {
    comment: {
        commentId: number;
        animeId: number | null;
        userId: number | null;
        parentCommentId: number | null;
        comment: string | null;
        updateDate: Date;
    },
    user: {
        userId: number | null,
        nickname: string | null,
        name: string | null,
        image: string | null,
        role: number | null,
        roleDescription: string | null,
    } | null,
}