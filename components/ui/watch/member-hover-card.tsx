"use client"

import React, { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCharactersByActorId } from "@/lib/db/userDB"; // Припустимо, що у вас є така функція

interface StaffHoverCardProps {
    children: React.ReactNode;
    memberId: number | null;
    watchId: number | null;
}

type ProfileType = {
    name: string;
    animeId: number | null;
    image: string | null;
    popularityId: number | null;
    characterId: number;
    voiceActorId: number | null;
}

const StaffHoverCard: React.FC<StaffHoverCardProps> = ({ children, memberId, watchId }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [profileData, setProfileData] = useState<ProfileType[] | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const fetchProfileData = async () => {
            if (isHovered && memberId) {
                setLoading(true);
                try {
                    const data = await getCharactersByActorId(memberId, Number(watchId));
                    setProfileData(data);
                    console.log(data);
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                    setProfileData(null);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (isHovered) {
            timeoutId = setTimeout(fetchProfileData, 300); // Затримка, щоб уникнути зайвих запитів
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isHovered, memberId, watchId]);

    return (
        <HoverCard openDelay={300} closeDelay={300}>
            <HoverCardTrigger
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {children}
            </HoverCardTrigger>
            <HoverCardContent className="w-full">
                {loading ? (
                    <div className="flex items-center justify-start">
                        Завантаження...
                    </div>
                ) : profileData && profileData[0] ? (
                    <div className="flex space-x-4">
                        {profileData.map((profile: ProfileType) => (
                            <div key={profile.characterId} className="flex flex-col items-center justify-end w-32">
                                <img src={profile.image || ""} alt={profile.name} width="100px" height="133px" style={{ objectFit: "cover", aspectRatio: 9 / 12 }} />
                                <div>
                                    <h4 className="text-sm font-semibold">{profile.name}</h4>
                                </div>
                            </div>
                        ))}

                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground">
                        Інформація недоступна
                    </div>
                )}
            </HoverCardContent>
        </HoverCard>
    );
};

export default StaffHoverCard;