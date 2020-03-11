# did-siop
Self Issued OpenId Connect Provider for decentralized identity implemented as a browser add-on

Add to Chrome
  * Install **browserify** using **npm i -g browserify** 
  * Run **browserify src/background.js -o dist/_background.js** and **browserify src/inject.js -o dist/_inject.js** at the root.
  * Load dist folder to Chrome using 'Load unpacked' in developer mode
