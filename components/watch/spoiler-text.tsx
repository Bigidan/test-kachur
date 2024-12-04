import React, { useState } from 'react';

interface SpoilerProps {
    children: React.ReactNode;
}

export const Spoiler: React.FC<SpoilerProps> = ({ children }) => {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <div className="relative">
            {!isRevealed ? (
                <div
                    className="
                        bg-black/70 text-black
                        cursor-pointer
                        hover:bg-black/60
                        transition-colors
                        rounded-md
                        px-2 py-1
                        inline-block
                    "
                    onClick={() => setIsRevealed(true)}
                >
                    <span className="text-transparent select-none">Спойлер</span>
                </div>
            ) : (
                <div className="animate-fade-in">{children}</div>
            )}
        </div>
    );
};