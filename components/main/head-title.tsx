import React from 'react';
import {cn} from "@/lib/utils";

interface HeadTitleProps {
    text?: string;
    highlight?: string;
    className?: string; // Додаткові класи
}

const HeadTitle: React.FC<HeadTitleProps> = ({ text = "", highlight = "", className = "" }) => {
    return (
        <div className={cn("self-start py-5 text-5xl", className)}>
            <h1 className="uppercase font-black">
                {text}{" "}
                <span className="bg-foreground px-1.5 rounded-md">
                    <span className="HeaderGrad">{highlight}</span>
                </span>
            </h1>
        </div>
    );
};

export default HeadTitle;
