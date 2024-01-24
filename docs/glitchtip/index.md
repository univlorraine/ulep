# Setting Up Glitchtip Error Monitoring

Glitchtip, an open-source exception monitoring system akin to Sentry, captures errors reported by your applications. This enables real-time error discovery and provides insights into the health of your applications.

## Configuration

Let's begin by assembling the Glitchtip components. For detailed information about these configuration options, refer to their [documentation](https://glitchtip.com/documentation/install#configuration).

Start by copying the `values.yaml.tmp` file from the `helm/glitchtip` directory:

```bash
cp helm/glitchtip/values.yaml.tmp helm/glitchtip/values.yaml
```

Then, edit the `helm/glitchtip/values.yaml` file and modify the following values:

- `GLITCHTIP_DOMAIN`: The URL of your Glitchtip server (e.g., https://glitchtip.example.com)
- `EMAIL_URL`: The SMTP server to send emails (e.g., smtp://user:password@smtp_url:port)
- `DEFAULT_FROM_EMAIL`: The email address used as the sender
- `SECRET_KEY`: A randomly generated string for encrypting data

> [!TIP]
> Generate a random string using this command: `openssl rand -hex 32`

> [!WARNING]
> For security, change the `redis.auth.redis` and `postgresql.auth.postgresPassword` values.

> [!IMPORTANT]
> Remember to replace `&domain` with your actual domain name.

## Deploying

After updating your configuration, launch Glitchtip:

```bash
helm install ulep-glitchtip helm/glitchtip --namespace [namespace]
```

Once all services are up, you should be able to access the Glitchtip dashboard at your configured URL.

![Glitchtip Login](glitchtip_login.png)

Since `ENABLE_USER_REGISTRATION` is set to True, user registration is possible.

![Glitchtip Register](glitchtip_register.png)

After registration, you'll be logged in and directed to the organization creation page.

![Glitchtip Organization](glitchtip_organization.png)

Upon creating an organization, you'll be redirected to the project creation page.

![Glitchtip no project view](glitchtip_no_project.png)

> [!NOTE]
> After signing up, you can disable `ENABLE_USER_REGISTRATION` by setting it to False in the `values.yaml` and then running helm upgrade `helm upgrade ulep-glitchtip helm/glitchtip --namespace [namespace]`

## Project Configuration

Now, proceed to create the application you wish to monitor.

### API

Choose NodeJs, and create a new team:

![Glitchtip Create Team](glitchtip_team.png)

After the team is created and selected, name your service.

![Glitchtip API Project Panel](glitchtip_api.png)

Upon creating your project, you'll receive a guide on configuring your application.

![Glitchtip Api Guide](glitchtip_api_guide.png)

On the right-hand side, you'll find configuration values, which we'll use as environment variables in our application to report errors to Glitchtip:
- `http://a25da3a9424e4b278ca4f41708842ebb@localhost:8000/1`

### Web Application

Under the same organization, create a new project for the web application and associate it with the team you created.

![Glitchtip PWA Project Panel](glitchtip_pwa.png)

### Admin Application

Repeat the same steps for the admin application.

![Glitchtip Admin Project Panel](glitchtip_admin.png)

Now, update our applications to include the Glitchtip DSN in the environment variables.

For this, modify the `helm/project/values.yaml` file for each application with the respective environment variable:

- `api.env.sentryDsn`: The DSN from the API project
- `admin.env.sentryDsn`: The DSN from the Admin project
- `webapp.env.viteSentryDsn`: The DSN from the PWA project

After updating the values, deploy the applications:

```bash
helm upgrade ulep helm/project --namespace [namespace]
```

## Issues

To view errors in Glitchtip, select your project(s) from the issues view. Here, you can see the errors emitted from your application.

![Glitchtip Issue](glitchtip_issues.png)

The error details, such as stack trace, user agent info, and request path, are displayed.

![Glitchtip Issue](glitchtip_issue.png)

> [!NOTE]
> Errors are grouped by their stack trace. This means that if the same error occurs multiple times, it will be grouped under the same issue.

## Alerting

Set up alerting to be notified every time an exception occurs. In your project's settings, choose `Create New Alert`.

Selecting `Create New Alert` opens the alert configuration. By default, alerts are sent to the email addresses of the project team members.

![Glitchtip Project Alerts](glitchtip_project_alerts.png)

> [!TIP]
> Alerts can also be configured to be sent to Slack, Discord, etc., by adding more recipients.

Happy monitoring!