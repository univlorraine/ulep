#syntax=docker/dockerfile:1.4
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



# Runtime base: what the running application needs, and nothing else
FROM node:22-alpine3.20 AS api_runtime

# install openssl - resolves the issue with the prisma client
RUN apk update && apk upgrade
RUN apk add --no-cache openssl

# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

WORKDIR /srv/app

# Tooling base: adds pnpm for the stages that install and build
FROM api_runtime AS api_base

ENV COREPACK_DEFAULT_TO_LATEST=0
# pnpm 11 refuse `config -g set` si le repertoire bin global n'est pas dans le PATH.
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME/bin:$PATH
RUN corepack enable && \
	corepack prepare --activate pnpm@11.24.0 && \
	pnpm config -g set store-dir /.pnpm-store

# Deps stage, preserve dependencies in cache as long as the lockfile isn't changed
FROM api_base AS api_deps

COPY --link pnpm-lock.yaml ./
RUN pnpm fetch

COPY --link . .
RUN pnpm install --offline --frozen-lockfile
RUN pnpm prisma generate

# Development image
FROM api_deps as api_dev

EXPOSE 3000
ENV PORT 3000

CMD ["sh", "-c", "pnpm start:dev"]

# Build stage: compile, then drop the devDependencies so that the production
# image only carries what `node dist/main` needs. The generated prisma client
# lives inside @prisma/client (a runtime dependency) and survives the prune.
FROM api_deps AS api_builder

RUN pnpm run build
RUN pnpm prune --prod

# Production image: start again from the runtime base and copy only what the
# application needs. pnpm, the pnpm store, the sources, the tests and the
# devDependencies stay in the tooling layers and never reach the image.
FROM api_runtime AS api_prod

ENV NODE_ENV production

RUN addgroup -S -g 1001 nodejs
RUN adduser -S -u 1001 nestjs

COPY --from=api_builder --link /srv/app/package.json ./
COPY --from=api_builder --link /srv/app/node_modules ./node_modules
COPY --from=api_builder --link /srv/app/dist ./dist
# Read at runtime by the mailer, relative to the working directory
COPY --from=api_builder --link /srv/app/templates ./templates

USER nestjs

EXPOSE 3000

ENV PORT 3000

# Same as `pnpm run start:prod`, without pnpm: as a non-root user pnpm 11 would
# first download itself through corepack, then try to reinstall the
# dependencies in the read-only /srv/app before running the script.
CMD ["node", "dist/main"]

# Init image: runs the migrations and the seed, so it needs the full toolchain
FROM api_deps AS api_init

RUN apk add --no-cache postgresql

CMD ["sh", "-c", "set -x; while [ $(pg_isready -d $DB_NAME -h $HOST_NAME -p 5432 -U $DB_USER -q; echo $?) -ne 0 ]; do sleep 5; done; pnpm dlx prisma@4.16.2 migrate deploy; if [ $(psql -tA -d $DB_NAME -h $HOST_NAME -p 5432 -U $DB_USER -c \"SELECT COUNT(*) FROM language_codes;\") -ne 0 ]; then echo \"No need to seed\"; else pnpm seed; fi"]
