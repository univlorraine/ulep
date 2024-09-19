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

PROJECT_RESPONSE=$(curl \
    -s \
    -d @/opt/scripts/projects.json \
    -k \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Token $ADMIN_TOKEN" \
    https://$WEBLATE_SITE_DOMAIN/api/projects/)

echo $PROJECT_RESPONSE | jq

API_COMPONENT_RESPONSE=$(curl \
    -s \
    -k \
    --data-binary @/opt/scripts/api_components.json \
    -H "Content-Type: application/json" \
    -H "Authorization: Token $ADMIN_TOKEN" \
    https://$WEBLATE_SITE_DOMAIN/api/projects/ulep/components/)

APP_COMPONENT_RESPONSE=$(curl \
    -s \
    -k \
    --data-binary @/opt/scripts/app_components.json \
    -H "Content-Type: application/json" \
    -H "Authorization: Token $ADMIN_TOKEN" \
    https://$WEBLATE_SITE_DOMAIN/api/projects/ulep/components/)

EMAILS_COMPONENT_RESPONSE=$(curl \
    -s \
    -k \
    --data-binary @/opt/scripts/emails_components.json \
    -H "Content-Type: application/json" \
    -H "Authorization: Token $ADMIN_TOKEN" \
    https://$WEBLATE_SITE_DOMAIN/api/projects/ulep/components/)

NOTIFICATIONS_COMPONENT_RESPONSE=$(curl \
    -s \
    -k \
    --data-binary @/opt/scripts/emails_notifications.json \
    -H "Content-Type: application/json" \
    -H "Authorization: Token $ADMIN_TOKEN" \
    https://$WEBLATE_SITE_DOMAIN/api/projects/ulep/components/)


echo "weblate OK"
