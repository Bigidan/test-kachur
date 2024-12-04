"use client"

import React, { useState, useRef } from 'react';
import { User as UserType } from "@/components/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentTextarea } from "@/components/ui/commnet-textarea";
import { sendComment } from "@/lib/db/userDB";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {CommentsType} from "@/components/types/anime-types";

interface CommentInputProps {
    user: UserType | null;
    animeId: number;
    onCommentAdded: (comment: CommentsType) => void;
    parentId?: number | null;
    onCancel?: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ user, animeId, onCommentAdded, parentId = null, onCancel }) => {
    const [commentText, setCommentText] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorDialogText, setErrorDialogText] = useState("");
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
    const [selectedText, setSelectedText] = useState<string>('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleTextSelection = () => {
        if (textareaRef.current) {
            const start = textareaRef.current.selectionStart;
            const end = textareaRef.current.selectionEnd;
            const selected = commentText.substring(start, end);
            setSelectedText(selected);
        }
    };

    const addSpoilerTag = () => {
        if (textareaRef.current) {
            const start = textareaRef.current.selectionStart;
            const end = textareaRef.current.selectionEnd;

            const newText =
                commentText.slice(0, start) +
                `[spoiler]${selectedText}[/spoiler]` +
                commentText.slice(end);

            setCommentText(newText);
            setSelectedText('');
        }
    };

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
                parentCommentId: parentId || null,
                comment: commentText,
                updateDate: new Date(),
            };

            // Виклик функції надсилання коментаря
            const newCommentData = await sendComment(newComment);

            onCommentAdded(newCommentData);

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

    const handleCancel = async () => {
        setErrorDialogText("Ви точно хочете скасувати?");
        setIsErrorDialogOpen(true);
    }

    return (
        <div className="w-full flex flex-row items-center justify-center bg-[#676767] p-7 gap-2 rounded-lg relative">

                {user ? (
                    <Avatar className="w-[60px] h-[60px] border-2 border-white rounded-full self-start ">
                        <AvatarImage src={user.image || ""}></AvatarImage>
                        <AvatarFallback><User/></AvatarFallback>
                    </Avatar>
                ) : (
                    <Avatar className="w-[60px] h-[60px] border-2 border-white rounded-full self-start ">
                        <AvatarFallback><User/></AvatarFallback>
                    </Avatar>
                )}



            <div className="w-full flex flex-col items-start justify-start pl-2">
                <div className="w-full flex justify-between items-center">
                    {user ? (
                        <h2 className="text-xl">{user.nickname}</h2>
                    ) : (
                        <h2 className="text-xl">Гість</h2>
                    )}
                    {selectedText && (
                        <Button
                            variant="ghost"
                            className="text-sm p-1 flex items-center gap-1 leading-tight h-auto"
                            onClick={addSpoilerTag}
                        >
                            <Tag size={10} /> Додати спойлер
                        </Button>
                    )}
                </div>
                <CommentTextarea
                    ref={textareaRef}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onSelect={handleTextSelection}
                    className="focus:ring-0 focus-within:ring-0 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent border-b-2 border-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Додайте коментар..."
                />
            </div>

            {parentId && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            className="self-end shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] font-semibold">
                    <span
                        className="text-transparent bg-clip-text bg-gradient-to-b from-[#C50000] to-[#380000]">
                        Скасувати
                    </span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Точно скасувати?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Назад</AlertDialogCancel>
                            <AlertDialogAction onClick={onCancel}>Так</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            <Button
                onClick={handleSubmitComment}
                disabled={isSubmitting}
                className="self-end shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] font-semibold"
            >
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#C50000] to-[#380000]">{isSubmitting ? 'Надсилання...' : 'Коментувати'}</span>
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