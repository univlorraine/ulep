import React from 'react';
import { BooleanField, useTranslate } from 'react-admin';
import { LearningType } from '../../entities/LearningLanguage';

export const DisplaySameTandem = ({ sameTandemEmail }: { sameTandemEmail?: string }) => {
    if (sameTandemEmail) {
        return <p>{sameTandemEmail}</p>;
    }

    return <BooleanField record={{ sameTandemEmail: false }} source="sameTandemEmail" />;
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
