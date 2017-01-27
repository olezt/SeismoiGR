# SeismoiGR

## Apache cordova / Ionic / AngularJS Application

## Live interpretation of earthquakes Worldwide

**Author: olezt**

### Description

This application is a hybrid application that is designed to illustrate 
the activity of earthquakes worldwide in real time. Technologies used are Apache cordova, Ionic and AngularJS frameworksm, Javascript and HTML5. Currently supports Greek and English.

Data are retrieved from http://www.seismicportal.eu only for educational purposes.

**All interesting files concerning the implementation are at /www folder :D**


### Setup environment for development - Requirements

1. Install Node.js https://nodejs.org/en/
2. Install git https://git-scm.com/
3. Install AngularJS https://angularjs.org/
4. Install Apache Cordova https://cordova.apache.org/
5. Install Ionic http://ionicframework.com/

### Cordova plugins used

**Whitelist plugin** <br />
https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-whitelist/<br />
Used to enable Cross origin requests.<br />
**Network Information Plugin**<br />
https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-network-information/index.html <br />
Used to access information on device's network state.<br />

### Map implementation

**GoogleMap AngularJS Directive** <br />
https://github.com/allenhwkim/angularjs-google-maps
Used to integrate with Google Maps Api the angular way.

### Google API used

**Google Maps Javascript API**<br />
Used to create the google maps object.<br />
