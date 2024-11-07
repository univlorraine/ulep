# This script is launched just after git pod is available
# It will create a repo and create the post-receive hook ( who will pushed its content into Minio)

echo '- init git'
# Update container dependencies
apk add git openssh sshpass bash

# create a new repo 
echo '- Init depo'
sshpass -p $GIT_PASSWORD ssh -o StrictHostKeyChecking=no git@$GIT_HOST -p 2222 "mkdir /srv/git/locales.git"
sshpass -p $GIT_PASSWORD ssh -o StrictHostKeyChecking=no git@$GIT_HOST -p 2222 "git-init --bare /srv/git/locales.git"

# cloning this new repo (we can't modify a repo from the server)
cd /tmp
sshpass -p $GIT_PASSWORD git clone ssh://git@$GIT_HOST:2222/srv/git/locales.git
cd locales

# create folder into repo who has been cloned
mkdir ./fr
mkdir ./en
mkdir ./de
mkdir ./es
mkdir ./zh

# copy default translation files (default files are in locales folder).
cp /opt/scripts/fr/*.json ./fr/
cp /opt/scripts/en/*.json ./en/
cp /opt/scripts/de/*.json ./de/
cp /opt/scripts/es/*.json ./es/
cp /opt/scripts/zh/*.json ./zh/

# Add default identification
git config --global user.email "you@example.com"
git config --global user.name "Your Name"

# Commit and push translations files into develop & master
git add .
git commit -a -m "init repo"
sshpass -p $GIT_PASSWORD git push --set-upstream origin master

git checkout -b develop
sshpass -p $GIT_PASSWORD git push --set-upstream origin develop

# Wait for weblate ssh keys : /tmp/weblate is a shared volume between weblate and git
until [ -f /tmp/weblate/ssh/id_rsa.pub ]
do
     sleep 5
done
echo "ID_RSA found"

# Add ssh keys to git authorized keys
echo '- Add ssh key to repo'
chmod 600 /tmp/git/authorized_keys
chmod 700 /tmp/git
cat /tmp/weblate/ssh/id_rsa.pub >> /tmp/git/authorized_keys

echo 'git ready to be used'

# Install minio client
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
mv mc /usr/local/bin/

# Generate post-receive hook
echo "- Generate post-receive hooks"
GIT_SSH_COMMAND='GIT_SSH_COMMAND="sshpass -p '$GIT_PASSWORD' ssh -oStrictHostKeyChecking=no"'
GIT_SSH_VARIANT='GIT_SSH_VARIANT="ssh"'
GIT_TMP_PATH=/tmp/locales

# Create post-receive file (the hook)
touch /srv/git/locales.git/hooks/post-receive;
# Allow it to be executed
chmod a+x /srv/git/locales.git/hooks/post-receive;



# Here we will write the content of post receive hook
echo -e "#!/bin/sh
# Create credentials with minio client
mc alias set deploy http://$MINIO_HOST:9000 $MINIO_ACCESS_KEY $MINIO_SECRET_KEY

# remove old git clonin
cd /tmp/

if [ ! -d /tmp/locales ]; then
     $GIT_SSH_COMMAND $GIT_SSH_VARIANT git -C /tmp clone --branch develop ssh://git@$GIT_HOST:2222/srv/git/locales.git
else
     cd /tmp/locales
     git reset --hard
     git pull
fi


# wait cloning end
until [ -f /tmp/locales/fr/api.json ]
do
sleep 5
done

# upload content of cloning to minio
mc mirror --overwrite $GIT_TMP_PATH "deploy/i18n" && mc anonymous set public "deploy/i18n"
" >> /srv/git/locales.git/hooks/post-receive;

# Change owning of post-receive hooks
chown git:git /srv/git/locales.git/hooks/post-receive;

echo '- Repo ready';
