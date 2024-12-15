"use client";

import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {CommentsType} from "@/components/types/anime-types";
import {CommentItem} from "@/components/watch/comment-item";
import {Loader} from "lucide-react";
import {User} from "@/components/types/user";
import CommentInput from "@/components/watch/comment-input";
import {toast} from "sonner";
import {Switch} from "@/components/ui/switch";
import {getComments, getNestedComments} from "@/lib/db/userDB";
import Image from "next/image";

interface CommentsContentProps {
    animeId: number;
    user: User | null;
}

export interface CommentsContentRef {
    addNewComment: (comment: CommentsType) => void;
}

const INITIAL_COMMENTS_LIMIT = 9;
const NESTED_COMMENTS_LIMIT = 10;

const CommentsContent = forwardRef<CommentsContentRef, CommentsContentProps>(({ animeId, user }, ref) => {
    const [comments, setComments] = useState<CommentsType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [showDeletedComments, setShowDeletedComments] = useState<boolean>(false); // Стан для перемикання видалених коментарів

    const loadMoreRef = useRef<HTMLDivElement>(null);

    const fetchInitialComments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getComments(
                animeId,
                INITIAL_COMMENTS_LIMIT,
                0,
                user?.roleId === 3
            );
            setComments(response);
            setHasMoreComments(response.length === INITIAL_COMMENTS_LIMIT);
        } catch (error) {
            toast.error('Не вдалося завантажити коментарі', {
                description: error instanceof Error ? error.message : String(error)
            });
        } finally {
            setLoading(false);
        }
    }, [animeId, user?.roleId]);

    useEffect(() => {
        fetchInitialComments();
    }, [fetchInitialComments]);

    const loadMoreComments = useCallback(async () => {
        const nextPage = page + 1;
        const response = await getComments(
            animeId,
            INITIAL_COMMENTS_LIMIT,
            (nextPage - 1) * INITIAL_COMMENTS_LIMIT,
            user?.roleId == 3
        );

        if (response.length > 0) {
            setComments(prev => [...prev, ...response]);
            setPage(nextPage);
            setHasMoreComments(response.length === INITIAL_COMMENTS_LIMIT);
        } else {
            setHasMoreComments(false);
        }
    }, [animeId, page, user?.roleId]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && hasMoreComments && !loading) {
                    loadMoreComments();
                }
            },
            { threshold: 1.0 }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [hasMoreComments, loadMoreComments, loading]);

    useImperativeHandle(ref, () => ({
        addNewComment: (newComment: CommentsType) => {
            setComments(prevComments => [newComment, ...prevComments]);
        },
    }));

    const deleteCommentById = (commentId: number) => {
        setComments((prevComments) =>
            prevComments.map((comment) =>
                comment.comment.commentId === commentId
                    ? { ...comment, comment: { ...comment.comment, isDeleted: true } }
                    : comment
            )
        );
    };

    const toggleNestedComments = async (commentId: number) => {
        const newExpandedComments = new Set(expandedComments);

        const findAndToggleComments = async (commentsArray: CommentsType[]): Promise<CommentsType[]> => {
            return await Promise.all(commentsArray.map(async (comment) => {
                if (comment.comment.commentId === commentId) {
                    if (newExpandedComments.has(commentId)) {
                        newExpandedComments.delete(commentId);
                        const { nestedComments: _, ...rest } = comment;
                        return rest;
                    } else {
                        const nestedComments = await getNestedComments(
                            commentId,
                            NESTED_COMMENTS_LIMIT,
                            user?.roleId == 3
                        );
                        newExpandedComments.add(commentId);
                        return { ...comment, nestedComments };
                    }
                }

                if (comment.nestedComments) {
                    return {
                        ...comment,
                        nestedComments: await findAndToggleComments(comment.nestedComments)
                    };
                }

                return comment;
            }));
        };

        const updatedComments = await findAndToggleComments(comments);

        setComments(updatedComments);
        setExpandedComments(newExpandedComments);
    };

    const addNewCommentToTree = (newComment: CommentsType, parentId: number | null = null) => {
        setComments(prevComments => {
            if (!parentId) {
                return [newComment, ...prevComments];
            }

            const addNestedComment = (comments: CommentsType[]): CommentsType[] => {
                return comments.map(comment => {
                    if (comment.comment.commentId === parentId) {
                        return {
                            ...comment,
                            nestedComments: comment.nestedComments
                                ? [newComment, ...comment.nestedComments]
                                : [newComment],
                        };
                    }

                    if (comment.nestedComments) {
                        return {
                            ...comment,
                            nestedComments: addNestedComment(comment.nestedComments),
                        };
                    }

                    return comment;
                });
            };

            return addNestedComment(prevComments);
        });
    };

    const renderCommentTree = (comments: CommentsType[], depth: number = 0) => {
        return comments
            .filter(comment => showDeletedComments || !comment.comment.isDeleted) // Фільтруємо видалені коментарі
            .map(comment => (
                <div key={comment.comment.commentId} className={`mb-2 ${depth > 0 ? 'mb-3 pl-10' : ''}`}>
                    <CommentItem
                        comment={comment}
                        onShowReplies={comment.comment.commentId ? () => toggleNestedComments(comment.comment.commentId) : undefined}
                        isRepliesExpanded={comment.comment.commentId ? expandedComments.has(comment.comment.commentId) : false}
                        repliesCount={comment.repliesCount || 0}
                        isReply={depth > 0}
                        isDeletable={(user?.userId == comment.user?.userId || user?.roleId == 3) && !comment.comment.isDeleted}
                        onReply={() => setReplyingTo(comment.comment.commentId)}
                        onDelete={() => deleteCommentById(comment.comment.commentId)}
                    />
                    {replyingTo === comment.comment.commentId && (
                        <CommentInput
                            user={user}
                            animeId={animeId}
                            parentId={comment.comment.commentId}
                            onCommentAdded={newComment => {
                                addNewCommentToTree(newComment, comment.comment.commentId);
                                setReplyingTo(null);
                            }}
                            onCancel={() => setReplyingTo(null)}
                        />
                    )}
                    {comment.nestedComments && comment.nestedComments.length > 0 && (
                        <div className="pl-5 answerComm">
                            {renderCommentTree(comment.nestedComments, depth + 1)}
                        </div>
                    )}
                </div>
            ));
    };

    if (loading) {
        return <div className="w-full flex justify-center m-10"><Loader className="animate-spin" style={{ width: "60px", height: "60px" }}/></div>;
    }

    return (
        <div className="mt-6 space-y-4">
            {user?.roleId === 3 && ( // Чекбокс тільки для адміністратора
                <div className="flex items-center mb-4">
                    <Switch
                        id="showDeletedComments"
                        checked={showDeletedComments}
                        onCheckedChange={() => setShowDeletedComments(prev => !prev)}
                        className="mr-2 min-h-6"
                    />
                    <label htmlFor="showDeletedComments" className="text-sm text-gray-700">Показувати видалені коментарі</label>
                </div>
            )}
            {comments.length > 0 ? (
                <>
                    {renderCommentTree(comments)}

                    <div
                        ref={loadMoreRef}
                        className="w-full flex justify-center mt-4"
                    >
                        {hasMoreComments ? (
                            <Loader className="animate-spin" style={{ width: "40px", height: "40px" }} />
                        ) : (
                            <p className="text-center text-gray-500 mt-4">Це всі коментарі.</p>
                        )}
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500 mt-4"><Image src="/no_comments.webp" alt="Ще ніхто не крякнув." width={500} height={500} className="mx-auto"/></p>
            )}
        </div>
    );
});

CommentsContent.displayName = 'CommentsContent';

export default CommentsContent;
