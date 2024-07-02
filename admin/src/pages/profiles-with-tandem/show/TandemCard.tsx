import { Box, Button, Chip, Typography } from '@mui/material';
import React from 'react';

import { BooleanField, FunctionField, TextField, useTranslate } from 'react-admin';
import CustomAvatar from '../../../components/CustomAvatar';
import { DisplayGender, DisplayLearningType, DisplayRole, DisplaySameTandem } from '../../../components/translated';
import Language from '../../../entities/Language';
import { LearningLanguage } from '../../../entities/LearningLanguage';
import { Gender } from '../../../entities/User';
import codeLanguageToFlag from '../../../utils/codeLanguageToFlag';

import './show.css';

export enum TandemType {
    BEST_OVERALL = 'bestOverall',
    BEST_MATCH = 'bestMatch',
}

const ChipsElement = ({ isOk }: { isOk: boolean }) => {
    const translate = useTranslate();

    return isOk ? (
        <Chip color="success" label={translate('learning_languages.show.management.ok')} />
    ) : (
        <Chip color="warning" label={translate('learning_languages.show.management.no')} />
    );
};

const TandemCard = ({ tandemType }: { tandemType: TandemType }) => {
    const translate = useTranslate();

    return (
        <Box>
            {tandemType === TandemType.BEST_OVERALL && (
                <>
                    <Typography variant="h4">
                        🏆 {translate('learning_languages.show.management.best_tandem')}
                    </Typography>
                    <Typography className="description">
                        {translate('learning_languages.show.management.best_tandem_desc')}
                    </Typography>
                </>
            )}
            {tandemType === TandemType.BEST_MATCH && (
                <>
                    <Typography variant="h4">
                        🪄 {translate('learning_languages.show.management.best_match')}
                    </Typography>
                    <Typography className="description">
                        {translate('learning_languages.show.management.best_match_desc')}
                    </Typography>
                </>
            )}

            <div className="line profile-name">
                <CustomAvatar
                    avatarId="null"
                    firstName="Pablo"
                    lastName="Costa"
                    sx={{ width: '35px', height: '35px', fontSize: '1rem' }}
                />
                <p>Pablo Costa ({codeLanguageToFlag('es')})</p>
            </div>

            <div className="line">
                <span className="label">
                    <Typography>{translate('learning_languages.show.fields.score')}</Typography>
                </span>
                <span>
                    <Typography>91%</Typography>
                </span>
            </div>

            <FunctionField
                render={() => (
                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.gender')}</span>
                        <span>
                            <DisplayGender gender={Gender.MALE} />
                            <ChipsElement isOk />
                        </span>
                    </div>
                )}
            />

            <FunctionField
                render={() => (
                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.age')}</span>
                        <span>
                            50
                            <ChipsElement isOk={false} />
                        </span>
                    </div>
                )}
            />

            <div className="line">
                <span className="label">{translate('learning_languages.list.tableColumns.university')}</span>
                <span>Test</span>
            </div>

            <FunctionField
                render={(record: Language) => (
                    <div className="line">
                        <span className="label">
                            {translate('learning_languages.list.tableColumns.learnedLanguage')}
                        </span>
                        <span>{codeLanguageToFlag(record.code)}</span>
                    </div>
                )}
                source="code"
            />
            <FunctionField
                render={() => (
                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.level')}</span>
                        <TextField label={translate('learning_languages.show.fields.level')} source="level" />
                    </div>
                )}
            />
            <FunctionField
                render={(data: LearningLanguage) => (
                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.status')}</span>
                        <span>{translate(`global.userStatus.${data.profile.user.status?.toLowerCase()}`)}</span>
                    </div>
                )}
            />
            <FunctionField
                render={(data: LearningLanguage) => (
                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.role')}</span>
                        <span>
                            <DisplayRole role={data.profile?.user.role} />
                        </span>
                    </div>
                )}
            />
            <FunctionField
                render={(data: LearningLanguage) => (
                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.learningType')}</span>
                        <span>
                            <DisplayLearningType learningType={data.learningType} />
                        </span>
                    </div>
                )}
            />
            <FunctionField
                render={(data: LearningLanguage) => (
                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.sameTandemEmail')}</span>
                        <span>
                            <DisplaySameTandem sameTandemEmail={data.sameTandemEmail} />
                        </span>
                    </div>
                )}
            />
            <FunctionField
                render={() => (
                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.sameGender')}</span>
                        <span>{/*  // TODO */}</span>
                    </div>
                )}
            />
            <FunctionField
                render={() => (
                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.sameAge')}</span>
                        <span>{/*  // TODO */}</span>
                    </div>
                )}
            />
            <FunctionField
                render={() => (
                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.certificateOption')}</span>
                        <span>
                            <BooleanField source="certificateOption" />
                        </span>
                    </div>
                )}
            />
            <FunctionField
                render={() => (
                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.specificProgram')}</span>
                        <span>
                            <BooleanField source="specificProgram" />
                        </span>
                    </div>
                )}
            />
            <FunctionField
                render={() => (
                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.hasPriority')}</span>
                        <span>
                            <BooleanField source="hasPriority" />
                        </span>
                    </div>
                )}
            />
            <Button color="info" sx={{ marginTop: 2 }} variant="contained">
                {translate('learning_languages.show.management.validate')}
            </Button>
        </Box>
    );
};
export default TandemCard;
