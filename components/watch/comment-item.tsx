import React from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ChevronDown, User} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {CommentsType} from "@/components/types/anime-types";
import {Spoiler} from "@/components/watch/spoiler-text";

const parseCommentWithSpoilers = (text: string) => {
    const parts = text.split(/(\[spoiler\].*?\[\/spoiler\])/g);

    return parts.map((part, index) => {
        if (part.startsWith('[spoiler]') && part.endsWith('[/spoiler]')) {
            return (
                <Spoiler key={index}>
                    {part.replace(/\[spoiler\]|\[\/spoiler\]/g, '')}
                </Spoiler>
            );
        }
        return part;
    });
};

interface CommentItemProps {
    comment: CommentsType;
    isReply?: boolean;
    onShowReplies?: () => void;
    isRepliesExpanded?: boolean;
    repliesCount?: number;
}

export const CommentItem: React.FC<CommentItemProps> =
({
     comment,
     isReply = false,
     onShowReplies,
     isRepliesExpanded = false,
     repliesCount = 0
}) =>
{
    return (
        <div
            className={`
                    relative flex flex-row items-center justify-center 
                    bg-gradient-to-r from-[#C40000] to-[#5E0000] 
                    p-3 px-6 gap-2 rounded-lg
                    ${isReply ? '-mt-1 -mr-6 ml-6 z-10 shadow-[-5px_-5px_4px_0px_rgba(0,0,0,0.3)] from-[#9E0000] to-[#5E0000]' : ''}
                `}>
            <Avatar className="w-[60px] h-[60px] border-2 border-white rounded-full self-start my-5 ">
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

                <div
                    className="whitespace-pre-wrap text-pretty font-semibold text-sm mt-2"
                    style={{overflowWrap: "anywhere"}}
                >
                    {parseCommentWithSpoilers(comment.comment.comment)}
                </div>
            </div>

            <div className="flex flex-col justify-between self-stretch">
                <div className="self-end text-sm pt-2">
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
                    <Button variant="link" className="pr-0">Відповісти</Button>
                    <Button variant="link" className="pr-0">Видалити</Button>
                </div>
            </div>
        </div>
    );
};