// react context to store camera data including captured photo

import {createContext} from 'react';
import {PhotoFile} from 'react-native-vision-camera';

export const CameraContext = createContext<CameraContextType>({
    setPhoto: (photo: PhotoFile | null) => {},
    isCameraActive: false,
    setIsCameraActive: (isCameraActive: boolean) => {},
});

export interface CameraContextType {
    photo?: PhotoFile | null;
    setPhoto: (photo: PhotoFile | null) => void;
    isCameraActive: boolean;
    setIsCameraActive: (isCameraActive: boolean) => void;
}
