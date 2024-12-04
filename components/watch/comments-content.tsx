"use client"

import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {getComments, getNestedComments} from "@/lib/db/userDB";
import {CommentsType} from "@/components/types/anime-types";
import {Button} from "@/components/ui/button";
import {CommentItem} from "@/components/watch/comment-item";

interface CommentsContentProps {
    animeId: number;
}

export interface CommentsContentRef {
    addNewComment: (comment: CommentsType) => void;
}

const INITIAL_COMMENTS_LIMIT = 9;
const NESTED_COMMENTS_LIMIT = 10;

const CommentsContent = forwardRef<CommentsContentRef, CommentsContentProps>(({ animeId }, ref) => {
    const [comments, setComments] = useState<CommentsType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchInitialComments = async () => {
            setLoading(true);
            const response = await getComments(animeId, INITIAL_COMMENTS_LIMIT, 0);
            setComments(response);
            setLoading(false);
            setHasMoreComments(response.length === INITIAL_COMMENTS_LIMIT);
        };

        fetchInitialComments();
    }, [animeId]);

    useImperativeHandle(ref, () => ({
        addNewComment: (newComment: CommentsType) => {
            setComments(prevComments => [newComment, ...prevComments]);
        }
    }));

    const loadMoreComments = async () => {
        const nextPage = page + 1;
        const response = await getComments(animeId, INITIAL_COMMENTS_LIMIT, (nextPage - 1) * INITIAL_COMMENTS_LIMIT);

        if (response.length > 0) {
            setComments(prev => [...prev, ...response]);
            setPage(nextPage);
            setHasMoreComments(response.length === INITIAL_COMMENTS_LIMIT);
        } else {
            setHasMoreComments(false);
        }
    };

    const toggleNestedComments = async (commentId: number) => {
        const newExpandedComments = new Set(expandedComments);

        if (newExpandedComments.has(commentId)) {
            // Якщо коментар вже розгорнутий - закриваємо
            newExpandedComments.delete(commentId);
            setComments(prevComments =>
                prevComments.map(comment => {
                    if (comment.comment.commentId === commentId) {
                        // Видаляємо вкладені коментарі
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { nestedComments: _, ...rest } = comment;
                        return rest;
                    }

                    // Рекурсивно обробляємо вкладені коментарі
                    if (comment.nestedComments) {
                        return {
                            ...comment,
                            nestedComments: comment.nestedComments.map(nestedComment => {
                                if (nestedComment.comment.commentId === commentId) {
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    const { nestedComments: _, ...rest } = nestedComment;
                                    return rest;
                                }
                                return nestedComment;
                            })
                        };
                    }

                    return comment;
                })
            );
        } else {
            // Завантажуємо вкладені коментарі
            const nestedComments = await getNestedComments(commentId, NESTED_COMMENTS_LIMIT);

            newExpandedComments.add(commentId);

            setComments(prevComments =>
                prevComments.map(comment => {
                    // Перевіряємо коментарі верхнього рівня
                    if (comment.comment.commentId === commentId) {
                        return { ...comment, nestedComments };
                    }

                    // Перевіряємо вкладені коментарі першого рівня
                    if (comment.nestedComments) {
                        return {
                            ...comment,
                            nestedComments: comment.nestedComments.map(nestedComment => {
                                if (nestedComment.comment.commentId === commentId) {
                                    return { ...nestedComment, nestedComments };
                                }
                                return nestedComment;
                            })
                        };
                    }

                    return comment;
                })
            );
        }

        setExpandedComments(newExpandedComments);
    };

    const renderCommentTree = (comments: CommentsType[], depth: number = 0) => {
        return comments.map(comment => (
            <div key={comment.comment.commentId} className={`mb-4 ${depth > 0 ? 'pl-10' : ''}`}>
                <CommentItem
                    comment={comment}
                    onShowReplies={comment.comment.commentId ? () => toggleNestedComments(comment.comment.commentId) : undefined}
                    isRepliesExpanded={comment.comment.commentId ? expandedComments.has(comment.comment.commentId) : false}
                    repliesCount={comment.repliesCount || 0}
                    isReply={depth > 0}
                />
                {comment.nestedComments && comment.nestedComments.length > 0 && (
                    <div className="pl-10">
                        {renderCommentTree(comment.nestedComments, depth + 1)}
                    </div>
                )}
            </div>
        ));
    };

    if (loading) {
        return <div>Loading comments...</div>;
    }

    return (
        <div className="mt-6 space-y-4">
            {comments.length > 0 ? (
                <>
                    {renderCommentTree(comments)}

                    {hasMoreComments && (
                        <div className="w-full flex justify-center mt-4">
                            <Button onClick={loadMoreComments} variant="outline">
                                Показати більше коментарів
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <p className="w-full text-center p-7">Ще ніхто не крякнув.</p>
            )}
        </div>
    );
});


CommentsContent.displayName = 'CommentsContent';

export default CommentsContent;