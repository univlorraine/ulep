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
