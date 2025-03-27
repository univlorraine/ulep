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

import { IonButton, IonIcon } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RecordSvg, SenderSvg } from '../../assets';
import styles from './RecordingButton.module.css';

interface RecordingButtonProps {
    mode: 'send' | 'record';
    onSendPressed?: () => void;
    handleStartRecord: () => void;
    handleStopRecord: () => void;
    hideSendButton?: boolean;
    hideRecordButton?: boolean;
    isBlocked: boolean;
}

const RecordingButton = ({
    mode,
    onSendPressed,
    handleStartRecord,
    handleStopRecord,
    isBlocked,
    hideSendButton = false,
    hideRecordButton = false,
}: RecordingButtonProps) => {
    const { t } = useTranslation();
    const [recording, setRecording] = useState(false);
    const [time, setTime] = useState(0);

    useEffect(() => {
        if (isBlocked) {
            return;
        }
        let timer: NodeJS.Timeout;
        if (recording && mode === 'record') {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (recording && mode === 'send') {
            setRecording(false);
            clearInterval(timer!);
            setTime(0);
        }
        return () => clearInterval(timer);
    }, [recording, mode, isBlocked]);

    const startRecording = () => {
        if (isBlocked) {
            return;
        }
        setRecording(true);
        handleStartRecord();
    };

    const stopRecording = () => {
        if (isBlocked) {
            return;
        }
        setRecording(false);
        setTime(0);
        handleStopRecord();
    };

    return (
        <div className={styles['container']}>
            {mode !== 'send' && (
                <div className={styles['record-container']}>
                    {recording && <div className={styles['timer']}>{time}s</div>}
                    {!hideRecordButton && (
                        <IonButton
                            id="record-button"
                            title={t('chat.send_button.record_aria_label') as string}
                            aria-label={t('chat.send_button.record_aria_label') as string}
                            fill="clear"
                            className={styles['sender-button']}
                            disabled={isBlocked}
                            onClick={onSendPressed}
                            onMouseDown={startRecording}
                            onMouseUp={stopRecording}
                            onTouchStart={startRecording}
                            onTouchEnd={stopRecording}
                        >
                            <IonIcon className={styles['recorder']} icon={RecordSvg} />
                        </IonButton>
                    )}
                </div>
            )}
            {!hideSendButton && (
                <IonButton
                    id="send-button"
                    title={t('chat.send_button.send_aria_label') as string}
                    aria-label={t('chat.send_button.send_aria_label') as string}
                    fill="clear"
                    className={styles['sender-button']}
                    onClick={onSendPressed}
                >
                    <IonIcon className={styles['sender']} icon={SenderSvg} />
                </IonButton>
            )}
        </div>
    );
};

export default RecordingButton;
