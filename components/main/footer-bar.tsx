import React from 'react';
import {Button} from "@/components/ui/button";
import Image from "next/image";

const FooterBar = () => {
    return (
        <div className="w-full bg-gradient-to-b from-background to-[#F60000] py-20 overflow-hidden">

            <div>
                <div className="mx-auto max-w-screen-xl grid grid-cols-8 gap-3">

                    <div className="flex items-center self-end clapperboard col-span-3">
                        <div className="">
                            <Image src="/clapperboard.png" width={500} height={500} alt="" className="clapperboard-bottom"/>
                            <Image src="/clapperboard_up.png" width={500} height={500} alt="" className="clapperboard-top"/>
                        </div>
                    </div>
                    <div className="flex flex-col items-center self-end w-[270px] ml-36 gap-8 col-span-3">
                        <div className="font-bold text-2xl text-center">МИ ОЗВУЧУЄМО НА ЗАМОВЛЕННЯ ВАШІ УЛЮБЛЕНІ АНІМЕ!</div>
                        <Button className="bg-black hover:bg-[#171717] px-14 py-8
                                            text-white text-3xl font-extrabold">
                            ЗАМОВИТИ
                        </Button>
                    </div>
                    <div className="flex flex-col items-center justify-between self-end text-xl font-semibold col-span-2">
                        <div className="text-xl font-extrabold mb-[50px]">Соцмережі</div>
                        <div className="space-y-1 mb-[30px]">
                        <a target="_blank" href="https://t.me/Studio_Kachur" className="opacity-80 flex items-center gap-2 hover:opacity-100 transition">
                            <Image src="/telegram.png" width={22} height={22} alt=""/>
                            Telegram
                        </a>
                        <a target="_blank" href="https://www.youtube.com/@kachurdub" className="opacity-80 flex items-center gap-2 hover:opacity-100 transition">
                            <Image src="/youtube.png" width={22} height={22} alt=""/>
                            YouTube
                        </a>
                        <a target="_blank" href="https://www.instagram.com/studio_kachur/" className="opacity-80 flex items-center gap-2 hover:opacity-100 transition">
                            <Image src="/instagram.png" width={22} height={22} alt=""/>
                            Instagram
                        </a>
                        <a target="_blank" href="https://www.tiktok.com/@studio_kachur" className="opacity-80 flex items-center gap-2 hover:opacity-100 transition">
                            <Image src="/tiktok.png" height={22} width={22} alt=""/>
                            TikTok
                        </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FooterBar;
