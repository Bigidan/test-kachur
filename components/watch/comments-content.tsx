"use client"

// components/CommentsContent.tsx
import React, { useEffect, useState } from 'react';
import {getComments} from "@/lib/db/userDB";
import {CommentsType} from "@/components/types/anime-types";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User} from "lucide-react";
import {Button} from "@/components/ui/button";


interface CommentsContentProps {
    animeId: number;
}

const CommentsContent: React.FC<CommentsContentProps> = ({ animeId }) => {
    const [comments, setComments] = useState<CommentsType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            const response = await getComments(animeId);
            setComments(response);
            setLoading(false);
        };

        fetchComments();
    }, [animeId]);

    if (loading) {
        return <div>Loading comments...</div>;
    }

    return (
        <div className="mt-2 space-x-4">
            {comments.length > 0 ? (
                <ul className="space-y-2 pl-5">
                    {comments.map((comment) => (
                        <li key={comment.comment.commentId} className="relative">
                            <CommentItem comment={comment}/>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="w-full text-center p-7">Ще ніхто не крякнув.</p>
            )}
        </div>
    );
};


const CommentItem: React.FC<{ comment: CommentsType }> = ({ comment }) => {
    return (
        <div className="w-full flex flex-row items-center justify-center bg-gradient-to-r from-[#C40000] to-[#5E0000] p-2 px-5 gap-2 rounded-lg">

            <Avatar className="w-[50px] h-[50px] border-2 border-white rounded-full">
                <AvatarImage src={comment.user?.image || ""}></AvatarImage>
                <AvatarFallback><User/></AvatarFallback>
            </Avatar>


            <div className="w-full flex flex-col items-start justify-start py-5">

                <h2 className="text-xl">{comment.user?.nickname || "Гість"}</h2>

                <p>{comment.comment.comment}</p>

            </div>

            <div className="self-end flex flex-col justify-between">

                <div>
                    <p>{comment.comment.updateDate.toLocaleString()}</p>
                </div>

                <div className="self-end flex flex-row items-end justify-end">
                    <Button variant="link">Видалити</Button>
                    <Button variant="link">Відповісти</Button>
                </div>

            </div>
        </div>
    );
};


export default CommentsContent;