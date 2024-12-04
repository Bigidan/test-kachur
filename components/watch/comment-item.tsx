import React, { useCallback } from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ChevronDown, User} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {CommentsType} from "@/components/types/anime-types";
import {Spoiler} from "@/components/watch/spoiler-text";
import {deleteComment} from "@/lib/db/userDB";
import {toast} from "sonner";
import {cn} from "@/lib/utils";

export const parseCommentWithSpoilers = (text: string) => {
    // const spoilerRegex = /\[spoiler\]([\s\S]*?)\[\/spoiler\]/g;
    const spoilerRegex = /\[spoiler]([\s\S]*?)\[\/spoiler]/g;
    const parts: (string | React.ReactElement)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = spoilerRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        parts.push(
            <Spoiler key={match.index}>
                {match[1].trim()}
            </Spoiler>
        );

        lastIndex = spoilerRegex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
};

interface CommentItemProps {
    comment: CommentsType;
    isReply?: boolean;
    onShowReplies?: () => void;
    isRepliesExpanded?: boolean;
    repliesCount?: number;
    isDeletable: boolean;
    onReply: () => void;
    onDelete: () => void;
}

export const CommentItem: React.FC<CommentItemProps> = React.memo(
    ({
         comment,
         isReply = false,
         onShowReplies,
         isRepliesExpanded = false,
         repliesCount = 0,
         isDeletable,
         onReply,
         onDelete,
     }) => {
        const handleDelete = useCallback(async () => {
            try {
                const result = await deleteComment(comment.comment.commentId);
                toast(result.message, {
                    description: "Коментар було видалено!",
                    action: {
                        label: "Гаразд",
                        onClick: () => console.clear(),
                    },
                });
                onDelete();
            } catch (error) {
                const errorMessage = error instanceof Error
                    ? error.message
                    : typeof error === 'string'
                        ? error
                        : 'Сталася невідома помилка';

                toast(errorMessage, {
                    description: "Коментар не було видалено!",
                    action: {
                        label: "Гаразд",
                        onClick: () => console.clear(),
                    },
                });
            }
        }, [comment.comment.commentId, onDelete]);

        return (
            <div
                className={cn(
                    'relative flex flex-row items-center justify-center p-3 px-6 gap-2 rounded-lg',
                    comment.comment.isDeleted ? 'bg-gray-400' : 'bg-gradient-to-r from-[#C40000] to-[#5E0000]',
                    isReply && '-mt-1 -mr-6 ml-6 z-10 shadow-[-5px_-5px_4px_0px_rgba(0,0,0,0.3)] from-[#9E0000] to-[#5E0000]'
                )}>
                <Avatar className="w-[60px] h-[60px] border-2 border-white rounded-full self-start my-5">
                    <AvatarImage
                        src={comment.user?.image || ""}
                        alt={`Avatar of ${comment.user?.nickname || 'Guest'}`}
                    />
                    <AvatarFallback><User/></AvatarFallback>
                </Avatar>

                <div className="w-full flex flex-col items-start justify-start py-5 ml-4">
                    <h2 className="text-xl flex justify-center items-center font-bold">
                        {comment.user?.nickname || "Гість"}
                        {comment.user?.roleDescription && (
                            <Badge className="ml-2">{comment.user.roleDescription}</Badge>
                        )}
                    </h2>

                    <div
                        className="whitespace-pre-wrap text-pretty font-semibold text-sm mt-2"
                        style={{overflowWrap: "anywhere"}}
                    >
                        {parseCommentWithSpoilers(comment.comment.comment)}
                    </div>
                </div>

                <div className="flex flex-col justify-between self-stretch">
                    <div className="self-end text-sm pt-2 text-nowrap">
                        <p>{comment.comment.updateDate.toLocaleString()}</p>
                    </div>

                    <div className="self-end flex flex-row items-end justify-end">
                        {repliesCount > 0 && (
                            <Button
                                variant="link"
                                className="pr-0 flex items-center"
                                onClick={onShowReplies}
                            >
                                {isRepliesExpanded
                                    ? 'Сховати відповіді'
                                    : `Показати відповіді (${repliesCount})`
                                }
                                <ChevronDown className="ml-1" size={16}/>
                            </Button>
                        )}

                        {!comment.comment.isDeleted && (
                            <Button variant="link" className="pr-0" onClick={onReply}>
                                Відповісти
                            </Button>
                        )}
                        {isDeletable && (
                            <Button
                                variant="link"
                                className="pr-0"
                                onClick={handleDelete}
                            >
                                Видалити
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    });

CommentItem.displayName = 'CommentItem';