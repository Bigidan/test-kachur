// components/Player.js
"use client";

import React, {useCallback, useEffect, useRef, useState} from "react";
import { usePlayer } from "@/components/player/player-context";
import { BsSkipEndFill, BsPlayFill, BsPauseFill,
    BsVolumeUpFill, BsVolumeMuteFill, } from "react-icons/bs";

import { RiPictureInPicture2Fill, RiPictureInPictureExitLine,
    RiSettings5Fill, RiFullscreenFill, RiFullscreenExitFill, } from "react-icons/ri";
import {Button} from "@/components/ui/button";

import "./player.css";
import Image from "next/image";
import {Slider} from "@/components/ui/slider";
import {Switch} from "@/components/ui/switch";

interface VideoProgress {
    watchId: string;
    episodeId: string;
    timestamp: number;
}

const Player = () => {
    const {
        currentVideo,
        isPlaying,playNextEpisode,
        autoplayEnabled,
        toggleAutoplay,
        currentEpisode,
        watchId,
    } = usePlayer();

    const [isFirefox, setIsFirefox] = useState(false);

    const [volumeSliderValue, setVolumeValue] = useState([0]);
    const [currentTime, setCurrentTime] = useState("");
    const [duration, setDuration] = useState("");

    const [isDragging, setDragging] = useState(false);
    const startDragging = useCallback(() => setDragging(true), []);
    const stopDragging = useCallback(() => setDragging(false), []);

    const [wasPaused, setPause] = useState(false);

    const timelineContainerRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);
    const progressInterval = useRef<NodeJS.Timeout>();
    const skipInterval = useRef<NodeJS.Timeout | null>(null);



    const saveVideoProgress = useCallback(() => {
        if (!videoRef.current || !watchId || !currentEpisode) return;

        const progress: VideoProgress = {
            watchId: watchId,
            episodeId: currentEpisode.episodeId,
            timestamp: videoRef.current.currentTime,
        };

        localStorage.setItem(
            `video_progress_${watchId}_${currentEpisode.episodeId}`,
            JSON.stringify(progress)
        );
    }, [currentEpisode, watchId]);
    const getVideoProgress = (): number | null => {
        if (!watchId || !currentEpisode) return null;

        const saved = localStorage.getItem(
            `video_progress_${watchId}_${currentEpisode.episodeId}`
        );

        if (!saved) return null;

        const progress: VideoProgress = JSON.parse(saved);

        return progress.timestamp;
    };
    // const handleBeforeUnload = () => {
    //     saveVideoProgress();
    // };
    
    useEffect(() => {
        progressInterval.current = setInterval(saveVideoProgress, 10000);
        
        window.addEventListener('beforeunload', saveVideoProgress);

        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
            window.removeEventListener('beforeunload', saveVideoProgress);
        };

    }, [watchId, currentEpisode, saveVideoProgress]);



    // Пауза та відтворення
    const toggleClass = (element: HTMLDivElement, className: string) => {
        if (element.classList.contains(className)) {
            element.classList.remove(className);
        } else {
            element.classList.add(className);
        }
    };
    const togglePlay = () => {
        const video = videoRef.current;
        if (video) {
            if (video.paused) {
                video.play().then(() => controlsRef.current?.classList.toggle("paused", false));

            } else {
                video.pause();
                controlsRef.current?.classList.toggle("paused", true);
            }
        }
    };

    const handleVideoEnd = () => {
        saveVideoProgress();
        playNextEpisode();
    };

    // Повноекранний режим
    const toggleFullScreen = useCallback(() => {
        if (document.fullscreenElement == null) {
            // Перехід в повноекранний режим
            if (controlsRef && controlsRef.current) {
                controlsRef.current.requestFullscreen().then(() => controlsRef.current?.classList.toggle("fullscreen", true));
            }
        } else {
            // Вихід з повноекранного режиму
            document.exitFullscreen().then(() => controlsRef.current?.classList.toggle("fullscreen", false));
        }
    }, []);

    // Picture-in-picture
    const togglePictureInPicture = useCallback(async () => {
        if (videoRef.current) {
            try {
                if (document.pictureInPictureElement) {
                    // Якщо відео вже в Picture-in-Picture, вийти з цього режиму
                    await document.exitPictureInPicture();
                } else {
                    // Якщо відео ще не в режимі Picture-in-Picture, активувати його
                    await videoRef.current.requestPictureInPicture();
                }
                toggleClass(controlsRef.current || new HTMLDivElement(), "picture");
            } catch (error) {
                console.error("Помилка Picture-in-Picture:", error);
            }
        } else {
            console.warn("Picture-in-Picture не підтримується у цьому браузері.");
        }
    }, []);

    // Звук
    const toggleMute = () => {
        const video = videoRef.current;
        if (video) {
            video.muted = !video.muted;
        }
    }
    const inputChange = (e: number[]) => {
        const video = videoRef.current;
        if (!video) return;

        setVolumeValue(e);
        video.volume = e[0];
        video.muted = e[0] === 0;

        localStorage.setItem("volume", e[0].toString());
    }

    const volumeChange = () => {
        const video = videoRef.current;
        if (!video) return;

        setVolumeValue([video.volume]);
        let volumeLevel;

        if (video.muted || video.volume === 0) {
            volumeLevel = "muted";
        } else if (video.volume >= .5) {
            volumeLevel = "up";
        } else volumeLevel = "down";

        if (!controlsRef.current) return;
        controlsRef.current.dataset.volume = volumeLevel;
    }


    //Перемотка
    const skipVideo = useCallback((duration: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += duration;
            saveVideoProgress();
        }
    }, [saveVideoProgress]);


    const timelineUpdate = useCallback((e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
        if (timelineContainerRef.current) {
            const rect = timelineContainerRef.current.getBoundingClientRect();
            const clientX = e.clientX; // координата миші по осі X
            const offsetX = clientX - rect.left; // відстань від лівої межі контейнера

            const percent = Math.min(Math.max(0, offsetX), rect.width) / rect.width; // обчислення процента

            // Оновлення стилю з позицією попереднього перегляду
            timelineContainerRef.current.style.setProperty("--preview-position", String(percent));

            if (isDragging) {
                e.preventDefault(); // запобігання дефолтній поведінці
                // Оновлення стилю для прогресу
                timelineContainerRef.current.style.setProperty("--progress-position", String(percent));
            }
        }
    }, [isDragging]);

    const toggleDragging = useCallback((e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
        const target = e.target as HTMLDivElement;
        const rect = target.getBoundingClientRect();
        const offsetX = e.clientX - rect.left; // відстань від лівої межі
        const percent = Math.min(Math.max(0, offsetX), rect.width) / rect.width;
        console.log("Початкове: ", percent);
        // Якщо починається перетягування
        if ((e.buttons & 1) === 1) {
            startDragging();
            if (videoRef.current) {
                setPause(videoRef.current.paused);
                videoRef.current.pause();
            }
        } else {
            // Якщо перетягування завершено
            stopDragging();
            if (videoRef.current) {
                // Тут важливо перерахувати час відео на відсоток
                videoRef.current.currentTime = percent * videoRef.current.duration;
                console.log("Кінцеве: ", percent);
                if (!wasPaused) videoRef.current.play().then(() => {});
            }
        }

        // Оновлення позиції після завершення перетягування
        if (!isDragging) {
            timelineUpdate(e); // Оновлюємо таймлайн після завершення
        }
    }, [startDragging, stopDragging, timelineUpdate, wasPaused, isDragging]);


    // 1. **Робота з подіями миші**
    useEffect(() => {
        const handleVideoMouseMove = () => {
            controlsRef.current?.classList.toggle("visible", true);

            // Очищуємо попередній таймер
            if (inactivityTimeout.current) {
                clearTimeout(inactivityTimeout.current);
            }

            // Встановлюємо новий таймер для приховування контролів
            inactivityTimeout.current = setTimeout(() => {
                controlsRef.current?.classList.toggle("visible", false);
            }, 1500);
        };

        const container = controlsRef.current;
        if (container) {
            container.addEventListener("mousemove", handleVideoMouseMove);
        }

        return () => {
            if (container) {
                container.removeEventListener("mousemove", handleVideoMouseMove);
            }
        };
    }, []); // Виконується один раз при монтуванні компонента

    // 2. **Встановлення параметрів браузера та гучності**
    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        setIsFirefox(userAgent.includes("firefox"));

        const savedVolume = localStorage.getItem("volume");
        const initialVolume = savedVolume ? parseFloat(savedVolume) : 0.5;
        setVolumeValue([initialVolume]);
        inputChange([initialVolume]);
        volumeChange();
    }, []); // Виконується один раз при монтуванні компонента

    // 3. **Обробка подій клавіатури**
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const tagName = document?.activeElement?.tagName?.toLowerCase();
            if (tagName === "input") return;

            switch (event.key.toLowerCase()) {
                case " ":
                    event.preventDefault();
                    togglePlay();
                    break;
                case "k":
                case "л":
                    togglePlay();
                    break;
                case "f":
                case "а":
                    toggleFullScreen();
                    break;
                case "i":
                case "ш":
                    if (!navigator.userAgent.toLowerCase().includes("firefox")) {
                        togglePictureInPicture().then(() => {});
                    }
                    break;
                case "arrowleft":
                    if (!skipInterval.current) {
                        skipVideo(-5);
                        skipInterval.current = setInterval(() => skipVideo(-5), 300);
                    }
                    break;
                case "j":
                case "о":
                    if (!skipInterval.current) {
                        skipVideo(-2);
                        skipInterval.current = setInterval(() => skipVideo(-2), 300);
                    }
                    break;
                case "arrowright":
                    if (!skipInterval.current) {
                        skipVideo(5);
                        skipInterval.current = setInterval(() => skipVideo(5), 300);
                    }
                    break;
                case "l":
                case "д":
                    if (!skipInterval.current) {
                        skipVideo(2);
                        skipInterval.current = setInterval(() => skipVideo(2), 300);
                    }
                    break;
                case "m":
                case "ь":
                    toggleMute();
                    break;
                default:
                    break;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (["arrowleft", "arrowright"].includes(event.key.toLowerCase())) {
                if (skipInterval.current) {
                    clearInterval(skipInterval.current);
                    skipInterval.current = null;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [skipVideo, toggleFullScreen, togglePictureInPicture]); // Виконується один раз при монтуванні компонента

    // 4. **Робота з подіями миші під час перетягування**
    useEffect(() => {
        const handleMouseUp = (e: MouseEvent) => {
            if (isDragging) toggleDragging(e);
            saveVideoProgress();
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) timelineUpdate(e);
        };

        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isDragging, saveVideoProgress, timelineUpdate, toggleDragging]); // Залежить від стану `isDragging`

    // Створення нулів для тексту
    const formatDuration = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        return [hours, minutes, seconds]
            .filter((unit, index) => unit > 0 || index > 0)
            .map((unit) => unit.toString().padStart(2, "0"))
            .join(":");
    };


    return (
        <div className="w-full aspect-video video_container paused" ref={controlsRef}>

            <div className="absolute left-0 right-0 bottom-0 top-0 episodePlayerName">
                <p className="p-6 relative z-[2]">{currentEpisode?.episodeNumber}. {currentEpisode?.episodeName}</p>
            </div>


            <img className="thumbnail_img" alt=""/>
            <div className="video_controls_container">


                <div className="special_controls m-2">
                    <Button variant="ghost">
                        Пропустити опенінґ<BsSkipEndFill className="BsSkipEndFill"/>
                    </Button>
                </div>

                <div
                    className="time_line_container"
                    ref={timelineContainerRef}
                    onMouseMove={timelineUpdate}
                    onMouseDown={toggleDragging}
                >
                    <div className="time_line">
                        <img className="preview_img" alt=""/>
                        <div className="thumb_indicator"></div>
                    </div>
                </div>

                <div className="controls">
                    <Button variant="link" size="icon" onClick={() => togglePlay()}>
                        <BsPlayFill className="BsPlayFill"/>
                        <BsPauseFill className="BsPauseFill"/>
                    </Button>

                    <div className="volume_container">
                        <Button variant="link" size="icon" onClick={() => toggleMute()}>
                            <BsVolumeUpFill className="BsVolumeUpFill"/>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" className="BsVolumeDownFill"
                                 height="1em" width="2em" viewBox="2 0 16 16">
                                <path
                                    d="M9 4a.5.5 0 0 0-.812-.39L5.825 5.5H3.5A.5.5 0 0 0 3 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 9 12zm3.025 4a4.5 4.5 0 0 1-1.318 3.182L10 10.475A3.5 3.5 0 0 0 11.025 8 3.5 3.5 0 0 0 10 5.525l.707-.707A4.5 4.5 0 0 1 12.025 8"></path>
                            </svg>
                            <BsVolumeMuteFill className="BsVolumeMuteFill"/>
                        </Button>
                        <div className="volume_slider_container">
                            <Slider value={volumeSliderValue} min={0} max={1} step={0.01} className="volume_slider"
                                    onValueChange={(e) => inputChange(e)}/>
                        </div>
                    </div>

                    <div className="flex align-items-center gap-1 flex-grow text-sm">
                        <div>{currentTime}</div>
                        /
                        <div>{duration}</div>
                    </div>

                    <Button variant="link" size="icon">
                        <Image width={60} height={35} src="/duck.svg" alt="" className="DuckBtn"/>
                    </Button>

                    <div className="flex align-items-center">
                        <Switch
                            className="AutoPlayNextBtn"
                            checked={autoplayEnabled} onCheckedChange={toggleAutoplay}
                        />
                    </div>

                    {/* Якщо браузер НЕ фаєрфокс відображаємо кнопку для picture-in-picture */}
                    {!isFirefox && (
                        <Button variant="link" size="icon" onClick={() => togglePictureInPicture()}>
                            <RiPictureInPicture2Fill className="RiPictureInPicture2Fill"/>
                            <RiPictureInPictureExitLine className="RiPictureInPictureExitLine"/>
                        </Button>
                    )}

                    <Button variant="link" size="icon" className="smallerBtn">
                        <RiSettings5Fill className="RiSettings5Fill"/>
                    </Button>

                    <Button variant="link" size="icon" onClick={() => toggleFullScreen()} className="smallerBtn">
                        <RiFullscreenFill className="RiFullscreenFill"/>
                        <RiFullscreenExitFill className="RiFullscreenExitFill"/>
                    </Button>
                </div>
            </div>

            {/* Ваша логіка для відтворення відео */}
            <video ref={videoRef} src={currentVideo} autoPlay={isPlaying} className="media_player w-full"
                   onClick={() => togglePlay()} onVolumeChange={volumeChange} onTimeUpdate={() => {
                if (timelineContainerRef.current && videoRef.current) {
                    const percent = videoRef.current.currentTime / videoRef.current.duration;
                    timelineContainerRef.current.style.setProperty("--progress-position", String(percent))
                    setCurrentTime(videoRef.current ? (formatDuration(videoRef.current.currentTime)) : "00:00");
                } else setCurrentTime("00:00");
            }}
                   onEnded={handleVideoEnd}
                   onLoadedData={() => {
                       setDuration(videoRef.current ? (formatDuration(videoRef.current.duration)) : "00:00");
                       if (!videoRef.current) return;

                       const savedProgress = getVideoProgress();
                       if (savedProgress !== null) {
                           videoRef.current.currentTime = savedProgress;
                       }
                   }}
            />
        </div>
    );
};

export default Player;
