"use client"
import React, {useEffect, useState, useRef } from 'react';
import classNames from 'classnames';

import Image from 'next/image';

interface ImageCarouselProps {
    images: string[];
    interval?: number;
    reverseOrder?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, interval = 3000, reverseOrder = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    // const imageRef = useRef<HTMLDivElement>(null);

    const orderedImages = reverseOrder ? [...images].reverse() : images;

    useEffect(() => {
        const imageInterval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % orderedImages.length);
        }, interval);

        return () => clearInterval(imageInterval);
    }, [orderedImages.length, interval]);

    const handleWheel = (event: WheelEvent) => {
        setCurrentIndex((prevIndex) => {
            if (event.deltaY > 0) {
                // Scroll down, go to the next image
                return (prevIndex + 1) % orderedImages.length;
            } else {
                // Scroll up, go to the previous image
                return (prevIndex - 1 + orderedImages.length) % orderedImages.length;
            }
        });
    };

    useEffect(() => {
        const carouselElement = carouselRef.current;
        if (carouselElement) {
            carouselElement.addEventListener("wheel", handleWheel);
        }

        return () => {
            if (carouselElement) {
                carouselElement.removeEventListener("wheel", handleWheel);
            }
        };
    }, [orderedImages.length]);

    return (
        <div ref={carouselRef} className="carousel-container h-fit">
            {orderedImages.map((imgSrc, index) => {
                const displayIndex = (index - currentIndex + orderedImages.length) % orderedImages.length;

                // Hide images after the fourth visible one
                const isVisible = displayIndex < 4;

                return (
                    <Image
                        key={index}
                        src={imgSrc}
                        alt={`Image ${index + 1}`}
                        width="1280"
                        height="720"
                        className={classNames('carousel-image', {
                            'active-image': displayIndex === 0,
                        })}
                        style={{
                            transform: `translate(${displayIndex * 20}px, -${displayIndex * 15}px)`,
                            zIndex: orderedImages.length - displayIndex,
                            opacity: isVisible ? (displayIndex === 0 ? 1 : 1 / (displayIndex + 1)) : 0,
                            transition: isVisible ? 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out' : 'opacity 0s',
                        }}
                    />
                );
            })}
        </div>
    );
};

export default ImageCarousel;
