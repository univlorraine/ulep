import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Box, IconButton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

interface AudioLineProps {
    audioFile: File | string;
}

const AudioLine = ({ audioFile }: AudioLineProps) => {
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

        // eslint-disable-next-line consistent-return
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [duration]);

    // Aller à la fin du fichier audio pour obtenir la durée (problème d'infini : https://stackoverflow.com/questions/21522036/html-audio-tag-duration-always-infinity )
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
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
                padding: '10px',
            }}
        >
            <IconButton onClick={togglePlayPause} size="large" sx={{ color: 'primary.main', marginRight: '10px' }}>
                {isPlaying ? (
                    <PauseCircleOutlineIcon fontSize="inherit" />
                ) : (
                    <PlayCircleOutlineIcon fontSize="inherit" />
                )}
            </IconButton>
            <Box
                sx={{
                    minWidth: '200px',
                    width: '100%',
                    height: '10px',
                    backgroundColor: 'grey.100',
                    borderRadius: '5px',
                }}
            >
                <Box
                    sx={{ width: `${progress}%`, height: '10px', backgroundColor: 'primary.main', borderRadius: '5px' }}
                />
            </Box>
        </Box>
    );
};

export default AudioLine;
