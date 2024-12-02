"use client"

import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const CommentTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

        // Об'єднуємо ref, переданий через props, з локальним ref
        React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

        const handleInput = () => {
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto"; // Скидаємо висоту
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight+2}px`; // Встановлюємо висоту відповідно до контенту
            }
        };

        React.useEffect(() => {
            if (textareaRef.current) {
                handleInput(); // Початкове налаштування висоти
            }
        }, []);

        return (
            <textarea
                className={cn(
                    "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none", // Відключаємо стандартний resize
                    className
                )}
                ref={textareaRef}
                onInput={handleInput}
                {...props}
            />
        );
    }
);
CommentTextarea.displayName = "CommentTextarea";

export { CommentTextarea };
