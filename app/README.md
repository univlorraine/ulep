# Ulep app

Ulep app is a Ionic application that provides a webapp, an android and an ios application Ulep.

## Pre-requisites

You'll need node.js >= 18 to run the project.

## Development

Install modules

```sh
pnpm install
```

Create an `.env` file (you can use [.env.exemple](.env.exemple) for that) and configure the adequate values.

### Web app

Start dev server

```sh
pnpm dev
```

Otherwise, you can build and preview server (no hot reload)

```sh
pnpm build
pnpm preview
```

### Android app

See dedicated [README](./android/README.md)

### IOS

TODO

## Run tests

Unit tests

```sh
pnpm test.unit
```

End to end tests (cypress tests):

```sh
pnpm test.e2e
```

## Lint

```sh
pnpm lint
```

# Android

## Requirements to install app locally

-   Java 17 installed and configured as your shell Java version
-   Android SDK installed

## Install app

Create a `local.properties` file in [android folder](./android/) and set sdk path

```sh
# For mac
sdk.dir=/Users/<username>/Library/Android/sdk
```

Note that the env variables need to be accessible on the network.
Remember to use your host IP in [.env file](.env)

When connected to your android device or emulator, run

```sh
pnpm build:android
```

## Debug

You can see remote targets and open debugger through `chrome://inspect/#devices`
