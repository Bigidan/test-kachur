"use server";

import { db } from "@/lib/db"; // adjust the import path as needed
import {
    animeAgeTable, animeCommentsTable,
    animeDubDirectorTable,
    animeEditingTable, animeEpisodeTable,
    animeGenreTable,
    animeSoundTable,
    animeSourceTable,
    animeStatusTable,
    animeStudioTable,
    animeTable,
    animeTranslateTable,
    animeTypeTable,
    animeVideoEditingTable,
    animeVocalsTable,
    animeVoiceActorsTable, characterTable,
    directorTable, episodeTable,
    genreTable,
    memberTable, roleTable,
    userTable
} from "@/lib/db/schema";
import {desc, eq, like, or, sql} from "drizzle-orm";
import { hashPassword, verifyPassword } from "@/lib/auth/jwt";
import { AnimeData, CommentsType} from "@/components/types/anime-types";
import {User} from "@/components/types/user"; // adjust the import path as needed


export async function userRegister(values: {
    nickname: string;
    username: string;
    email: string;
    password: string;
}) {
    const hash = await hashPassword(values.password);

    await db.insert(userTable).values({
        roleId: 1,
        nickname: values.nickname,
        name: values.username,
        email: values.email,
        autoSkip: false,
        password: hash,
    });
}

export async function getUserByField(
    field: "name" | "email",
    value: string,
    password?: string
): Promise<User | null | undefined> {
    const result = await db
        .select({
            userId: userTable.userId,
            roleId: userTable.roleId,
            nickname: userTable.nickname,
            name: userTable.name,
            email: userTable.email,
            autoSkip: userTable.autoSkip,
            image: userTable.image,
            password: userTable.password,
        })
        .from(userTable)
        .where(eq(userTable[field], value));

    // Return null if user doesn't exist
    if (result.length === 0) return undefined;

    const user = result[0];

    if (password && !await verifyPassword(password, user.password)) {
        return null;
    }

    user.password = "";

    return user;
}

export async function getUserByLogin(name: string): Promise<
    Array<{
        userId: number,
        roleId: number | null,
        nickname: string,
        name: string,
        email: string,
        autoSkip: boolean,
        password: string,
    }>
> {
    return db.select().from(userTable).where(eq(userTable.name, name));
}
export async function getUserByEmail(email: string): Promise<
    Array<{
        userId: number,
        roleId: number | null,
        nickname: string,
        name: string,
        email: string,
        autoSkip: boolean,
        password: string,
    }>
> {
    return db.select().from(userTable).where(eq(userTable.email, email));
}


export async function getAllAnimeData(searchAnimeId: number): Promise<AnimeData> {
    const [anime,

        genres,
        translate,
        editing,

        sound,
        videoEditing,
        voiceActors,

        vocals,
        dubDirector,
    ] = await Promise.all([
        db.select({
            animeId: animeTable.animeId,

            nameUkr: animeTable.nameUkr,
            nameJap: animeTable.nameJap,
            nameEng: animeTable.nameEng,

            statusId: animeTable.statusId,
            statusText: animeStatusTable.statusName,

            episodesExpected: animeTable.episodesExpected,
            rating: animeTable.rating,

            typeId: animeTable.typeId,
            typeName: animeTypeTable.typeName,

            sourceId: animeTable.sourceId,
            sourceName: animeSourceTable.sourceName,

            releaseDate: animeTable.releaseDate,
            description: animeTable.description,

            ageId: animeTable.ageId,
            ageName: animeAgeTable.ageName,

            studioId: animeTable.studioId,
            studioName: animeStudioTable.studioName,

            directorId: animeTable.directorId,
            directorName: directorTable.directorName,

            trailerLink: animeTable.trailerLink,
            headerImage: animeTable.headerImage,

            existedEpisodes: db.$count(animeEpisodeTable, eq(animeEpisodeTable.animeId, animeTable.animeId)),

        }).from(animeTable).where(eq(animeTable.animeId, searchAnimeId))
            .leftJoin(animeStatusTable, eq(animeStatusTable.statusId, animeTable.statusId))
            .leftJoin(animeTypeTable, eq(animeTypeTable.typeId, animeTable.typeId))
            .leftJoin(animeSourceTable, eq(animeSourceTable.sourceId, animeTable.sourceId))
            .leftJoin(animeAgeTable, eq(animeAgeTable.ageId, animeTable.ageId))
            .leftJoin(animeStudioTable, eq(animeStudioTable.studioId, animeTable.studioId))
            .leftJoin(directorTable, eq(directorTable.directorId, animeTable.directorId)),

        db.select({
            genreId: genreTable.genreId,
            genreName: genreTable.genreName,
        }).from(animeGenreTable)
            .where(eq(animeGenreTable.animeId, searchAnimeId))
            .leftJoin(genreTable, eq(genreTable.genreId, animeGenreTable.genreId)),

        db.select({
            memberNickname: userTable.nickname,
            memberName: userTable.name,
            memberId: memberTable.memberId,
            userId: userTable.userId,
        }).from(animeTranslateTable)
            .where(eq(animeTranslateTable.animeId, searchAnimeId))
            .leftJoin(memberTable, eq(memberTable.memberId, animeTranslateTable.memberId))
            .leftJoin(userTable, eq(userTable.userId, memberTable.userId)),

        db.select({
            memberNickname: userTable.nickname,
            memberName: userTable.name,
            memberId: memberTable.memberId,
            userId: userTable.userId,
        }).from(animeEditingTable).where(eq(animeEditingTable.animeId, searchAnimeId))
            .leftJoin(memberTable, eq(memberTable.memberId, animeEditingTable.memberId))
            .leftJoin(userTable, eq(userTable.userId, memberTable.userId)),

        db.select({
            memberNickname: userTable.nickname,
            memberName: userTable.name,
            memberId: memberTable.memberId,
            userId: userTable.userId,
        }).from(animeSoundTable).where(eq(animeSoundTable.animeId, searchAnimeId))
            .leftJoin(memberTable, eq(memberTable.memberId, animeSoundTable.memberId))
            .leftJoin(userTable, eq(userTable.userId, memberTable.userId)),
        db.select({
            memberNickname: userTable.nickname,
            memberName: userTable.name,
            memberId: memberTable.memberId,
            userId: userTable.userId,
        }).from(animeVideoEditingTable).where(eq(animeVideoEditingTable.animeId, searchAnimeId))
            .leftJoin(memberTable, eq(memberTable.memberId, animeVideoEditingTable.memberId))
            .leftJoin(userTable, eq(userTable.userId, memberTable.userId)),
        db.select({
            memberNickname: userTable.nickname,
            memberName: userTable.name,
            memberId: memberTable.memberId,
            userId: userTable.userId,
        }).from(animeVoiceActorsTable).where(eq(animeVoiceActorsTable.animeId, searchAnimeId))
            .leftJoin(memberTable, eq(memberTable.memberId, animeVoiceActorsTable.memberId))
            .leftJoin(userTable, eq(userTable.userId, memberTable.userId)),

        db.select({
            memberNickname: userTable.nickname,
            memberName: userTable.name,
            memberId: memberTable.memberId,
            userId: userTable.userId,
        }).from(animeVocalsTable).where(eq(animeVocalsTable.animeId, searchAnimeId))
            .leftJoin(memberTable, eq(memberTable.memberId, animeVocalsTable.memberId))
            .leftJoin(userTable, eq(userTable.userId, memberTable.userId)),
        db.select({
            memberNickname: userTable.nickname,
            memberName: userTable.name,
            memberId: memberTable.memberId,
            userId: userTable.userId,
        }).from(animeDubDirectorTable).where(eq(animeDubDirectorTable.animeId, searchAnimeId))
            .leftJoin(memberTable, eq(memberTable.memberId, animeDubDirectorTable.memberId))
            .leftJoin(userTable, eq(userTable.userId, memberTable.userId)),
    ]);

    return {
        anime,

        genres,
        translate,
        editing,

        sound,
        videoEditing,
        voiceActors,

        vocals,
        dubDirector,
    };
}

export async function getAllEpisodesForAnime(searchAnimeId: number){
    return db.select({
        episodeId: episodeTable.episodeId,
        episodeName: episodeTable.name,
        episodeNumber: episodeTable.number,

        opStart: episodeTable.opStart,
        opEnd: episodeTable.opEnd,
        endStart: episodeTable.endStart,
        endEnd: episodeTable.endEnd,

        cover: episodeTable.cover,

    }).from(animeEpisodeTable)
        .where(eq(animeEpisodeTable.animeId, searchAnimeId))
        .leftJoin(episodeTable, eq(animeEpisodeTable.episodeId, episodeTable.episodeId))
}

export async function getCharactersByActorId(searchUserId: number, searchFromAnime: number) {
    return db.select().from(characterTable)
        .where(eq(characterTable.voiceActorId, searchUserId))
        .orderBy(
            // Спочатку сортуємо, якщо animeId відповідає searchFromAnime
            sql`CASE WHEN ${characterTable.animeId} = ${searchFromAnime} THEN 0 ELSE 1 END`,
            // Далі сортуємо за popularityId
            characterTable.popularityId,
        )
        .limit(8);
}

export async function getArtByUser(searchUserId: number) {
    return db.select({ uart: userTable.art, nickname: userTable.nickname }).from(userTable).where(eq(userTable.userId, searchUserId));
}


export async function getPopularAnimeBySearch(searchQuery: string) {
    return db.select({

        animeId: animeTable.animeId,
        nameUkr: animeTable.nameUkr,
        episodesExpected: animeTable.episodesExpected,
        headerImage: animeTable.headerImage,

        statusName: animeStatusTable.statusName,
        statusId: animeTable.statusId,

        existedEpisodes: db.$count(animeEpisodeTable, eq(animeEpisodeTable.animeId, animeTable.animeId)),

    })
        .from(animeTable)
        .leftJoin(animeStatusTable, eq(animeStatusTable.statusId, animeTable.statusId))
        .where(
            or(
                (like(animeTable.nameUkr, `%${searchQuery}%`)),
                (like(animeTable.nameEng, `%${searchQuery}%`))
            )
        ) // Додаємо фільтрацію по назві аніме
        .orderBy(
            animeTable.animePopularityId,
            animeTable.statusId,
        )
        .limit(9);
}

export async function getComments(animeId: number): Promise<CommentsType[]>{
    return db.select({
        comment: animeCommentsTable,
        user: {
            userId: userTable.userId,
            nickname: userTable.nickname,
            name: userTable.name,
            image: userTable.image,
            role: userTable.roleId,
            roleDescription: roleTable.description,
        }
    }).from(animeCommentsTable)
        .where(eq(animeCommentsTable.animeId, animeId))
        .orderBy(desc(animeCommentsTable.commentId))
        .limit(9)
        .leftJoin(userTable, eq(userTable.userId, animeCommentsTable.userId))
        .leftJoin(roleTable, eq(roleTable.roleId, userTable.roleId));
}

export async function sendComment(comment: {
    animeId: number;
    userId: number | null;
    parentCommentId: number | null;
    comment: string;
    updateDate: Date;
}) {

    await db.insert(animeCommentsTable).values({
        animeId: comment.animeId,
        userId: comment.userId || null,
        parentCommentId: comment.parentCommentId,
        comment: comment.comment,
        updateDate: new Date(),
        isDeleted: false,
    });

}