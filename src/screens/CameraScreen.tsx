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
import {Button, IconButton, useTheme} from 'react-native-paper';
import {CameraContext} from '../components/Camera/CameraContext';
import {AddItemModalContext} from '../components/AddItemModalContext';

const CameraScreen = () => {
    const {hasPermission, requestPermission} = useCameraPermission();
    const device = useCameraDevice('back');
    const camera = useRef<Camera>(null);
    const zoom = useSharedValue(1);
    const theme = useTheme();
    const {
        isCameraActive,
        setIsCameraActive,
        photo,
        setPhoto,
        openModalAfterCapture,
        setOpenModalAfterCapture,
        onCapture,
        setOnCapture,
    } = useContext(CameraContext);
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
                backgroundColor: theme.colors.surface,
                zIndex: 99999,
                display: isCameraActive ? 'flex' : 'none',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Camera
                style={[
                    {
                        position: 'relative',
                        // borderRadius: 16,
                        // borderColor: 'red',
                        width: '100%',
                        height: '100%',
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
                    bottom: '10%',
                    left: '20%',
                }}
                mode="contained"
                onPress={() => {
                    setIsCameraActive(false);
                    setIsModalActive(true);
                }}
                icon={'account-arrow-left'}
            />

            <CaptureButton
                style={{position: 'absolute', bottom: '10%'}}
                camera={camera}
                onMediaCaptured={function (
                    media: PhotoFile | VideoFile,
                    type: 'photo' | 'video',
                ): void {
                    console.log(media);
                    if (type === 'photo') {
                        const photo = media as PhotoFile;
                        setPhoto(photo);
                        setIsCameraActive(false);
                        if (openModalAfterCapture) {
                            setIsModalActive(true);
                        }
                        onCapture(photo);
                        setOnCapture(() => () => {});

                    }
                }}
                minZoom={0}
                maxZoom={0}
                cameraZoom={zoom}
                flash={'off'}
                enabled={isCameraInitialized}
            />
        </View>
    );
};

export default CameraScreen;
