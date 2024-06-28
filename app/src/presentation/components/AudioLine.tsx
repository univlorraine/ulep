import React, { useEffect, useRef, useState } from 'react';
import { PauseSvg, PlaySvg } from '../../assets';
import styles from './AudioLine.module.css';

interface AudioLineProps {
    audioFile: File | string;
}

const AudioLine: React.FC<AudioLineProps> = ({ audioFile }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    let audioFileString = '';
    if (typeof audioFile === 'string') {
        audioFileString = audioFile;
    } else {
        audioFileString = URL.createObjectURL(audioFile);
    }
    const audioRef = useRef(new Audio(audioFileString));

    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setProgress((audio.currentTime / audio.duration) * 100);
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
    }, []);

    const togglePlayPause = () => {
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
            <button className={styles.button} onClick={togglePlayPause}>
                {isPlaying ? <img src={PauseSvg} alt="Pause" /> : <img src={PlaySvg} alt="Play" />}
            </button>
            <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

export default AudioLine;
