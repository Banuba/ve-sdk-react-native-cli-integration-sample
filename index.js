/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Import AudioBrowser React Native component
import AudioBrowser from './AudioBrowser';

AppRegistry.registerComponent(appName, () => App);

// Register AudioBrowser component.
AppRegistry.registerComponent('audio_browser', () => AudioBrowser);
