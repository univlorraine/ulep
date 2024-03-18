# Ulep android app

## Pre-requisites

In order to run application localy you'll need:

-   Java 17 installed and configured as current java version (`java --version` should print JDK 17)
-   Android SDK installed. Note that it is included when Android Studio is setup.

You'll need to connect to a device to deploy the application.
Either by using an emulator or by connecting to a physical device.

You can use [adb](https://developer.android.com/tools/adb) for that.

## Development

Create a `local.properties` file (you can use `sample.properties`) and indicate where your Android SDK is located.

```sh
pnpm build:android
```
