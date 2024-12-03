// components/watch/comments-section.tsx
"use client"

import React, { useRef } from 'react';
import HeadTitle from "@/components/main/head-title";
import CommentInput from "@/components/watch/comment-input";
import CommentsContent, { CommentsContentRef } from "@/components/watch/comments-content";
import { User as UserType } from "@/components/types/user";

interface CommentsSectionProps {
    user: UserType | null;
    animeId: number;
}

export default function CommentsSection({ user, animeId }: CommentsSectionProps) {
    const commentsRef = useRef<CommentsContentRef>(null);

    return (
        <div className="hero mt-24">
            <HeadTitle highlight="Коментарі" className="text-3xl" />

            <CommentInput
                user={user}
                animeId={animeId}
                onCommentAdded={(newComment) => {
                    commentsRef.current?.addNewComment(newComment);
                }}
            />

            <CommentsContent
                ref={commentsRef}
                animeId={animeId}
            />
        </div>
    );
}