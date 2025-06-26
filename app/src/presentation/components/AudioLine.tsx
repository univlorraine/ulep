/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import { PauseSvg, PlaySvg } from '../../assets';
import styles from './AudioLine.module.css';

interface AudioLineProps {
    audioFile: File | string;
    hideProgressBar?: boolean;
    small?: boolean;
    icon?: string;
}

const AudioLine: React.FC<AudioLineProps> = ({ audioFile, hideProgressBar = false, small = false, icon }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isAudioReady, setIsAudioReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const urlRef = useRef<string | null>(null);

    useEffect(() => {
        return () => {
            if (urlRef.current) {
                URL.revokeObjectURL(urlRef.current);
            }
        };
    }, []);

    useEffect(() => {
        let audioFileString = '';

        if (typeof audioFile === 'string') {
            audioFileString = audioFile;
        } else {
            if (urlRef.current) {
                URL.revokeObjectURL(urlRef.current);
            }
            audioFileString = URL.createObjectURL(audioFile);
            urlRef.current = audioFileString;
        }

        const audio = new Audio(audioFileString);
        audioRef.current = audio;

        setIsAudioReady(false);
        setError(null);
        setDuration(0);
        setProgress(0);
        setIsPlaying(false);

        const updateDuration = () => {
            if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
                setDuration(audio.duration);
            }
        };

        const handleCanPlay = () => {
            setIsAudioReady(true);
            updateDuration();
        };

        const handleError = (e: Event) => {
            console.error('Audio error:', e);
            setError('Failed to load audio file');
            setIsAudioReady(false);
        };

        const handleLoadedMetadata = () => {
            updateDuration();
        };

        const handleTimeUpdate = () => {
            const currentDuration = audio.duration;
            if (currentDuration && !isNaN(currentDuration) && currentDuration !== Infinity && currentDuration > 0) {
                setProgress((audio.currentTime / currentDuration) * 100);
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
            }
        };

        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('error', handleError);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        audio.load();

        const durationTimeout = setTimeout(() => {
            if (duration === 0 && audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
                setDuration(audio.duration);
            } else if (duration === 0) {
                audio.currentTime = 100000000;
                setTimeout(() => {
                    if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
                        audio.currentTime = 0;
                        setDuration(audio.duration);
                    }
                }, 100);
            }
        }, 100);

        return () => {
            clearTimeout(durationTimeout);
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, [audioFile]);

    useEffect(() => {
        if (audioRef.current && duration > 0 && isPlaying) {
            const audio = audioRef.current;
            const currentProgress = (audio.currentTime / duration) * 100;
            setProgress(currentProgress);
        }
    }, [duration, isPlaying]);

    const togglePlayPause = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (!audioRef.current || !isAudioReady || error) {
            return;
        }

        const audio = audioRef.current;

        try {
            if (isPlaying) {
                audio.pause();
                audio.currentTime = 0;
                setProgress(0);
                setIsPlaying(false);
            } else {
                await audio.play();
                setIsPlaying(true);
            }
        } catch (err) {
            console.error('Error playing audio:', err);
            setError('Failed to play audio');
            setIsPlaying(false);
        }
    };

    if (error) {
        return (
            <div className={styles.audioLine}>
                <button className={`${styles.button} ${small ? styles.smallButton : ''}`} disabled title={error}>
                    <img src={icon || PlaySvg} alt="Error" style={{ opacity: 0.5 }} />
                </button>
            </div>
        );
    }

    return (
        <div className={styles.audioLine}>
            <button
                className={`${styles.button} ${small ? styles.smallButton : ''}`}
                onClick={togglePlayPause}
                disabled={!isAudioReady}
                tabIndex={0}
                title={!isAudioReady ? 'Loading audio...' : undefined}
            >
                {!isAudioReady ? (
                    <img src={icon || PlaySvg} alt="Loading" style={{ opacity: 0.5 }} />
                ) : isPlaying ? (
                    <img src={icon || PauseSvg} alt="Pause" />
                ) : (
                    <img src={icon || PlaySvg} alt="Play" />
                )}
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
