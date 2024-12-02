"use client"

import React, { useState } from 'react';
import { User as UserType } from "@/components/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentTextarea } from "@/components/ui/commnet-textarea";
import { sendComment } from "@/lib/db/userDB";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CommentInputProps {
    user: UserType | null;
    animeId: number;
}

const CommentInput: React.FC<CommentInputProps> = ({ user, animeId }) => {
    const [commentText, setCommentText] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorDialogText, setErrorDialogText] = useState("");
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

    const handleSubmitComment = async () => {
        // Перевірка на порожній коментар
        if (!commentText.trim()) {
            setErrorDialogText("Коментар не може бути порожнім.");
            setIsErrorDialogOpen(true);
            return;
        }

        setIsSubmitting(true);

        try {
            // Підготовка об'єкта коментаря
            const newComment = {
                    animeId: animeId,
                    userId: user?.userId || null,
                    parentCommentId: null,
                    comment: commentText,
                    updateDate: new Date(),
            };

            // Виклик функції надсилання коментаря
            await sendComment(newComment);

            // Очищення поля вводу після успішного надсилання
            setCommentText('');

        } catch (error) {
            console.error('Помилка при додаванні коментаря:', error);
            setErrorDialogText('Помилка під час додавання коментаря: ' + error);
            setIsErrorDialogOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full flex flex-row items-center justify-center bg-[#676767] p-7 gap-2 rounded-lg">
            {user ? (
                <Avatar className="w-[69px] h-[69px] border-2 border-white rounded-full">
                    <AvatarImage src={user.image || ""}></AvatarImage>
                    <AvatarFallback><User/></AvatarFallback>
                </Avatar>
            ) : (
                <Avatar className="w-[60px] h-[60px] border-2 border-white rounded-full">
                    <AvatarFallback><User/></AvatarFallback>
                </Avatar>
            )}

            <div className="w-full flex flex-col items-start justify-start gap-2">
                {user ? (
                    <h2 className="text-xl">{user.nickname}</h2>
                ) : (
                    <h2 className="text-xl">Гість</h2>
                )}

                <CommentTextarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="focus:ring-0 focus-within:ring-0 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent border-b-2 border-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Додайте коментар..."
                />
            </div>

            <Button
                onClick={handleSubmitComment}
                disabled={isSubmitting}
                className="self-end"
            >
                {isSubmitting ? 'Надсилання...' : 'Коментувати'}
            </Button>

            <AlertDialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{errorDialogText}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setIsErrorDialogOpen(false)}>
                            Зрозуміло
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default CommentInput;