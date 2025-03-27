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

echo '--------------------------------------------------------------------------------Inject default data----------------------------------------------------------------------------------'
echo 'WEBLATE_SITE_DOMAIN : ' $WEBLATE_SITE_DOMAIN
apk update
apk add postgresql libpq curl jq

echo "Wait for api ..."

while [[ "$(curl -k -s -o /dev/null -w ''%{http_code}'' https://$WEBLATE_SITE_DOMAIN)" != "200" ]]; do sleep 5; done

echo "Get admin token"


ADMIN_TOKEN=$(psql -qtAX postgresql://$PSQL_USER:$PSQL_PASSWORD@$PSQL_HOST/$PSQL_DATABASE -c "select key from authtoken_token where user_id=2")
echo $ADMIN_TOKEN

echo "Create project"

project=$(cat /opt/scripts/projects.json)

echo $project

sed 's/%git_host%/'$GIT_HOST'/g' /opt/scripts/projects.json > /tmp/projects.json
sed 's/%git_host%/'$GIT_HOST'/g' /opt/scripts/api_components.json > /tmp/api_components.json
sed 's/%git_host%/'$GIT_HOST'/g' /opt/scripts/app_components.json > /tmp/app_components.json
sed 's/%git_host%/'$GIT_HOST'/g' /opt/scripts/emails_components.json > /tmp/emails_components.json
sed 's/%git_host%/'$GIT_HOST'/g' /opt/scripts/notifications_components.json > /tmp/notifications_components.json


PROJECT_RESPONSE=$(curl \
    -s \
    -d @/tmp/projects.json \
    -k \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Token $ADMIN_TOKEN" \
    https://$WEBLATE_SITE_DOMAIN/api/projects/)

echo $PROJECT_RESPONSE | jq

API_COMPONENT_RESPONSE=$(curl \
    -s \
    -k \
    --data-binary @/tmp/api_components.json \
    -H "Content-Type: application/json" \
    -H "Authorization: Token $ADMIN_TOKEN" \
    https://$WEBLATE_SITE_DOMAIN/api/projects/ulep/components/)

APP_COMPONENT_RESPONSE=$(curl \
    -s \
    -k \
    --data-binary @/tmp/app_components.json \
    -H "Content-Type: application/json" \
    -H "Authorization: Token $ADMIN_TOKEN" \
    https://$WEBLATE_SITE_DOMAIN/api/projects/ulep/components/)

EMAILS_COMPONENT_RESPONSE=$(curl \
    -s \
    -k \
    --data-binary @/tmp/emails_components.json \
    -H "Content-Type: application/json" \
    -H "Authorization: Token $ADMIN_TOKEN" \
    https://$WEBLATE_SITE_DOMAIN/api/projects/ulep/components/)

NOTIFICATIONS_COMPONENT_RESPONSE=$(curl \
    -s \
    -k \
    --data-binary @/tmp/notifications_components.json \
    -H "Content-Type: application/json" \
    -H "Authorization: Token $ADMIN_TOKEN" \
    https://$WEBLATE_SITE_DOMAIN/api/projects/ulep/components/)


echo "weblate OK"
