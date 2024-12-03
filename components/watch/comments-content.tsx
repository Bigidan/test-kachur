"use client"

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { getComments, getNestedComments } from "@/lib/db/userDB";
import { CommentsType } from "@/components/types/anime-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
            newExpandedComments.delete(commentId);
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.comment.commentId === commentId
                        ? { ...comment, nestedComments: undefined }
                        : comment
                )
            );
        } else {
            const nestedComments = await getNestedComments(commentId, NESTED_COMMENTS_LIMIT);

            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.comment.commentId === commentId
                        ? { ...comment, nestedComments }
                        : comment
                )
            );

            newExpandedComments.add(commentId);
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
                    isReply={depth > 0}
                />
                {comment.nestedComments && comment.nestedComments.length > 0 && (
                    renderCommentTree(comment.nestedComments, depth + 1)
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

interface CommentItemProps {
    comment: CommentsType;
    isReply?: boolean;
    onShowReplies?: () => void;
    isRepliesExpanded?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
                                                     comment,
                                                     isReply = false,
                                                     onShowReplies,
                                                     isRepliesExpanded = false
                                                 }) => {
    return (
        <div
            className={`
                relative flex flex-row items-center justify-center 
                bg-gradient-to-r from-[#C40000] to-[#5E0000] 
                p-3 px-6 gap-2 rounded-lg
                ${isReply ? '-mt-4 ml-6 z-10 shadow-[-5px_-5px_4px_0px_rgba(0,0,0,0.3)]' : ''}
            `}
        >
            <Avatar className="w-[60px] h-[60px] border-2 border-white rounded-full">
                <AvatarImage src={comment.user?.image || ""}></AvatarImage>
                <AvatarFallback><User/></AvatarFallback>
            </Avatar>

            <div className="w-full flex flex-col items-start justify-start py-5 ml-4">
                <h2 className="text-xl flex justify-center items-center font-bold">
                    {comment.user?.nickname || "Гість"}
                    {comment.user?.roleDescription ? (
                        <Badge className="ml-2">{comment.user?.roleDescription}</Badge>
                    ) : null}
                </h2>

                <p className="font-semibold text-sm mt-2">{comment.comment.comment}</p>
            </div>

            <div className="flex flex-col justify-between self-stretch">
                <div className="self-end text-sm pt-2">
                    <p>{comment.comment.updateDate.toLocaleString()}</p>
                </div>

                <div className="self-end flex flex-row items-end justify-end">
                    {onShowReplies && (
                        <Button
                            variant="link"
                            className="pr-0 flex items-center"
                            onClick={onShowReplies}
                        >
                            {isRepliesExpanded ? 'Сховати відповіді' : 'Показати відповіді'}
                            <ChevronDown className="ml-1" size={16} />
                        </Button>
                    )}
                    <Button variant="link" className="pr-0">Відповісти</Button>
                    <Button variant="link" className="pr-0">Видалити</Button>
                </div>
            </div>
        </div>
    );
};

CommentsContent.displayName = 'CommentsContent';

export default CommentsContent;