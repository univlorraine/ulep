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
