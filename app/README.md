Getting Started
--
1. Run the following:

  `npm install -g ionic cordova ios-sim`

2. Use `android` to open the Android GUI and install the latest `Android SDK
   Platform-tools`, and `Android SDK Build-tools`. If you're on an Intel-based
   machine, it is recommended to only install the Intel x86 emulator support,
   and HAXM. See
   http://developer.android.com/tools/devices/emulator.html#accel-vm for
   details.

3. Run the following:

  `bower install`

  followed by:

  `ionic platform add ios && ionic platform add android`

4. Now you can build.

  - iOS

    `ionic build ios && ionic emulate ios`

  - Android

    You will need to define an android virtual device. Run `android avd` and
    configure one. Then:

    `ionic build android && ionic emulate android`
