echo '--------------------------------------------------------------------------------Inject default data----------------------------------------------------------------------------------'
echo 'WEBLATE_SITE_DOMAIN : ' $WEBLATE_SITE_DOMAIN
apk update
apk add postgresql libpq curl jq

echo "Wait for api ..."

while [[ "$(curl -k -s -o /dev/null -w ''%{http_code}'' https://$WEBLATE_SITE_DOMAIN)" != "200" ]]; do sleep 5; done

echo "Get admin token"

ADMIN_TOKEN=$(psql -qtAX postgresql://$PSQL_USER:$PSQL_PASSWORD@$WEBLATE_POSTGRESQL_SERVICE_HOST/$PSQL_DATABASE -c "select key from authtoken_token where user_id=2")

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

echo "weblate OK"