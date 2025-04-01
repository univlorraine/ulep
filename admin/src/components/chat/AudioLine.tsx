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

import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Box, IconButton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

interface AudioLineProps {
    audioFile: File | string;
    hideProgressBar?: boolean;
}

const AudioLine = ({ audioFile, hideProgressBar = false }: AudioLineProps) => {
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
        if (!audioRef) {
            return;
        }
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
            sx={
                !hideProgressBar
                    ? {
                          backgroundColor: 'secondary.main',
                          borderRadius: '5px',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 1,
                          padding: '10px',
                      }
                    : {}
            }
        >
            <IconButton onClick={togglePlayPause} size="large" sx={{ color: 'primary.main', marginRight: '10px' }}>
                {isPlaying ? (
                    <PauseCircleOutlineIcon fontSize="inherit" />
                ) : (
                    <PlayCircleOutlineIcon fontSize="inherit" />
                )}
            </IconButton>

            {!hideProgressBar && (
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
                        sx={{
                            width: `${progress}%`,
                            height: '10px',
                            backgroundColor: 'primary.main',
                            borderRadius: '5px',
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default AudioLine;
