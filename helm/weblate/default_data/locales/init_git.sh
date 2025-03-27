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

echo '- init git'
apk add git openssh sshpass bash

echo '- Wait for ssh daemon pod'

until sshpass -p $GIT_PASSWORD ssh -o StrictHostKeyChecking=no git@$GIT_HOST -p 2222 2> /dev/null
  do
    sleep 5
  done

echo '- Init depo'
sshpass -p $GIT_PASSWORD ssh -o StrictHostKeyChecking=no git@$GIT_HOST -p 2222 "mkdir /srv/git/locales.git"
sshpass -p $GIT_PASSWORD ssh -o StrictHostKeyChecking=no git@$GIT_HOST -p 2222 "git-init --bare /srv/git/locales.git"



cd /tmp
sshpass -p $GIT_PASSWORD git clone ssh://git@$GIT_HOST:2222/srv/git/locales.git
cd locales

mkdir ./fr
mkdir ./en
mkdir ./de
mkdir ./es
mkdir ./zh

cp /opt/scripts/fr/*.json ./fr/
cp /opt/scripts/en/*.json ./en/
cp /opt/scripts/de/*.json ./de/
cp /opt/scripts/es/*.json ./es/
cp /opt/scripts/zh/*.json ./zh/

git config --global user.email "you@example.com"
git config --global user.name "Your Name"

git add .
git commit -a -m "init repo"
sshpass -p $GIT_PASSWORD git push --set-upstream origin master

git checkout -b develop
sshpass -p $GIT_PASSWORD git push --set-upstream origin develop


until [ -f /tmp/weblate/ssh/id_rsa.pub ]
do
     sleep 5
done
echo "ID_RSA found"

echo '- Add ssh key to repo'

chmod 600 /tmp/git/authorized_keys
chmod 700 /tmp/git

cat /tmp/weblate/ssh/id_rsa.pub >> /tmp/git/authorized_keys

echo 'git ready to be used'


wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
mv mc /usr/local/bin/


echo "- Generate post-receive hooks"


GIT_SSH_COMMAND='GIT_SSH_COMMAND="sshpass -p '$GIT_PASSWORD' ssh -oStrictHostKeyChecking=no"'
GIT_SSH_VARIANT='GIT_SSH_VARIANT="ssh"'
GIT_TMP_PATH=/tmp/locales

touch /srv/git/locales.git/hooks/post-receive;
chmod a+x /srv/git/locales.git/hooks/post-receive;



echo -e "#!/bin/sh
mc alias set deploy http://$MINIO_HOST:9000 $MINIO_ACCESS_KEY $MINIO_SECRET_KEY
cd /tmp/
rm -rf /tmp/locales
$GIT_SSH_COMMAND $GIT_SSH_VARIANT git -C /tmp clone --branch develop ssh://git@$GIT_HOST:2222/srv/git/locales.git
until [ -f /tmp/locales/fr/api.json ]
do
sleep 5
done
mc mirror --overwrite $GIT_TMP_PATH "deploy/i18n" && mc anonymous set public "deploy/i18n"
" >> /srv/git/locales.git/hooks/post-receive;

chown git:git /srv/git/locales.git/hooks/post-receive;

echo '- Repo ready';
