import { integer, sqliteTable, text, AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

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

export const animePopularityTable = sqliteTable('anime_popularity', {
    popularityId: integer('popularity_id').primaryKey(),
    popularity: text('popularity').notNull(),
    order: integer('order').default(0),
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
    animePopularityId: integer('anime_popularity_id', { mode: 'number' }).references(() => animePopularityTable.popularityId),
    ducks: integer('ducks', { mode: 'number' }),
    monobankRef: text('monobank_ref'),
    isHidden: integer('is_hidden', { mode: 'boolean' }),
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
    art: text('art'),
});

export const memberTable = sqliteTable('member', {
    memberId: integer('member_id').primaryKey(),
    userId: integer('user_id', { mode: 'number' }).references(() => userTable.userId),
    memberType: integer('member_type', { mode: 'number' }).default(0),
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
    quality: text('quality').notNull(),
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



export const animeCommentsTable = sqliteTable('anime_comments', {
    commentId: integer('comment_id').primaryKey(),
    animeId: integer('anime_id', { mode: 'number' }).references(() => animeTable.animeId),
    userId: integer('user_id', { mode: 'number' }).references(() => userTable.userId),
    parentCommentId: integer('parent_comment_id', { mode: 'number'}).references((): AnySQLiteColumn => animeCommentsTable.commentId),
    comment: text('comment').notNull(),
    updateDate: integer('release_date', { mode: 'timestamp' }).notNull(),
    isDeleted: integer('is_deleted', { mode: 'boolean' }).notNull(),
});

export const animeCommentsLikesTable = sqliteTable('anime_comments_likes', {
    likeId: integer('like_id').primaryKey(),
    commentId: integer('comment_id', { mode: 'number' }).references(() => animeCommentsTable.commentId),
    userId: integer('user_id', { mode: 'number' }).references(() => userTable.userId),
    isLike: integer('is_like', { mode: 'boolean' }).notNull(), // true для лайка, false для дизлайка
    likeDate: integer('like_date', { mode: 'timestamp' }).notNull()
});

export const filesTable = sqliteTable('files', {
    fileId: integer('file_id').primaryKey(),
    fileName: text('file_name'), //поле для пошуку
    fileUrl: text('file_url'), //поле для відображення файлу за посиланням
    fileType: integer("file_type"),

});



export const musicTable = sqliteTable('music', {
    musicId: integer('music_id').primaryKey(),
    musicName: text('music_name'),
    musicDescription: text('music_description'),
    musicImage: text('music_url'),
    musicUrl: text('music_url'),
});

export const kachurTeamTable = sqliteTable('kachur_team', {
    kachurId: integer('kachur_id').primaryKey(),
    memberId: integer('member_id', { mode: 'number' }).references(() => memberTable.memberId),
    positionId: integer('position_id'),
    type: integer('type'),
    tiktok: text('tiktok'),
    youtube: text('youtube'),
    telegram: text('telegram'),
    twitch: text('twitch'),
    instagram: text('instagram'),
    status: text('status'),
    date: text('date'),
    social: text('social'),
    pet: text('pet'),
    anime: text('anime'),
    films: text('films'),
    games: text('games'),
});

export const playlistTable = sqliteTable('playlists', {
    musicId: integer('music_id').references(() => musicTable.musicId),
    kachurId: integer('music_id').references(() => kachurTeamTable.kachurId),
});


export const animeFavorite = sqliteTable('anime_favorite', {
    animeId: integer('anime_id').references(() => animeTable.animeId),
    userId: integer('user_id').references(() => userTable.userId),
})

export const colorsTable = sqliteTable('colors', {
    colorId: integer('color_id').primaryKey(),
    colorName: text('color_name'),
    colorHex: text('color_hex'),
});

export const teamColorTable = sqliteTable('team_color', {
    kachurId: integer('kachur_id').references(() => kachurTeamTable.kachurId),
    colorId: integer('color_id').references(() => colorsTable.colorId),
});