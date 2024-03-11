// react context to store camera data including captured photo

import {createContext} from 'react';
import {PhotoFile} from 'react-native-vision-camera';

export const CameraContext = createContext<CameraContextType>({
    setPhoto: (photo: PhotoFile | null) => {},
    isCameraActive: false,
    setIsCameraActive: (isCameraActive: boolean) => {},
    openModalAfterCapture: false,
    setOpenModalAfterCapture: (openModalAfterCapture: boolean) => {},
    onCapture: (photo: PhotoFile) => {},
    setOnCapture: (onCapture: (photo: PhotoFile) => void) => {},
});

export interface CameraContextType {
    photo?: PhotoFile | null;
    setPhoto: (photo: PhotoFile | null) => void;
    isCameraActive: boolean;
    setIsCameraActive: (isCameraActive: boolean) => void;
    openModalAfterCapture: boolean;
    setOpenModalAfterCapture: (openModalAfterCapture: boolean) => void;
    onCapture: (photo: PhotoFile) => void;
    setOnCapture: (onCapture: (photo: PhotoFile) => void) => void;
}
