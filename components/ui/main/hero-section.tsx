"use client"

import React, { useEffect, useRef } from 'react';
import HeroImages from "@/components/ui/main/hero-images";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroType } from "@/components/types/hero-type";

export const HeroData: HeroType[] = [
    {
        name: "ДанДаДан",
        id: 0,
        images: 4,
        description: " Історія розповідатиме про школярів Аясе Момо та Окаруна, які були втягнуті в надприродні події, сповнені злими духами та прибульцями 👻👽 До чого ж тут банани 🍌 і чи вдасться героям повернути втрачене?",
    },
    {
        name: "Винищувач демонів",
        id: 1,
        images: 8,
        description: "Камадо Танджіро продовжує навчатись, та на цей раз його наставниками будуть високоповажні Хашіра. Чи впорається Танджіро з тренуваннями? Чи допоможуть вони, коли він зіткнеться віч-на-віч із самим Кібуцуджі Мудзаном?",
    },
    {
        name: "Тільки я візьму новий рівень",
        id: 2,
        images: 12,
        description: "Одного дня у світі відкрився портал, що веде у паралельні виміри. Це пробудило монстрів підземелля, які могли б захопити нашу планету. Однак водночас з цим, у деяких людей з’явилися надзвичайні здібності, що зробили їх здатними до опору проти небезпечних створінь. Таких людей називають «мисливцями».",
    },
];

const HeroSection: React.FC<{ }> = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth - scrollbarWidth;
            const newScrollPosition = scrollRef.current.scrollLeft - scrollRef.current.clientWidth;

            // Scroll to the end if we reached the beginning
            scrollRef.current.scrollTo({
                left: newScrollPosition < 0 ? maxScrollLeft : newScrollPosition,
                behavior: 'smooth',
            });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
            const newScrollPosition = scrollRef.current.scrollLeft + scrollRef.current.clientWidth + scrollbarWidth;

            // Scroll to the beginning if we reached the end
            scrollRef.current.scrollTo({
                left: newScrollPosition > maxScrollLeft ? 0 : newScrollPosition,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        const startAutoScroll = () => {
            if (!intervalRef.current) {
                intervalRef.current = setInterval(scrollRight, 7000);
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
            if (scrollRef.current) {
                observer.unobserve(scrollRef.current);
            }
            stopAutoScroll();
        };
    }, []);

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


            <div ref={scrollRef}
                 className="col-start-1 col-span-5 flex overflow-hidden snap-x snap-mandatory whitespace-nowrap h-full">
                {HeroData.map((title, index) => (
                    <div className="inline-block" key={index}>
                        <HeroImages imageArray={title.images} videoSrc={title.id + "/prev.mp4"} interval={5000}
                                    reverseOrder={true} description={title.description} id={title.id}/>
                    </div>
                ))}
                {/* Add more HeroImages as needed */}
            </div>


        </div>
    );
};

export default HeroSection;
