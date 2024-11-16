import React, { useEffect, useRef } from 'react';
import ImageCarousel from "@/components/ui/main/image-carousel";
import {Button} from "@/components/ui/button";
import Link from "next/link";


interface HeroImagesProps {
    imageArray: number;
    interval?: number;
    reverseOrder?: boolean;
    videoSrc: string;
    id: number;
    description: string;
}

const HeroImages: React.FC<HeroImagesProps>  = ({imageArray, interval= 3000, reverseOrder = true,  videoSrc, id, description}) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);  // Тип для відео

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoRef.current?.play();
                } else {
                    videoRef.current?.pause();
                }
            },
            { threshold: 0.5 }
        );

        if (videoRef.current) observer.observe(videoRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="h-full relative overflow-hidden bg-background/80
          grid grid-cols-5 items-center justify-around w-screen">

            <div className="col-start-2 col-span-3 grid grid-cols-3 w-full h-full">
                <div className="col-span-2">
                    <ImageCarousel images={Array.from({ length: imageArray }, (_, i) => `/${id}/${i + 1}.png`)} interval={interval} reverseOrder={reverseOrder}/>
                </div>
                <div className="col-start-3 flex flex-col justify-center">
                    <img src={"/" + id + "/name.png"} alt="" className="self-end" width="130" height="130"/>
                    <h4 className="z-10 w-4/5 self-end text-right text-wrap">{description}</h4>
                    <Link href="watch" className="self-end">
                        <Button variant="kachurGrad" size="kachurGrad" className="w-fit self-end gap-9 h-auto mt-5">
                            <img src="/watch.svg" width={37} height={37} alt="" />
                            <span className="text-lg font-black">ДИВИТИСЬ</span>
                            <span className="w-7"></span>
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="col-span-5 absolute top-0 w-full h-20 grad-class">

            </div>
            <div className="col-span-5 absolute bottom-0 w-full h-20 grad-class rot">

            </div>

            <video ref={videoRef} loop muted
                   className="col-span-5 absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden max-w-fit">
                <source src={videoSrc}/>
            </video>
        </div>
    );
};

export default HeroImages;
