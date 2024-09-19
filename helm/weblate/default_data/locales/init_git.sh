echo 'init git'
apk add git openssh sshpass


sshpass -p 12345 ssh -o StrictHostKeyChecking=no git@ulep-weblate-git -p 2222 "mkdir /srv/git/locales.git"
sshpass -p 12345 ssh -o StrictHostKeyChecking=no git@ulep-weblate-git -p 2222 "git-init --bare /srv/git/locales.git"



cd /tmp
sshpass -p 12345 git clone ssh://git@ulep-weblate-git:2222/srv/git/locales.git
cd locales

mkdir ./fr
mkdir ./en
mkdir ./de
mkdir ./es
mkdir ./zh

cp /opt/scripts/fr/*.json ./fr/
cp /opt/scripts/en/*.json ./en/
cp /opt/scripts/en/*.json ./de/
cp /opt/scripts/en/*.json ./es/
cp /opt/scripts/en/*.json ./zh/

git config --global user.email "you@example.com"
git config --global user.name "Your Name"

git add .
git commit -a -m "init repo"
sshpass -p 12345 git push --set-upstream origin master

git checkout -b develop
sshpass -p 12345 git push --set-upstream origin develop


until [ -f /tmp/weblate/ssh/id_rsa.pub ]
do
     sleep 5
done
echo "ID_RSA found"

chmod 600 /tmp/git/authorized_keys
chmod 700 /tmp/git

cat /tmp/weblate/ssh/id_rsa.pub >> /tmp/git/authorized_keys

echo 'git ready to be used'
