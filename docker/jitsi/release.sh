#!/bin/bash
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


set -e

# Don't start a release if the tree is dirty
#

if [[ ! -z $(git status -s) ]]; then
    echo "Git tree is not clean, aborting release!"
    exit 1
fi

# Get version and branch (we only do stable for now)
#

V="$1"
RELEASE="${2:-stable}"

if [[ -z $V ]]; then
    echo "A version must be specified!"
    exit 1
fi

VERSION="${RELEASE}-${V}"
echo "Releasing ${VERSION}"

if git rev-parse "${VERSION}" >/dev/null 2>&1; then
    echo "Tag for such version already exists!"
    exit 1
fi

# Prepare changelog
#

LAST_VERSION=$(git describe --tags --abbrev=0)
CHANGES=$(git log --oneline --no-decorate --no-merges ${LAST_VERSION}..HEAD --pretty=format:"%x2a%x20%h%x20%s")

echo "Changelog:"
echo "$CHANGES"

# Tag Docker images and push them to DockerHub
#

JITSI_BUILD=${VERSION} JITSI_RELEASE=${RELEASE} make release

# Changelog
#

echo -e "## ${VERSION}\n\nBased on ${RELEASE} release ${V}.\n\n${CHANGES}\n" > tmp
cat CHANGELOG.md >> tmp
mv tmp CHANGELOG.md

# Set specific image tags in compose files
#

sed -i "" -e "s/unstable/${VERSION}/" *.yml

# Commit all changes and tag the repo
#

git commit -a -m "release: ${VERSION}" -m "${CHANGES}"
git tag -a "${VERSION}" -m "release" -m "${CHANGES}"

# Revert back to "unstable" for development
#

sed -i "" -e "s/${VERSION}/unstable/" *.yml

git commit -a -m "misc: working on unstable"

# Push all changes and tags
#

git push
git push --tags
