# did-siop
Self Issued OpenId Connect Provider for decentralized identity implemented as a browser add-on

## Compile
  * Install **browserify** using **npm i -g browserify** 
  * Run **browserify src/background.js -o dist/background.bundle.js** and **browserify src/inject.js -o dist/inject.bundle.js** at the root.
 
## Add to Chrome
  * Load dist folder to Chrome using **Load unpacked** in developer mode
