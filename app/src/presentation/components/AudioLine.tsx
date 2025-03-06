import React, { useEffect, useRef, useState } from 'react';
import { PauseSvg, PlaySvg } from '../../assets';
import styles from './AudioLine.module.css';

interface AudioLineProps {
    audioFile: File | string;
    hideProgressBar?: boolean;
    small?: boolean;
    icon?: string;
}

// TODO: Remove this todo later

const AudioLine: React.FC<AudioLineProps> = ({ audioFile, hideProgressBar = false, small = false, icon }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    let audioFileString = '';
    if (typeof audioFile === 'string') {
        audioFileString = audioFile;
    } else {
        audioFileString = URL.createObjectURL(audioFile);
    }
    const audioRef = useRef(new Audio(audioFileString));

    useEffect(() => {
        if (duration === 0) return;

        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setProgress((audio.currentTime / duration) * 100);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            audio.currentTime = 0;
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [duration]);

    // Go to the end of the audio file to get the duration (infinity problem : https://stackoverflow.com/questions/21522036/html-audio-tag-duration-always-infinity )
    useEffect(() => {
        const audio = audioRef.current;
        if (duration === 0 && (audio.duration === Infinity || Number.isNaN(audio.duration))) {
            audio.currentTime = 100000000;
            setTimeout(() => {
                audio.currentTime = 0;
                setDuration(audio.duration);
            }, 1000);
        }
    }, [audioFile, audioRef, audioRef.current.duration]);

    const togglePlayPause = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
            audio.currentTime = 0;
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className={styles.audioLine}>
            <button className={`${styles.button} ${small ? styles.smallButton : ''}`} onClick={togglePlayPause}>
                {isPlaying ? <img src={icon || PauseSvg} alt="Pause" /> : <img src={icon || PlaySvg} alt="Play" />}
            </button>
            {!hideProgressBar && (
                <div className={styles.progressBar}>
                    <div className={styles.progress} style={{ width: `${progress}%` }}></div>
                </div>
            )}
        </div>
    );
};

export default AudioLine;
