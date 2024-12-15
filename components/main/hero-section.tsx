"use client"

import React, {useCallback, useEffect, useRef, useState} from 'react';
import HeroImages from "@/components/main/hero-images";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroType } from "@/components/types/hero-type";

export const HeroData: HeroType[] = [
    {
        name: "ДанДаДан",
        id: 1,
        images: 4,
        description: " Історія розповідатиме про школярів Аясе Момо та Окаруна, які були втягнуті в надприродні події, сповнені злими духами та прибульцями 👻👽 До чого ж тут банани 🍌 і чи вдасться героям повернути втрачене?",
    },
    {
        name: "Винищувач демонів",
        id: 2,
        images: 8,
        description: "Камадо Танджіро продовжує навчатись, та на цей раз його наставниками будуть високоповажні Хашіра. Чи впорається Танджіро з тренуваннями? Чи допоможуть вони, коли він зіткнеться віч-на-віч із самим Кібуцуджі Мудзаном?",
    },
    {
        name: "Тільки я візьму новий рівень",
        id: 3,
        images: 12,
        description: "Одного дня у світі відкрився портал, що веде у паралельні виміри. Це пробудило монстрів підземелля, які могли б захопити нашу планету. Однак водночас з цим, у деяких людей з’явилися надзвичайні здібності, що зробили їх здатними до опору проти небезпечних створінь. Таких людей називають «мисливцями».",
    },
];

const HeroSection: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [visibleItems, setVisibleItems] = useState(1);

    const calculateVisibleItems = () => {
        if (scrollRef.current) {
            const containerWidth = scrollRef.current.clientWidth;
            const itemWidth = scrollRef.current.firstElementChild?.clientWidth || 0;
            return Math.max(1, Math.round(containerWidth / itemWidth));
        }
        return 1;
    };

    const scrollLeft = () => {
        if (scrollRef.current) {
            const itemWidth = scrollRef.current.firstElementChild?.clientWidth || 0;
            const currentScroll = scrollRef.current.scrollLeft;
            const newScrollPosition = currentScroll - (itemWidth * visibleItems);

            scrollRef.current.scrollTo({
                left: newScrollPosition < 0 ? scrollRef.current.scrollWidth : newScrollPosition,
                behavior: 'smooth',
            });
        }
    };

    const scrollRight = useCallback(() => {
        if (scrollRef.current) {
            const itemWidth = scrollRef.current.firstElementChild?.clientWidth || 0;
            const currentScroll = scrollRef.current.scrollLeft;
            const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
            const newScrollPosition = currentScroll + (itemWidth * visibleItems);

            scrollRef.current.scrollTo({
                left: newScrollPosition > maxScroll ? 0 : newScrollPosition,
                behavior: 'smooth',
            });
        }
    }, [visibleItems]);

    useEffect(() => {

        const handleResize = () => {
            setVisibleItems(calculateVisibleItems());
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        const startAutoScroll = () => {
            if (!intervalRef.current) {
                intervalRef.current = setInterval(scrollRight, 8000);
            }
        };

        const stopAutoScroll = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    startAutoScroll(); // Start auto-scroll when in view
                } else {
                    stopAutoScroll(); // Stop auto-scroll when out of view
                }
            },
            { threshold: 0.5 } // Trigger when at least 10% of the element is visible
        );

        if (scrollRef.current) {
            observer.observe(scrollRef.current);
        }

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            if (scrollRef.current) {
                observer.unobserve(scrollRef.current);
            }
            stopAutoScroll();
        };
    }, [scrollRight]);

    return (
        <div className="hero relative overflow-hidden grid grid-cols-5 items-center justify-around grid-rows-none">
            <div className="absolute grid grid-cols-5 items-center justify-around w-full h-full">
                <div className="col-start-1 flex w-full justify-center z-20">
                    <Button variant="roundGrad" size="iconBig" onClick={scrollLeft}>
                        <ArrowLeft className="lange-svg"/>
                    </Button>
                </div>
                <div className="col-start-5 flex w-full justify-center z-20">
                    <Button variant="roundGrad" size="iconBig" onClick={scrollRight}>
                        <ArrowRight className="lange-svg"/>
                    </Button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="col-start-1 col-span-5 flex overflow-hidden snap-x snap-mandatory whitespace-nowrap h-full"
            >
                {HeroData.map((title, index) => (
                    <div className="inline-block flex-shrink-0" key={index}>
                        <HeroImages
                            imageArray={title.images}
                            videoSrc={title.id + "/prev.mp4"}
                            interval={7000}
                            reverseOrder={true}
                            description={title.description}
                            id={title.id}
                            watchId={title.id}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeroSection;
