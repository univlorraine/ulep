import React from 'react';
import { BooleanField, useTranslate } from 'react-admin';
import { LearningType } from '../../entities/LearningLanguage';
import { Gender } from '../../entities/User';
import ColoredChips, { ChipsColors } from '../ColoredChips';

export const DisplaySameTandem = ({ sameTandemEmail }: { sameTandemEmail?: string }) => {
    if (sameTandemEmail) {
        return <p>{sameTandemEmail}</p>;
    }

    return <BooleanField record={{ sameTandemEmail: false }} source="sameTandemEmail" />;
};

export const DisplayRole = ({ role, chipsColor }: { role?: UserRole; chipsColor?: ChipsColors }) => {
    const translate = useTranslate();

    switch (role) {
        case 'STAFF':
            return chipsColor ? (
                <ColoredChips color={chipsColor} label={translate('global.staff')} />
            ) : (
                <>{translate('global.staff')}</>
            );
        case 'STUDENT':
            return chipsColor ? (
                <ColoredChips color={chipsColor} label={translate('global.student')} />
            ) : (
                <>{translate('global.student')}</>
            );
        default:
            return null;
    }
};

export const DisplayLearningType = ({
    learningType,
    effectiveLearningType,
}: {
    learningType?: LearningType;
    effectiveLearningType?: LearningType;
}) => {
    const translate = useTranslate();
    switch (learningType) {
        case LearningType.TANDEM:
            return <>{translate('global.tandem')}</>;
        case LearningType.ETANDEM:
            return <>{translate('global.etandem')}</>;
        case LearningType.BOTH:
            if (effectiveLearningType) {
                return (
                    <>
                        {translate('global.both')} ({translate(`global.${effectiveLearningType.toLowerCase()}`)})
                    </>
                );
            }

            return <>{translate('global.both')}</>;
        default:
            return null;
    }
};

export const DisplayGender = ({ gender }: { gender: Gender }) => {
    const translate = useTranslate();

    switch (gender) {
        case Gender.MALE:
            return <>{translate('global.genderValues.male')}</>;
        case Gender.FEMALE:
            return <>{translate('global.genderValues.female')}</>;
        case Gender.OTHER:
            return <>{translate('global.genderValues.other')}</>;
        default:
            return null;
    }
};
