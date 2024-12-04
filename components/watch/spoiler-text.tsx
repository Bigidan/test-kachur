import React, { useState } from 'react';
import { cn } from "@/lib/utils";

interface SpoilerProps {
    children: React.ReactNode;
    title?: string;
}

export const Spoiler: React.FC<SpoilerProps> = ({ children, title = "Спойлер" }) => {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <div className="relative mb-2 rounded-md">
            <div className="border border-red-900/50 rounded-md overflow-hidden p-2">
                <div
                    className={cn(
                        "absolute inset-0 z-10 bg-white rounded-md min-w-[74px]",
                        "flex items-center justify-center cursor-pointer",
                        "text-red-900 text-sm font-bold",
                        !isRevealed
                            ? "opacity-100 visible"
                            : "opacity-0 invisible"
                    )}
                    onClick={() => setIsRevealed(true)}
                >
                    {title}
                </div>
                <div
                    className={cn(
                        "transition-all duration-300 ease-in-out relative flex flex-col",
                        isRevealed
                            ? "opacity-100 h-auto"
                            : "opacity-0 h-auto overflow-hidden"
                    )}
                >
                    <div>
                    {children}
                    </div>

                </div>
            </div>
            {isRevealed && (
                <button
                    className="absolute top-0 left-[100%] z-20 bg-red-600/50 text-white rounded-full px-2 py-1 text-xs text-nowrap"
                    onClick={() => setIsRevealed(false)}
                >
                    Закрити
                </button>
            )}
        </div>
    );

};