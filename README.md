Hydra WirelessHART Hero
==

Description
--
A flashy sales tool for demonstrating WirelessHART gateway instrumentation.

Intended Workflow
--
1. A user will walk up to a site where a WirelessHART mesh exists as identified by Estimote Bluetooth LE beacons.
1. The beacons will identify to the smartphone application which Wifi credentials to use, and which Gateway credentials to use.
1. The smartphone app will **automatically in the background with no user interaction** enable WiFi, connect to the WiFi network, connect to the Gateway, and begin parsing data once every 30 seconds for all transmitters:
  - instantaneous value for all HART variables (PV, SV, TV, QV)
  - neighboring MAC addresses
1. In the event the user pulls their phone out of their pocket and opens the app, the foreground UI of the app will contain a menu allowing the user to:
  - View a list of every WirelessHART transmitter by short name and MAC address
  - View a D3.js visualization of the WirelessHART mesh and all interconnections between each transmitter and its neighbors
  - View a transmitter. For any individual transmitter, the user should be given a second menu allowing them to:
    - View current instantaneous values of all 4 HART variables at once, side-by-side
    - View a D3.js trendline graph for any one of the 4 HART variables, since data started collecting.
  - (Optional) Search for a WirelessHART transmitter.
1. If the user walks away from the beacon, the app should stop data collection and disconnect from the WiFi associated with that beacon.

Technologies
--
- Ionic w/Cordova plugins for controlling WiFi connection and collecting data from WirelessHART gateways.
- AngularJS
- D3.js

License
==
[GPLv3](https://www.gnu.org/copyleft/gpl.html)
