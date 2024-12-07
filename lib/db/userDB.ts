"use server";

import {db} from "@/lib/db"; // adjust the import path as needed
import {
    animeAgeTable, animeCommentsTable,
    animeDubDirectorTable,
    animeEditingTable,
    animeEpisodeTable,
    animeGenreTable, animePopularityTable,
    animeSoundTable,
    animeSourceTable,
    animeStatusTable,
    animeStudioTable,
    animeTable,
    animeTranslateTable,
    animeTypeTable,
    animeVideoEditingTable,
    animeVocalsTable,
    animeVoiceActorsTable,
    characterTable,
    directorTable,
    episodeTable,
    genreTable,
    memberTable, roleTable,
    userTable
} from "@/lib/db/schema";
import {and, desc, eq, isNotNull, isNull, like, or, sql} from "drizzle-orm";
import {hashPassword, verifyPassword} from "@/lib/auth/jwt";
import {AnimeData, CommentsType} from "@/components/types/anime-types";
import {User as UserType, User} from "@/components/types/user";
import {getSession} from "@/lib/auth/session";


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
    return db.select({
        name: characterTable.name,
        animeId: characterTable.animeId,
        image: characterTable.image,
        popularityId: animePopularityTable.popularityId,
        characterId: characterTable.characterId,
        voiceActorId: characterTable.voiceActorId,
    }).from(characterTable)
        .where(eq(characterTable.voiceActorId, searchUserId))
        .leftJoin(animeTable, eq(animeTable.animeId, characterTable.animeId))
        .leftJoin(animePopularityTable, eq(animePopularityTable.popularityId, animeTable.animePopularityId))
        .orderBy(
            // Спочатку сортуємо, якщо animeId відповідає searchFromAnime
            sql`CASE WHEN ${characterTable.animeId} = ${searchFromAnime} THEN 0 ELSE 1 END`,
            // Далі сортуємо за popularityId
            characterTable.popularityId,
            animePopularityTable.order,
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
        .leftJoin(animePopularityTable, eq(animePopularityTable.popularityId, animeTable.animePopularityId))
        .where(
            or(
                (like(animeTable.nameUkr, `%${searchQuery}%`)),
                (like(animeTable.nameEng, `%${searchQuery}%`))
            )
        ) // Додаємо фільтрацію по назві аніме
        .orderBy(
            animePopularityTable.order,
            animeTable.statusId,
        )
        .limit(9);
}


export async function getComments(
    animeId: number,
    limit: number = 9,
    offset: number = 0,
    isAdmin: boolean = false,
): Promise<CommentsType[]> {
    // Спочатку створимо підзапит для підрахунку відповідей

    const repliesSubquery = db
        .select({
            parentCommentId: animeCommentsTable.parentCommentId,
            repliesCount: sql<number>`count(*)`.as('repliesCount')
        })
        .from(animeCommentsTable)
        .where(
            and(
                isNotNull(animeCommentsTable.parentCommentId),
                or(
                    eq(animeCommentsTable.isDeleted, false),
                    eq(animeCommentsTable.isDeleted, isAdmin),
                ),
            )
        )
        .groupBy(animeCommentsTable.parentCommentId)
        .as('repliesSubquery');

    return db.select({
        comment: animeCommentsTable,
        user: {
            userId: userTable.userId,
            nickname: userTable.nickname,
            name: userTable.name,
            image: userTable.image,
            role: userTable.roleId,
            roleDescription: roleTable.description,
        },
        repliesCount: repliesSubquery.repliesCount
    }).from(animeCommentsTable)
        .leftJoin(repliesSubquery, eq(animeCommentsTable.commentId, repliesSubquery.parentCommentId))
        .where(
            and(
                and(
                    eq(animeCommentsTable.animeId, animeId),
                    isNull(animeCommentsTable.parentCommentId)  // Only top-level comments
                ),
                or(
                    eq(animeCommentsTable.isDeleted, false),
                    eq(animeCommentsTable.isDeleted, isAdmin),
                ),
            )
        )

        .orderBy(desc(animeCommentsTable.updateDate))
        .limit(limit)
        .offset(offset)
        .leftJoin(userTable, eq(userTable.userId, animeCommentsTable.userId))
        .leftJoin(roleTable, eq(roleTable.roleId, userTable.roleId));
}

export async function getNestedComments(
    parentCommentId: number,
    limit: number = 10,
    isAdmin: boolean = false,
): Promise<CommentsType[]> {

    const repliesSubquery = db
        .select({
            parentCommentId: animeCommentsTable.parentCommentId,
            repliesCount: sql<number>`count(*)`.as('repliesCount')
        })
        .from(animeCommentsTable)
        .where(
            and(
                isNotNull(animeCommentsTable.parentCommentId),
                or(
                    eq(animeCommentsTable.isDeleted, false),
                    eq(animeCommentsTable.isDeleted, isAdmin),
                ),
            )
        )
        .groupBy(animeCommentsTable.parentCommentId)
        .as('repliesSubquery');


    return db.select({
        comment: animeCommentsTable,
        user: {
            userId: userTable.userId,
            nickname: userTable.nickname,
            name: userTable.name,
            image: userTable.image,
            role: userTable.roleId,
            roleDescription: roleTable.description,
        },
        repliesCount: repliesSubquery.repliesCount
    }).from(animeCommentsTable)
        .leftJoin(repliesSubquery, eq(animeCommentsTable.commentId, repliesSubquery.parentCommentId))
        .where(
            and(
                eq(animeCommentsTable.parentCommentId, parentCommentId),
                or(
                    eq(animeCommentsTable.isDeleted, false),
                    eq(animeCommentsTable.isDeleted, isAdmin),
                ),
            )
        )
        .orderBy(desc(animeCommentsTable.updateDate))
        .limit(limit)
        .leftJoin(userTable, eq(userTable.userId, animeCommentsTable.userId))
        .leftJoin(roleTable, eq(roleTable.roleId, userTable.roleId));
}

export async function sendComment(comment: {
    animeId: number;
    userId: number | null;
    parentCommentId: number | null;
    comment: string;
}) {
    const newCommentId = await db.insert(animeCommentsTable).values({
        animeId: comment.animeId,
        userId: comment.userId || null,
        parentCommentId: comment.parentCommentId,
        comment: comment.comment,
        updateDate: new Date(),
        isDeleted: false,
    }).returning({id: animeCommentsTable.commentId});

    // Fetch the full comment details with user information
    const [newCommentWithUser] = await db.select({
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
        .where(eq(animeCommentsTable.commentId, newCommentId[0].id))
        .leftJoin(userTable, eq(userTable.userId, animeCommentsTable.userId))
        .leftJoin(roleTable, eq(roleTable.roleId, userTable.roleId));

    return newCommentWithUser;
}

export async function deleteComment(commentId: number) {
    const parsed = await getSession();
    const user = parsed?.user as UserType;

    if (!user) {
        throw new Error('Ви не авторизовані');
    }

    const selectedComment = await db.query.animeCommentsTable.findFirst({
        where: eq(animeCommentsTable.commentId, commentId),
        columns: {
            userId: true,
            isDeleted: true,
        }
    });

    if (user.roleId !== 3) {
        if (!selectedComment || selectedComment.userId !== user.userId) {
            throw new Error('Ви не маєте права видаляти цей коментар');
        }
    }


    await db
        .update(animeCommentsTable)
        .set({isDeleted: true,})
        .where(eq(animeCommentsTable.commentId, commentId));

    return {success: true, message: 'Успіх!'};

}