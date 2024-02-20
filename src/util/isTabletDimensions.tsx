import {useWindowDimensions} from 'react-native';

// function that returns a boolean representing if the device dimensions are tablet
export default function isTabletDimensions() {
    const {width} = useWindowDimensions();
    return width > 768;
}
