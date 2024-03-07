import {Dimensions, Platform} from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

export const SCREEN_HEIGHT = Platform.select<number>({
    android: Dimensions.get('screen').height,
    ios: Dimensions.get('window').height,
}) as number;

export const SCREEN_WIDTH = Dimensions.get('window').width;
// Capture Button
export const CAPTURE_BUTTON_SIZE = 78;
