#
#   Copyright ou © ou Copr. Université de Lorraine, (2025)
#
#   Direction du Numérique de l'Université de Lorraine - SIED
#
#   Ce logiciel est un programme informatique servant à rendre accessible
#   sur mobile et sur internet l'application ULEP (University Language
#   Exchange Programme) aux étudiants et aux personnels des universités
#   parties prenantes.
#
#   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
#   et respectant les principes de diffusion des logiciels libres. Vous pouvez
#   utiliser, modifier et/ou redistribuer ce programme sous les conditions
#   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
#   sur le site "http://cecill.info".
#
#   En contrepartie de l'accessibilité au code source et des droits de copie,
#   de modification et de redistribution accordés par cette licence, il n'est
#   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
#   seule une responsabilité restreinte pèse sur l'auteur du programme, le
#   titulaire des droits patrimoniaux et les concédants successifs.
#
#   À cet égard, l'attention de l'utilisateur est attirée sur les risques
#   associés au chargement, à l'utilisation, à la modification et/ou au
#   développement et à la reproduction du logiciel par l'utilisateur étant
#   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
#   manipuler et qui le réserve donc à des développeurs et des professionnels
#   avertis possédant des connaissances informatiques approfondies. Les
#   utilisateurs sont donc invités à charger et à tester l'adéquation du
#   logiciel à leurs besoins dans des conditions permettant d'assurer la
#   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
#   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
#
#   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
#   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
#   termes.
#

#syntax=docker/dockerfile:1.4

# Base node image with pnpm enabled
FROM node:18-alpine3.20 as admin_base

RUN apk add --no-cache libc6-compat

WORKDIR /srv/app

ENV COREPACK_DEFAULT_TO_LATEST=0
RUN corepack enable && \
	corepack prepare --activate pnpm@10.0.0 && \
	pnpm config -g set store-dir /.pnpm-store

# Deps stage
FROM admin_base AS admin_deps

COPY --link pnpm-lock.yaml ./
RUN pnpm fetch

COPY --link . .
RUN pnpm install --offline --frozen-lockfile

# Development image
FROM admin_deps as admin_dev

EXPOSE 3000
ENV PORT 3000

CMD ["pnpm", "start"]

# Build stage
FROM admin_base AS admin_builder
WORKDIR /srv/app

COPY --link . .
COPY --from=admin_deps --link /srv/app/node_modules ./node_modules

RUN pnpm run build

FROM admin_builder AS admin_prod

ENV NODE_ENV production

RUN addgroup -S -g 1001 nodejs
RUN adduser -S -u 1001 nestjs
RUN npm i -g serve

EXPOSE 80

ENV PORT 80

CMD ["bash", "-c", "serve -s build -l 80"]