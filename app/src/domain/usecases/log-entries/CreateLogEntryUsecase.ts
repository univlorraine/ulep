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

import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { ActivityCommand } from '../../../command/ActivityCommand';
import { GameName, LogEntryType } from '../../entities/LogEntry';
import CreateLogEntryUsecaseInterface, {
    CreateLogEntryProps,
} from '../../interfaces/log-entries/CreateLogEntryUsecase.interface';

interface CreateLogEntryPayload {
    type: LogEntryType;
    content?: string;
    duration?: number;
    tandemFirstname?: string;
    tandemLastname?: string;
    percentage?: number;
    gameName?: GameName;
    title?: string;
    createdAt?: Date;
    partnerTandemId?: string;
    learningLanguageId: string;
}

class CreateLogEntryUsecase implements CreateLogEntryUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(command: CreateLogEntryProps): Promise<void | Error> {
        try {
            const payload: CreateLogEntryPayload = {
                type: command.type,
                learningLanguageId: command.learningLanguageId,
            };

            if (command.metadata.content) {
                payload.content = command.metadata.content;
            }

            if (command.metadata.duration) {
                payload.duration = command.metadata.duration;
            }

            if (command.metadata.tandemFirstname) {
                payload.tandemFirstname = command.metadata.tandemFirstname;
            }

            if (command.metadata.tandemLastname) {
                payload.tandemLastname = command.metadata.tandemLastname;
            }

            if (command.metadata.partnerTandemId) {
                payload.partnerTandemId = command.metadata.partnerTandemId;
            }

            if (command.metadata.percentage !== undefined) {
                payload.percentage = command.metadata.percentage;
            }

            if (command.metadata.title) {
                payload.title = command.metadata.title;
            }

            if (command.createdAt) {
                payload.createdAt = command.createdAt;
            }

            if (command.metadata.date) {
                payload.createdAt = command.metadata.date;
            }

            if (command.metadata.gameName) {
                payload.gameName = command.metadata.gameName;
            }

            const httpResponse: HttpResponse<ActivityCommand> = await this.domainHttpAdapter.post(
                `/log-entries`,
                payload
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default CreateLogEntryUsecase;
