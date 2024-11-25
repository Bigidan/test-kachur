import React from 'react';

interface HeadTitleProps {
    text?: string;
    highlight?: string;
}

const HeadTitle: React.FC<HeadTitleProps> = ({text = "", highlight= ""}) => {
    return (
        <div className="self-start py-5">
            <h1 className="uppercase font-black text-5xl">{text} <span className="bg-foreground px-1.5 rounded-md"><span className="HeaderGrad">{highlight}</span></span>
            </h1>
        </div>
    );
};

export default HeadTitle;
