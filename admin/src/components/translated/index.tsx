import React from 'react';
import { useTranslate } from 'react-admin';
import { LearningType } from '../../entities/Profile';

export const DisplayRole = ({ role }: { role?: UserRole }) => {
    const translate = useTranslate();
    switch (role) {
        case 'STAFF':
            return <>{translate('global.staff')}</>;
        case 'STUDENT':
            return <>{translate('global.student')}</>;
        default:
            return null;
    }
};

export const DisplayLearningType = ({ learningType }: { learningType?: LearningType }) => {
    const translate = useTranslate();
    switch (learningType) {
        case LearningType.TANDEM:
            return <>{translate('global.tandem')}</>;
        case LearningType.ETANDEM:
            return <>{translate('global.etandem')}</>;
        case LearningType.BOTH:
            return <>{translate('global.both')}</>;
        default:
            return null;
    }
};
