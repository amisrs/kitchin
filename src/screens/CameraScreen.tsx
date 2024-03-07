import {
    Camera,
    PhotoFile,
    VideoFile,
    useCameraDevice,
    useCameraPermission,
} from 'react-native-vision-camera';
import {CaptureButton} from '../components/Camera/CaptureButton';
import {useCallback, useContext, useRef, useState} from 'react';
import {useSharedValue} from 'react-native-reanimated';
import {StyleSheet, View} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import {CameraContext} from '../components/Camera/CameraContext';
import {AddItemModalContext} from '../components/AddItemModalContext';

const CameraScreen = () => {
    const {hasPermission, requestPermission} = useCameraPermission();
    const device = useCameraDevice('back');
    const camera = useRef<Camera>(null);
    const zoom = useSharedValue(1);
    const {isCameraActive, setIsCameraActive} = useContext(CameraContext);
    const {isModalActive, setIsModalActive} = useContext(AddItemModalContext);

    const [isCameraInitialized, setIsCameraInitialized] = useState(false);
    const onInitialized = useCallback(() => {
        console.log('Camera initialized!');
        setIsCameraInitialized(true);
    }, []);

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
    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                flex: 1,
                // height: 800,
                width: 'auto',
                zIndex: 99999,
                borderRadius: 4,
                backgroundColor: 'green',

                borderColor: 'red',
                display: isCameraActive ? 'flex' : 'none',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Camera
                style={[
                    {
                        borderRadius: 16,
                        borderColor: 'red',
                        width: '100%',
                        height: '70%',
                    },
                ]}
                device={device}
                isActive={isCameraActive}
                photo={true}
                ref={camera}
                resizeMode="cover"
                onInitialized={onInitialized}
            />
            <IconButton
                style={{
                    position: 'absolute',
                    zIndex: 9999999999,
                    elevation: 10,
                }}
                mode="contained"
                onPress={() => {
                    setIsCameraActive(false);
                    setIsModalActive(true);
                }}
                icon={'account-arrow-left'}
            />

            <CaptureButton
                style={{position: 'absolute', bottom: 0, left: 0, right: 0}}
                camera={camera}
                onMediaCaptured={function (
                    media: PhotoFile | VideoFile,
                    type: 'photo' | 'video',
                ): void {
                    throw new Error('Function not implemented.');
                }}
                minZoom={0}
                maxZoom={0}
                cameraZoom={zoom}
                flash={'off'}
                enabled={isCameraInitialized}
                setIsPressingButton={function (
                    isPressingButton: boolean,
                ): void {
                    throw new Error('Function not implemented.');
                }}
            />
        </View>
    );
};

export default CameraScreen;
