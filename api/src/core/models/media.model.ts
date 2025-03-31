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

import { v4 } from 'uuid';
import { ContentTypeException } from '../errors/content-type.exception';

export interface MediaObjectProps {
  id: string;
  name: string;
  bucket: string;
  mimetype: string;
  size: number;
}

const DEFAULT_BUCKET = 'images';

export class MediaObject {
  readonly id: string;

  readonly name: string;

  readonly bucket: string;

  readonly mimetype: string;

  readonly size: number;

  constructor(props: { id: string } & MediaObjectProps) {
    this.id = props.id;
    this.name = props.name;
    this.bucket = props.bucket;
    this.mimetype = props.mimetype;
    this.size = props.size;
  }

  static generate(
    file: Express.Multer.File,
    bucketName = DEFAULT_BUCKET,
    preferredId = undefined,
  ): MediaObject {
    const id = preferredId || v4();
    const name = this.getFileName(id, file.mimetype);

    return new MediaObject({
      id,
      name,
      bucket: bucketName,
      mimetype: file.mimetype,
      size: file.size,
    });
  }

  static getDefaultBucket() {
    return DEFAULT_BUCKET;
  }

  static getFileName(id: string, mimetype: string): string {
    const extension = this.getFileExtension(mimetype);
    return `${id}${extension}`;
  }

  private static getFileExtension(contentType: string): string {
    switch (contentType) {
      // image mime types
      case 'image/png':
        return '.png';
      case 'image/jpg':
        return '.jpg';
      case 'image/jpeg':
        return '.jpeg';
      case 'image/svg+xml':
        return '.svg';
      // audio mime types
      case 'audio/mpeg':
        return '.mp3';
      case 'audio/wav':
        return '.wav';
      case 'audio/ogg':
        return '.ogg';
      case 'audio/mp4':
        return '.mp4';
      // Document mime types
      case 'application/pdf':
        return '.pdf';
      case 'application/msword':
        return '.doc';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return '.docx';
      case 'application/vnd.ms-powerpoint':
        return '.ppt';
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        return '.pptx';
      case 'application/vnd.ms-excel':
        return '.xls';
      default:
        throw new ContentTypeException(contentType);
    }
  }
}
