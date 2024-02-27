import {
    Camera,
    useCameraDevice,
    useCameraPermission,
} from 'react-native-vision-camera';

const CameraScreen = () => {
    const {hasPermission, requestPermission} = useCameraPermission();
    const device = useCameraDevice('back');

    if (!hasPermission) {
        requestPermission()
            .then(value => {
                if (!value) {
                    throw new Error('Camera permission not granted');
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    if (device == null) {
        return null;
    }
    return <Camera style={{flex: 1}} device={device} isActive={true} />;
};

export default CameraScreen;
