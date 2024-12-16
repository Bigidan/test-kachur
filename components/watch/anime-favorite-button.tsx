"use client"

import { useState } from 'react';
import {toggleFavorite} from "@/lib/db/userDB";
import {Button} from "@/components/ui/button";
import {BookmarkMinus, BookmarkPlus} from "lucide-react";

interface AnimeFavoriteButtonProps {
    animeId: number;
    userId: number;
    isFavorite: boolean;
}

export function AnimeFavoriteButton({ animeId, userId, isFavorite: initialFavorite }: AnimeFavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialFavorite);

    const handleFavorite = async () => {
        try {
            const response = await toggleFavorite(animeId, userId);
            if (response.success) {
                setIsFavorite(response.favorite);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <Button size="kachurGrad" className="gap-4" onClick={handleFavorite}>
            {isFavorite ? (
                <>
                    <BookmarkMinus strokeWidth={1.5} style={{ width: 45, height: 45 }} />
                    <span className="font-bold uppercase text-[15px]">В ОБРАНОМУ</span>
                </>
            ) : (
                <>
                    <BookmarkPlus strokeWidth={1.5} style={{ width: 45, height: 45 }} />
                    <span className="font-bold uppercase text-[15px]">ДОДАТИ В ОБРАНЕ</span>
                </>
            )}
        </Button>
    );
}
