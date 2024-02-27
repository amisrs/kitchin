/**
 * @format
 */

import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { decode, encode } from 'base-64'
import Realm from "realm";
Realm.flags.THROW_ON_GLOBAL_REALM = true
if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}
AppRegistry.registerComponent(appName, () => App);
