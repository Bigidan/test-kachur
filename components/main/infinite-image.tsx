"use client"

import React from 'react';

import "./infinite-image.css"
import Image from "next/image";

interface InfiniteImageScrollProps {
    images: string[]
}

const InfiniteImageScroll: React.FC<InfiniteImageScrollProps> = ({ images }) => {

    return (
        <div className="infinite-scroll-container">
            <div className="infinite-scroll-track">
                {images.map((src, index) => (
                    <div key={index} className="scroll-image">
                        <Image src={src} alt={`Image ${index}`} width={109} height={100}/>
                    </div>
                ))}
            </div>
            <div className="infinite-scroll-track" aria-hidden="true">
                {images.map((src, index) => (
                    <div key={index} className="scroll-image">
                        <Image src={src} alt={`Image ${index}`} width={109} height={100}/>
                    </div>
                ))}
            </div>
            <div className="infinite-scroll-track" aria-hidden="true">
                {images.map((src, index) => (
                    <div key={index} className="scroll-image">
                        <Image src={src} alt={`Image ${index}`} width={109} height={100}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfiniteImageScroll;