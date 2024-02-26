import {
    Camera,
    useCameraDevice,
    useCameraPermission,
} from 'react-native-vision-camera';

const CameraScreen = () => {
    const {hasPermission, requestPermission} = useCameraPermission();
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
    if (hasPermission) {
        const device = useCameraDevice('back');
        if (device == null) {
            return null;
        }
        return <Camera device={device} isActive={true} />;
    } else {
        return null;
    }
};

export default CameraScreen;
