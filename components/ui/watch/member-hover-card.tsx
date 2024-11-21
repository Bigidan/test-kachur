"use client"

import React, { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
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
        <HoverCard openDelay={100} closeDelay={300}>
            <HoverCardTrigger
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {children}
            </HoverCardTrigger>
            <HoverCardContent className="w-full AnotherRoles bg-gradient-to-b from-[#BA0000] to-[#540000]">
                <div className="w-full relative">
                    {loading ? (
                        <div className="flex items-center justify-start">
                            Завантаження...
                        </div>
                    ) : profileData && profileData[0] ? (
                        <div className="flex gap-3">
                            {
                                profileData.map((profile: ProfileType, index) => {
                                    const isDifferentAnimeId = (profileData[index + 1]?.animeId !== watchId && profileData[index]?.animeId == watchId);

                                    return (
                                        <div key={profile.characterId} className="flex flex-row items-center justify-start gap-3">
                                            <div
                                                className="flex flex-col items-center justify-start bg-white rounded-md overflow-hidden w-32 relative"
                                                style={{ cursor: "pointer", aspectRatio: 9 / 12.5 }}
                                            >
                                                <img
                                                    src={profile.image || ""}
                                                    alt={profile.name}
                                                    width="144px"
                                                    style={{ objectFit: "cover", aspectRatio: 9 / 10 }}
                                                />
                                                <div className="flex justify-center bg-white p-1 text-wrap items-center text-center w-full h-full">
                                                    <h4 className="text-sm uppercase font-extrabold text-background m-0 p-0 leading-none">
                                                        {profile.name}
                                                    </h4>
                                                </div>

                                            </div>
                                            { isDifferentAnimeId && (
                                                <div className="w-[2px] h-full rounded-md bg-white">

                                                </div>
                                            )
                                            }
                                        </div>
                                    );
                                })
                            }

                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            Інформація недоступна
                        </div>
                    )}


                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default StaffHoverCard;