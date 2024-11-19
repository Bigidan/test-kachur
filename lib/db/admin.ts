"use server";

import {db} from "@/lib/db"; // adjust the import path as needed
import {
    animeAgeTable,
    animeDubDirectorTable,
    animeEditingTable,
    animeEpisodeTable,
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
    animeVoiceActorsTable,
    characterTable,
    directorTable,
    episodeTable,
    genreTable,
    memberTable,
    popularityTable,
    roleTable,
    userTable
} from "@/lib/db/schema";
import {and, eq, like, SQL} from "drizzle-orm";
import {Anime} from "@/components/types/anime-types";
import {SQLiteTable} from "drizzle-orm/sqlite-core";

// Функція для отримання всіх жанрів
export async function getAllGenres() {
    return db.select().from(genreTable);
}

// Функція для додавання нового жанру
export async function addGenre(genreName: string) {
    return db.insert(genreTable).values({
        genreName,
    }).returning({ id: genreTable.genreId, genreName: genreTable.genreName });
}

// Функція для оновлення жанру за його ID
export async function updateGenre(genreId: number, newGenreName: string) {
    return db.update(genreTable)
        .set({ genreName: newGenreName })
        .where(eq(genreTable.genreId, genreId)).returning({ id: genreTable.genreId });
}

// Функція для видалення жанру за його ID
export async function deleteGenre(genreId: number) {
    return db.delete(genreTable).where(eq(genreTable.genreId, genreId)).returning({ id: genreTable.genreId });
}


// Функція для отримання всіх ролей
export async function getAllRoles() {
    return db.select().from(roleTable);
}

// Функція для додавання нової ролі
export async function addRole(description: string) {
    return db.insert(roleTable).values({
        description,
    }).returning({ id: roleTable.roleId, description: roleTable.description });
}

// Функція для оновлення ролі
export async function updateRole(roleId: number, newDescription: string) {
    return db.update(roleTable)
        .set({ description: newDescription })
        .where(eq(roleTable.roleId, roleId)).returning({ id: roleTable.roleId });
}

// Функція для видалення ролі
export async function deleteRole(roleId: number) {
    return db.delete(roleTable).where(eq(roleTable.roleId, roleId)).returning({ id: roleTable.roleId });
}



// Функція для отримання користувачів з пагінацією
export async function getUsersWithPagination(limit: number = 20, offset: number = 0) {
    return db
        .select()
        .from(userTable)
        .limit(limit)
        .offset(offset);
}

// Функція для оновлення користувача
export async function updateUser(userId: number, roleId: number, nickname: string, name: string, email: string, autoSkip: boolean) {
    return db.update(userTable)
        .set({ roleId: roleId, nickname: nickname, name: name, email: email, autoSkip: autoSkip })
        .where(eq(userTable.userId, userId)).returning({ id: userTable.userId });
}

// Функція для видалення користувача
export async function deleteUser(userId: number) {
    return db.delete(userTable).where(eq(userTable.userId, userId)).returning({ id: userTable.userId });
}



// Функція для отримання всіх учасників команди
export async function getTeam() {
    return db.select({
        memberId: memberTable.memberId,
        userId: memberTable.userId,
        nickname: userTable.nickname,
    }).from(memberTable).leftJoin(userTable, eq(userTable.userId, memberTable.userId));
}

// Функція для додавання нового учасника
export async function addTeam(userId: number) {
    return db.insert(memberTable).values({
        userId,
    }).returning({ id: memberTable.memberId });
}

// Функція для оновлення учасника
export async function updateMember(memberId: number, newUserId: number) {
    return db.update(memberTable)
        .set({ userId: newUserId })
        .where(eq(memberTable.memberId, memberId)).returning({ id: memberTable.memberId });
}

// Функція для видалення учасника
export async function deleteMember(memberId: number) {
    return db.delete(memberTable).where(eq(memberTable.memberId, memberId)).returning({ id: memberTable.memberId });
}

// Функція для отримання користувачів по ніку
export async function getUsersByNickname(nickname: string) {
    return db
        .select()
        .from(userTable).where(like(userTable.nickname, `%${nickname}%`));
}





export async function getAllDirectors() {
    return db.select({
        id: directorTable.directorId,
        name: directorTable.directorName,
    }).from(directorTable);
}

export async function addDirector(directorName: string) {
    return db.insert(directorTable)
        .values({ directorName })
        .returning({ id: directorTable.directorId });
}

export async function updateDirector(directorId: number, directorName: string) {
    return db.update(directorTable)
        .set({ directorName })
        .where(eq(directorTable.directorId, directorId))
        .returning({ id: directorTable.directorId });
}

export async function deleteDirector(directorId: number) {
    return db.delete(directorTable)
        .where(eq(directorTable.directorId, directorId))
        .returning({ id: directorTable.directorId });
}

// Anime Type functions
export async function getAllTypes() {
    return db.select({
        id: animeTypeTable.typeId,
        name: animeTypeTable.typeName,
    }).from(animeTypeTable);
}

export async function addType(typeName: string) {
    return db.insert(animeTypeTable)
        .values({ typeName })
        .returning({ id: animeTypeTable.typeId });
}

export async function updateType(typeId: number, typeName: string) {
    return db.update(animeTypeTable)
        .set({ typeName })
        .where(eq(animeTypeTable.typeId, typeId))
        .returning({ id: animeTypeTable.typeId });
}

export async function deleteType(typeId: number) {
    return db.delete(animeTypeTable)
        .where(eq(animeTypeTable.typeId, typeId))
        .returning({ id: animeTypeTable.typeId });
}

// Anime Status functions
export async function getAllStatuses() {
    return db.select({
        id: animeStatusTable.statusId,
        name: animeStatusTable.statusName,
    }).from(animeStatusTable);
}

export async function addStatus(statusName: string) {
    return db.insert(animeStatusTable)
        .values({ statusName })
        .returning({ id: animeStatusTable.statusId });
}

export async function updateStatus(statusId: number, statusName: string) {
    return db.update(animeStatusTable)
        .set({ statusName })
        .where(eq(animeStatusTable.statusId, statusId))
        .returning({ id: animeStatusTable.statusId });
}

export async function deleteStatus(statusId: number) {
    return db.delete(animeStatusTable)
        .where(eq(animeStatusTable.statusId, statusId))
        .returning({ id: animeStatusTable.statusId });
}

// Anime Source functions
export async function getAllSources() {
    return db.select({
        id: animeSourceTable.sourceId,
        name: animeSourceTable.sourceName,
    }).from(animeSourceTable);
}

export async function addSource(sourceName: string) {
    return db.insert(animeSourceTable)
        .values({ sourceName })
        .returning({ id: animeSourceTable.sourceId });
}

export async function updateSource(sourceId: number, sourceName: string) {
    return db.update(animeSourceTable)
        .set({ sourceName })
        .where(eq(animeSourceTable.sourceId, sourceId))
        .returning({ id: animeSourceTable.sourceId });
}

export async function deleteSource(sourceId: number) {
    return db.delete(animeSourceTable)
        .where(eq(animeSourceTable.sourceId, sourceId))
        .returning({ id: animeSourceTable.sourceId });
}

// Anime Age functions
export async function getAllAges() {
    return db.select({
        id: animeAgeTable.ageId,
        name: animeAgeTable.ageName,
    }).from(animeAgeTable);
}

export async function addAge(ageName: string) {
    return db.insert(animeAgeTable)
        .values({ ageName })
        .returning({ id: animeAgeTable.ageId });
}

export async function updateAge(ageId: number, ageName: string) {
    return db.update(animeAgeTable)
        .set({ ageName })
        .where(eq(animeAgeTable.ageId, ageId))
        .returning({ id: animeAgeTable.ageId });
}

export async function deleteAge(ageId: number) {
    return db.delete(animeAgeTable)
        .where(eq(animeAgeTable.ageId, ageId))
        .returning({ id: animeAgeTable.ageId });
}

// Anime Studio functions
export async function getAllStudios() {
    return db.select({
        id: animeStudioTable.studioId,
        name: animeStudioTable.studioName,
    }).from(animeStudioTable);
}

export async function addStudio(studioName: string) {
    return db.insert(animeStudioTable)
        .values({ studioName })
        .returning({ id: animeStudioTable.studioId });
}

export async function updateStudio(studioId: number, studioName: string) {
    return db.update(animeStudioTable)
        .set({ studioName })
        .where(eq(animeStudioTable.studioId, studioId))
        .returning({ id: animeStudioTable.studioId });
}

export async function deleteStudio(studioId: number) {
    return db.delete(animeStudioTable)
        .where(eq(animeStudioTable.studioId, studioId))
        .returning({ id: animeStudioTable.studioId });
}

// Search functions (if needed)
export async function searchDirectors(query: string) {
    return db.select()
        .from(directorTable)
        .where(like(directorTable.directorName, `%${query}%`));
}

export async function searchStudios(query: string) {
    return db.select()
        .from(animeStudioTable)
        .where(like(animeStudioTable.studioName, `%${query}%`));
}


// Функція для отримання всіх записів популярності
export async function getAllPopularity() {
    return db.select().from(popularityTable);
}

// Функція для додавання нової популярності
export async function addPopularity(popularity: string) {
    return db.insert(popularityTable).values({
        popularity,
    }).returning({id: popularityTable.popularityId, popularity: popularityTable.popularity});
}

// Функція для оновлення популярності за її ID
export async function updatePopularity(popularityId: number, newPopularity: string) {
    return db.update(popularityTable)
        .set({ popularity: newPopularity })
        .where(eq(popularityTable.popularityId, popularityId)).returning({ id: popularityTable.popularityId });
}

// Функція для видалення популярності за її ID
export async function deletePopularity(popularityId: number) {
    return db.delete(popularityTable).where(eq(popularityTable.popularityId, popularityId));
}


export async function getAllAnime(): Promise<Anime[]> {
    return db.select({
        animeId: animeTable.animeId,
        typeId: animeTable.typeId,

        statusId: animeTable.statusId,
        statusText: animeStatusTable.statusName,

        sourceId: animeTable.sourceId,
        ageId: animeTable.ageId,
        studioId: animeTable.studioId,
        directorId: animeTable.directorId,
        nameUkr: animeTable.nameUkr,
        nameJap: animeTable.nameJap,
        nameEng: animeTable.nameEng,
        episodesExpected: animeTable.episodesExpected,
        rating: animeTable.rating,
        releaseDate: animeTable.releaseDate,
        description: animeTable.description,
        trailerLink: animeTable.trailerLink,
        headerImage: animeTable.headerImage,
    }).from(animeTable).leftJoin(animeStatusTable, eq(animeTable.statusId, animeStatusTable.statusId));
}

// Функція для оновлення аніме
export async function updateAnime(
    animeId: number,
    typeId: number,
    statusId: number,
    sourceId: number,
    ageId: number,
    studioId: number,
    directorId: number,
    nameUkr: string,
    nameJap: string,
    nameEng: string,
    episodesExpected: number,
    rating: string,
    releaseDate: Date,
    description: string,
    trailerLink: string,
    headerImage: string,
): Promise<void> {
    await db.update(animeTable)
        .set({
            typeId,
            statusId,
            sourceId,
            ageId,
            studioId,
            directorId,
            nameUkr,
            nameJap,
            nameEng,
            episodesExpected,
            rating,
            releaseDate,
            description,
            trailerLink,
            headerImage,
        })
        .where(eq(animeTable.animeId, animeId));
}

// Функція для видалення аніме
export async function deleteAnime(animeId: number): Promise<void> {
    await db.delete(animeTable)
        .where(eq(animeTable.animeId, animeId));
}

export async function addAnime(
    typeId: number,
    statusId: number,
    sourceId: number,
    ageId: number,
    studioId: number,
    directorId: number,
    nameUkr: string,
    nameJap: string,
    nameEng: string,
    episodesExpected: number,
    rating: string,
    releaseDate: Date,
    description: string,
    trailerLink: string,
    headerImage: string,
): Promise<void> {
    await db.insert(animeTable).values({
        typeId: typeId,
        statusId: statusId,
        sourceId: sourceId,
        ageId: ageId,
        studioId: studioId,
        directorId: directorId,
        nameUkr: nameUkr,
        nameJap: nameJap,
        nameEng: nameEng,
        episodesExpected: episodesExpected,
        rating: rating,
        releaseDate: releaseDate,
        description: description,
        trailerLink: trailerLink,
        headerImage: headerImage,
    })
}




// Функція для отримання всіх епізодів для певного аніме
export async function getEpisodesByAnimeId(animeId: number) {
    return db.select().from(episodeTable)
        .innerJoin(animeEpisodeTable, eq(episodeTable.episodeId, animeEpisodeTable.episodeId))
        .where(eq(animeEpisodeTable.animeId, animeId));
}

export async function addEpisode(
    animeId: number,
    name: string,
    number: number,
    opStart: number,
    opEnd: number,
    endStart: number,
    endEnd: number,
    cover: string
) {
    const episode = await addEpisodeToAnime(name, number, opStart, opEnd, endStart, endEnd, cover);
    const episodeId = episode[0]?.id;
    return await linkEpisodeToAnime(animeId, episodeId);
}

export async function addEpisodeToAnime(
    name: string,
    number: number,
    opStart: number,
    opEnd: number,
    endStart: number,
    endEnd: number,
    cover: string
) {

    // Додавання нового епізоду
    return db.insert(episodeTable).values({
        name: name,
        number: number,
        opStart: opStart,
        opEnd: opEnd,
        endStart: endStart,
        endEnd: endEnd,
        cover: cover
    }).returning({id: episodeTable.episodeId});

}

export async function linkEpisodeToAnime(animeId: number, episodeId: number) {

    await db.insert(animeEpisodeTable).values({
        animeId,
        episodeId,
    });
}

export async function updateEpisode(
    episodeId: number,
    name: string,
    number: number,
    opStart: number,
    opEnd: number,
    endStart: number,
    endEnd: number,
    cover: string
) {
    await db.update(episodeTable)
        .set({
            name,
            number,
            opStart,
            opEnd,
            endStart,
            endEnd,
            cover
        })
        .where(eq(episodeTable.episodeId, episodeId));
}


// Функція для видалення серії
export async function deleteEpisode(episodeId: number) {
    // Видалення зв’язків між епізодом і аніме
    await db.delete(animeEpisodeTable)
        .where(eq(animeEpisodeTable.episodeId, episodeId));

    // Видалення самого епізоду
    await db.delete(episodeTable)
        .where(eq(episodeTable.episodeId, episodeId));
}





// Функція для отримання всіх персонажів
export async function getAllCharacters() {
    return db.select({
        name: characterTable.name,
        animeId: characterTable.animeId,
        image: characterTable.image,
        popularityId: characterTable.popularityId,
        characterId: characterTable.characterId,
        voiceActorId: characterTable.voiceActorId,

        popularityName: popularityTable.popularity,
        voiceActroName: userTable.nickname,
        animeName: animeTable.nameUkr,

    }).from(characterTable)
        .leftJoin(memberTable, eq(memberTable.memberId, characterTable.voiceActorId))
        .leftJoin(userTable, eq(memberTable.userId, userTable.userId))
        .leftJoin(popularityTable, eq(popularityTable.popularityId, characterTable.popularityId))
        .leftJoin(animeTable, eq(animeTable.animeId, characterTable.animeId));
}

// Функція для додавання нового персонажа
export async function addCharacter(
    animeId: number,
    popularityId: number,
    voiceActorId: number,
    name: string,
    image: string,
) {
    return db.insert(characterTable).values({
        voiceActorId: voiceActorId,
        animeId: animeId,
        popularityId: popularityId,
        name: name,
        image: image,
    }).returning({id: characterTable.characterId});
}

// Функція для оновлення персонажа за його ID
export async function updateCharacter(
    characterId: number,
    animeId: number,
    popularityId: number,
    voiceActorId: number,
    newName: string,
    newImage?: string
) {
    return db.update(characterTable)
        .set({
            name: newName,
            image: newImage,
            animeId: animeId,
            popularityId: popularityId,
            voiceActorId: voiceActorId
        })
        .where(eq(characterTable.characterId, characterId)).returning({ id: characterTable.characterId });
}

// Функція для видалення персонажа за його ID
export async function deleteCharacter(characterId: number) {
    return db.delete(characterTable).where(eq(characterTable.characterId, characterId));
}


export async function getAllAnimeRelateds(animeId: number) {
    return db.select().from(animeGenreTable)
        .where(eq(animeGenreTable.animeId, animeId))
        .leftJoin(animeTranslateTable, eq(animeTranslateTable.animeId, animeId))
        .leftJoin(animeEditingTable, eq(animeEditingTable.animeId, animeId))
        .leftJoin(animeSoundTable, eq(animeSoundTable.animeId, animeId))
        .leftJoin(animeVideoEditingTable, eq(animeVideoEditingTable.animeId, animeId))
        .leftJoin(animeVoiceActorsTable, eq(animeVoiceActorsTable.animeId, animeId))
        .leftJoin(animeVocalsTable, eq(animeVocalsTable.animeId, animeId))
        .leftJoin(animeDubDirectorTable, eq(animeDubDirectorTable.animeId, animeId));
}

export async function saveAssociationsToDatabase({
                                                     animeId,
                                                     genres,
                                                     translators,
                                                     editors,
                                                     soundDesigners,
                                                     visualArtists,
                                                     dubDirectors,
                                                     vocals,
                                                     voiceActors
                                                 }: {
    animeId: number;
    genres: number[];
    translators: number[];
    editors: number[];
    soundDesigners: number[];
    visualArtists: number[];
    dubDirectors: number[];
    vocals: number[];
    voiceActors: number[];
}) {
    // Функція для отримання поточних записів
    const getCurrentRecords = async (table: SQLiteTable, conditions: SQL<unknown>[]) => {
        return await db.select().from(table).where(and(...conditions)).execute();
    };

    // Функція для синхронізації зв'язків
    const syncAssociations = async (
        table: SQLiteTable,
        newIds: number[],
        getConditions: (id: number) => SQL<unknown>[],
        getBaseConditions: () => SQL<unknown>[],
        data: (id: number) => Record<string, unknown>
    ) => {
        // Отримуємо поточні зв'язки
        const currentRecords = await getCurrentRecords(table, getBaseConditions());
        const currentIds = currentRecords.map(record =>
            record.memberId || record.genreId
        );

        // Знаходимо ID для видалення і додавання
        const idsToDelete = currentIds.filter(id => !newIds.includes(id));
        const idsToAdd = newIds.filter(id => !currentIds.includes(id));

        // Виконуємо видалення
        for (const id of idsToDelete) {
            await db.delete(table)
                .where(and(...getConditions(id)))
                .execute();
        }

        // Виконуємо додавання
        for (const id of idsToAdd) {
            await db.insert(table)
                .values(data(id))
                .execute();
        }
    };

    try {
        await Promise.all([
            // Жанри
            syncAssociations(
                animeGenreTable,
                genres,
                (genreId) => [eq(animeGenreTable.animeId, animeId), eq(animeGenreTable.genreId, genreId)],
                () => [eq(animeGenreTable.animeId, animeId)],
                (genreId) => ({ animeId, genreId })
            ),

            // Перекладачі
            syncAssociations(
                animeTranslateTable,
                translators,
                (memberId) => [eq(animeTranslateTable.animeId, animeId), eq(animeTranslateTable.memberId, memberId)],
                () => [eq(animeTranslateTable.animeId, animeId)],
                (memberId) => ({ animeId, memberId })
            ),

            // Редактори
            syncAssociations(
                animeEditingTable,
                editors,
                (memberId) => [eq(animeEditingTable.animeId, animeId), eq(animeEditingTable.memberId, memberId)],
                () => [eq(animeEditingTable.animeId, animeId)],
                (memberId) => ({ animeId, memberId })
            ),

            // Звукорежисери
            syncAssociations(
                animeSoundTable,
                soundDesigners,
                (memberId) => [eq(animeSoundTable.animeId, animeId), eq(animeSoundTable.memberId, memberId)],
                () => [eq(animeSoundTable.animeId, animeId)],
                (memberId) => ({ animeId, memberId })
            ),

            // Візуальні дизайнери
            syncAssociations(
                animeVideoEditingTable,
                visualArtists,
                (memberId) => [eq(animeVideoEditingTable.animeId, animeId), eq(animeVideoEditingTable.memberId, memberId)],
                () => [eq(animeVideoEditingTable.animeId, animeId)],
                (memberId) => ({ animeId, memberId })
            ),

            // Режисери дубляжу
            syncAssociations(
                animeDubDirectorTable,
                dubDirectors,
                (memberId) => [eq(animeDubDirectorTable.animeId, animeId), eq(animeDubDirectorTable.memberId, memberId)],
                () => [eq(animeDubDirectorTable.animeId, animeId)],
                (memberId) => ({ animeId, memberId })
            ),

            // Вокалісти
            syncAssociations(
                animeVocalsTable,
                vocals,
                (memberId) => [eq(animeVocalsTable.animeId, animeId), eq(animeVocalsTable.memberId, memberId)],
                () => [eq(animeVocalsTable.animeId, animeId)],
                (memberId) => ({ animeId, memberId })
            ),

            // Актори озвучки
            syncAssociations(
                animeVoiceActorsTable,
                voiceActors,
                (memberId) => [eq(animeVoiceActorsTable.animeId, animeId), eq(animeVoiceActorsTable.memberId, memberId)],
                () => [eq(animeVoiceActorsTable.animeId, animeId)],
                (memberId) => ({ animeId, memberId })
            )
        ]);

        // console.log("Усі зв'язки збережено успішно");
    } catch (error) {
        // console.error("Помилка при збереженні зв'язків:", error);
        throw error;
    }
}


export async function getAllAnimeData() {
    const [animes, types, statuses, sources, ages, studios, directors] = await Promise.all([
        db.select({
            animeId: animeTable.animeId,
            typeId: animeTable.typeId,
            statusId: animeTable.statusId,
            statusText: animeStatusTable.statusName,
            sourceId: animeTable.sourceId,
            ageId: animeTable.ageId,
            studioId: animeTable.studioId,
            directorId: animeTable.directorId,
            nameUkr: animeTable.nameUkr,
            nameJap: animeTable.nameJap,
            nameEng: animeTable.nameEng,
            episodesExpected: animeTable.episodesExpected,
            rating: animeTable.rating,
            releaseDate: animeTable.releaseDate,
            description: animeTable.description,
            trailerLink: animeTable.trailerLink,
            headerImage: animeTable.headerImage,

        }).from(animeTable).leftJoin(animeStatusTable, eq(animeTable.statusId, animeStatusTable.statusId)),

        db.select({
            id: animeTypeTable.typeId,
            name: animeTypeTable.typeName,
        }).from(animeTypeTable),

        db.select({
            id: animeStatusTable.statusId,
            name: animeStatusTable.statusName,
        }).from(animeStatusTable),

        db.select({
            id: animeSourceTable.sourceId,
            name: animeSourceTable.sourceName,
        }).from(animeSourceTable),

        db.select({
            id: animeAgeTable.ageId,
            name: animeAgeTable.ageName,
        }).from(animeAgeTable),

        db.select({
            id: animeStudioTable.studioId,
            name: animeStudioTable.studioName,
        }).from(animeStudioTable),

        db.select({
            id: directorTable.directorId,
            name: directorTable.directorName,
        }).from(directorTable)
    ]);

    return {
        animes,
        types,
        statuses,
        sources,
        ages,
        studios,
        directors
    };
}