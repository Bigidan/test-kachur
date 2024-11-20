import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const directorTable = sqliteTable('director', {
    directorId: integer('director_id').primaryKey(),
    directorName: text('director_name').notNull(),
});

export const animeTypeTable = sqliteTable('anime_type', {
    typeId: integer('type_id').primaryKey(),
    typeName: text('type_name').notNull(),
});

export const animeStatusTable = sqliteTable('anime_status', {
    statusId: integer('status_id').primaryKey(),
    statusName: text('status_name').notNull(),
});

export const animeSourceTable = sqliteTable('anime_source', {
    sourceId: integer('source_id').primaryKey(),
    sourceName: text('source_name').notNull(),
});

export const animeAgeTable = sqliteTable('anime_age', {
    ageId: integer('age_id').primaryKey(),
    ageName: text('age_name').notNull(),
});

export const animeStudioTable = sqliteTable('anime_studio', {
    studioId: integer('studio_id').primaryKey(),
    studioName: text('studio_name').notNull(),
});

export const animeTable = sqliteTable('anime', {
    animeId: integer('anime_id').primaryKey(),
    directorId: integer('director_id', { mode: 'number' }).references(() => directorTable.directorId),
    statusId: integer('status_id', { mode: 'number' }).references(() => animeStatusTable.statusId),
    typeId: integer('type_id', { mode: 'number' }).references(() => animeTypeTable.typeId),
    sourceId: integer('source_id', { mode: 'number' }).references(() => animeSourceTable.sourceId),
    ageId: integer('age_id', { mode: 'number' }).references(() => animeAgeTable.ageId),
    studioId: integer('studio_id', { mode: 'number' }).references(() => animeStudioTable.studioId),
    nameUkr: text('name_ukr').notNull(),
    nameJap: text('name_jap').notNull(),
    nameEng: text('name_eng').notNull(),
    episodesExpected: integer('episodes_expected', { mode: 'number' }),
    rating: text('rating'),
    releaseDate: integer('release_date', { mode: 'timestamp' }),
    description: text('description'),
    trailerLink: text('trailer_link'),
    headerImage: text('header_image'),
    shortDescription: text('short_description'),
});

export const genreTable = sqliteTable('genre', {
    genreId: integer('genre_id').primaryKey(),
    genreName: text('genre_name').notNull(),
});

export const animeGenreTable = sqliteTable('anime_genre', {
    animeId: integer('anime_id', { mode: 'number' }).references(() => animeTable.animeId),
    genreId: integer('genre_id', { mode: 'number' }).references(() => genreTable.genreId),
});

export const roleTable = sqliteTable('role', {
    roleId: integer('role_id').primaryKey(),
    description: text('description').notNull(),
});

export const userTable = sqliteTable('user', {
    userId: integer('user_id').primaryKey(),
    roleId: integer('role_id', { mode: 'number' }).references(() => roleTable.roleId),
    nickname: text('nickname').notNull(),
    name: text('name').notNull(),
    autoSkip: integer('auto_skip', { mode: 'boolean' }).notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
    image: text('image'),
});

export const memberTable = sqliteTable('member', {
    memberId: integer('member_id').primaryKey(),
    userId: integer('user_id', { mode: 'number' }).references(() => userTable.userId),
});

export const animeTranslateTable = sqliteTable('anime_translate', {
    animeId: integer('anime_id', { mode: 'number' }).references(() => animeTable.animeId),
    memberId: integer('member_id', { mode: 'number' }).references(() => memberTable.memberId),
});

export const popularityTable = sqliteTable('popularity', {
    popularityId: integer('popularity_id').primaryKey(),
    popularity: text('popularity').notNull(),
});

export const characterTable = sqliteTable('character', {
    characterId: integer('character_id').primaryKey(),
    voiceActorId: integer('voice_actor_id', { mode: 'number' }).references(() => memberTable.memberId),
    animeId: integer('anime_id', { mode: 'number' }).references(() => animeTable.animeId),
    popularityId: integer('popularity_id', { mode: 'number' }).references(() => popularityTable.popularityId),
    name: text('name').notNull(),
    image: text('image'),
});

export const animeEditingTable = sqliteTable('anime_editing', {
    animeId: integer('anime_id', { mode: 'number' }).references(() => animeTable.animeId),
    memberId: integer('member_id', { mode: 'number' }).references(() => memberTable.memberId),
});

export const episodeTable = sqliteTable('episode', {
    episodeId: integer('episode_id').primaryKey(),
    name: text('name').notNull(),
    number: integer('number').notNull(),
    opStart: integer('op_start', { mode: 'number' }),
    opEnd: integer('op_end', { mode: 'number' }),
    endStart: integer('end_start', { mode: 'number' }),
    endEnd: integer('end_end', { mode: 'number' }),
    cover: text('cover'),
});

export const animeEpisodeTable = sqliteTable('anime_episode', {
    animeId: integer('anime_id', { mode: 'number' }).references(() => animeTable.animeId),
    episodeId: integer('episode_id', { mode: 'number' }).references(() => episodeTable.episodeId),
});

export const animeSoundTable = sqliteTable('anime_sound', {
    animeId: integer('anime_id', { mode: 'number' }).references(() => animeTable.animeId),
    memberId: integer('member_id', { mode: 'number' }).references(() => memberTable.memberId),
});

export const animeVideoEditingTable = sqliteTable('anime_video_editing', {
    animeId: integer('anime_id', { mode: 'number' }).references(() => animeTable.animeId),
    memberId: integer('member_id', { mode: 'number' }).references(() => memberTable.memberId),
});

export const animeVoiceActorsTable = sqliteTable('anime_voice_actors', {
    animeId: integer('anime_id', { mode: 'number' }).references(() => animeTable.animeId),
    memberId: integer('member_id', { mode: 'number' }).references(() => memberTable.memberId),
});

export const animeVocalsTable = sqliteTable('anime_vocals', {
    animeId: integer('anime_id', { mode: 'number' }).references(() => animeTable.animeId),
    memberId: integer('member_id', { mode: 'number' }).references(() => memberTable.memberId),
});

export const animeDubDirectorTable = sqliteTable('anime_dub_director', {
    animeId: integer('anime_id', { mode: 'number' }).references(() => animeTable.animeId),
    memberId: integer('member_id', { mode: 'number' }).references(() => memberTable.memberId),
});
