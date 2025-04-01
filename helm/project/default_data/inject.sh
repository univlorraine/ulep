# This script is launched after weblate installation.
# Its goal is to create ulep project into weblate with json template files.
echo '--------------------------------------------------------------------------------Inject default data----------------------------------------------------------------------------------'
echo 'WEBLATE_SITE_DOMAIN : ' $WEBLATE_SITE_DOMAIN
# Update container dependencies
apk update
apk add postgresql libpq curl jq

echo "Wait for api ..."
# Waiting for weblate api disponibilty
while [[ "$(curl -k -s -o /dev/null -w ''%{http_code}'' https://$WEBLATE_SITE_DOMAIN)" != "200" ]]; do sleep 5; done

#Get admin user token from database
echo "Get admin token"
ADMIN_TOKEN=$(psql -qtAX postgresql://$PSQL_USER:$PSQL_PASSWORD@$PSQL_HOST/$PSQL_DATABASE -c "select key from authtoken_token where user_id=2")
echo $ADMIN_TOKEN

echo "Create project"
project=$(cat /opt/scripts/projects.json)

echo $project
# In all of thoses files, modify the string %git_host% with the real git host.
sed 's/%git_host%/'$GIT_HOST'/g' /opt/scripts/projects.json > /tmp/projects.json
sed 's/%git_host%/'$GIT_HOST'/g' /opt/scripts/api_components.json > /tmp/api_components.json
sed 's/%git_host%/'$GIT_HOST'/g' /opt/scripts/app_components.json > /tmp/app_components.json
sed 's/%git_host%/'$GIT_HOST'/g' /opt/scripts/emails_components.json > /tmp/emails_components.json
sed 's/%git_host%/'$GIT_HOST'/g' /opt/scripts/notifications_components.json > /tmp/notifications_components.json

# create a project with weblate API
PROJECT_RESPONSE=$(curl \
    -s \
    -d @/tmp/projects.json \
    -k \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Token $ADMIN_TOKEN" \
    https://$WEBLATE_SITE_DOMAIN/api/projects/)

echo $PROJECT_RESPONSE | jq

# create a api component with weblate API
API_COMPONENT_RESPONSE=$(curl \
    -s \
    -k \
    --data-binary @/tmp/api_components.json \
    -H "Content-Type: application/json" \
    -H "Authorization: Token $ADMIN_TOKEN" \
    https://$WEBLATE_SITE_DOMAIN/api/projects/ulep/components/)

echo $API_COMPONENT_RESPONSE | jq

# create a app component with weblate API
APP_COMPONENT_RESPONSE=$(curl \
    -s \
    -k \
    --data-binary @/tmp/app_components.json \
    -H "Content-Type: application/json" \
    -H "Authorization: Token $ADMIN_TOKEN" \
    https://$WEBLATE_SITE_DOMAIN/api/projects/ulep/components/)

echo $APP_COMPONENT_RESPONSE | jq

# create a emails component with weblate API
EMAILS_COMPONENT_RESPONSE=$(curl \
    -s \
    -k \
    --data-binary @/tmp/emails_components.json \
    -H "Content-Type: application/json" \
    -H "Authorization: Token $ADMIN_TOKEN" \
    https://$WEBLATE_SITE_DOMAIN/api/projects/ulep/components/)

echo $EMAILS_COMPONENT_RESPONSE | jq


# create a notifications component with weblate API
NOTIFICATIONS_COMPONENT_RESPONSE=$(curl \
    -s \
    -k \
    --data-binary @/tmp/notifications_components.json \
    -H "Content-Type: application/json" \
    -H "Authorization: Token $ADMIN_TOKEN" \
    https://$WEBLATE_SITE_DOMAIN/api/projects/ulep/components/)
    
echo $NOTIFICATIONS_COMPONENT_RESPONSE | jq



echo "weblate OK"
