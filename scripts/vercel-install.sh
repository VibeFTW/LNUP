#!/bin/bash
npm install
mkdir -p node_modules/react-native-worklets
echo 'module.exports=function(){return{visitor:{}}};' > node_modules/react-native-worklets/plugin.js
echo '{"name":"react-native-worklets","version":"1.0.0","main":"plugin.js"}' > node_modules/react-native-worklets/package.json
