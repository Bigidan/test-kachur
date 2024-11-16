"use client"


import React, { useRef, useEffect } from 'react';

interface InfiniteImageScrollProps {
    images: string[]
}

const InfiniteImageScroll: React.FC<InfiniteImageScrollProps> = ({ images }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = containerRef.current;

        if (scrollContainer) {
            const scrollWidth = scrollContainer.scrollWidth;
            const containerWidth = scrollContainer.clientWidth;

            const scrollImages = () => {
                if (scrollContainer.scrollLeft < scrollWidth - containerWidth) {
                    scrollContainer.scrollLeft += 1; // Change speed here
                } else {
                    scrollContainer.scrollLeft = 0; // Reset to start
                }
            };

            const interval = setInterval(scrollImages, 30); // Adjust interval for speed

            return () => clearInterval(interval); // Cleanup interval on unmount
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="imgCont"
            style={{
                display: 'flex',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                width: '100%',
            }}
        >
            {images.concat(images).map((src, index) => (
                <div key={index}>
                    <img src={src} alt={`Image ${index}`} className="image"/>
                </div>
            ))}
        </div>
    );
};

export default InfiniteImageScroll;
