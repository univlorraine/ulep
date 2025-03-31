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

ARG JITSI_REPO=jitsi
ARG BASE_TAG=latest
FROM ${JITSI_REPO}/base-java:${BASE_TAG}

LABEL org.opencontainers.image.title="Jitsi Broadcasting Infrastructure (jibri)"
LABEL org.opencontainers.image.description="Components for recording and/or streaming a conference."
LABEL org.opencontainers.image.url="https://github.com/jitsi/jibri"
LABEL org.opencontainers.image.source="https://github.com/jitsi/docker-jitsi-meet"
LABEL org.opencontainers.image.documentation="https://jitsi.github.io/handbook/"

ARG USE_CHROMIUM=0
#ARG CHROME_RELEASE=latest
# https://googlechromelabs.github.io/chrome-for-testing/
ARG CHROME_RELEASE=121.0.6167.85

COPY rootfs/ /

RUN apt-dpkg-wrap apt-get update && \
    apt-dpkg-wrap apt-get install -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" jibri libgl1-mesa-dri procps jitsi-upload-integrations jitsi-autoscaler-sidecar jq pulseaudio dbus dbus-x11 rtkit unzip fonts-noto && \
    /usr/bin/install-chrome.sh && \
    apt-cleanup && \
    adduser jibri rtkit && \
    dpkgArch="$(dpkg --print-architecture)" && \
    case "${dpkgArch##*-}" in \
        "amd64") SC_ARCH=x86_64 ;; \
        "arm64") SC_ARCH=aarch64 ;; \
        *) echo "unsupported architecture"; exit 1 ;; \
    esac && \
    wget -qO /usr/bin/shm-check https://github.com/saghul/shm-check/releases/download/v1.0.0/shm-check-${SC_ARCH} && \
    chmod +x /usr/bin/shm-check

VOLUME /config
