import React, {useCallback, useRef} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    State,
    TapGestureHandler,
    TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import Reanimated, {
    cancelAnimation,
    Easing,
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    withSpring,
    withTiming,
    useAnimatedGestureHandler,
    useSharedValue,
    withRepeat,
} from 'react-native-reanimated';
import type {Camera, PhotoFile, VideoFile} from 'react-native-vision-camera';
import {
    CAPTURE_BUTTON_SIZE,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
} from '../../util/constants';

const PAN_GESTURE_HANDLER_FAIL_X = [-SCREEN_WIDTH, SCREEN_WIDTH];
const PAN_GESTURE_HANDLER_ACTIVE_Y = [-2, 2];

const BORDER_WIDTH = CAPTURE_BUTTON_SIZE * 0.1;

interface Props extends ViewProps {
    camera: React.RefObject<Camera>;
    onMediaCaptured: (
        media: PhotoFile | VideoFile,
        type: 'photo' | 'video',
    ) => void;

    minZoom: number;
    maxZoom: number;
    cameraZoom: Reanimated.SharedValue<number>;

    flash: 'off' | 'on';

    enabled: boolean;
}

const _CaptureButton: React.FC<Props> = ({
    camera,
    onMediaCaptured,
    minZoom,
    maxZoom,
    cameraZoom,
    flash,
    enabled,
    style,
    ...props
}): React.ReactElement => {
    //#region Camera Capture
    const takePhoto = useCallback(async () => {
        try {
            if (camera.current == null) throw new Error('Camera ref is null!');

            console.log('Taking photo...');
            const photo = await camera.current.takePhoto({
                qualityPrioritization: 'speed',
                flash: flash,
                enableShutterSound: false,
            });
            onMediaCaptured(photo, 'photo');
        } catch (e) {
            console.error('Failed to take photo!', e);
        }
    }, [camera, flash, onMediaCaptured]);

    //#region Tap handler
    const tapHandler = useRef<TapGestureHandler>();
    const onHandlerStateChanged = useCallback(
        async ({nativeEvent: event}: TapGestureHandlerStateChangeEvent) => {
            // This is the gesture handler for the circular "shutter" button.
            // Once the finger touches the button (State.BEGAN), a photo is being taken and "capture mode" is entered. (disabled tab bar)
            // Also, we set `pressDownDate` to the time of the press down event, and start a 200ms timeout. If the `pressDownDate` hasn't changed
            // after the 200ms, the user is still holding down the "shutter" button. In that case, we start recording.
            //
            // Once the finger releases the button (State.END/FAILED/CANCELLED), we leave "capture mode" (enable tab bar) and check the `pressDownDate`,
            // if `pressDownDate` was less than 200ms ago, we know that the intention of the user is to take a photo. We check the `takePhotoPromise` if
            // there already is an ongoing (or already resolved) takePhoto() call (remember that we called takePhoto() when the user pressed down), and
            // if yes, use that. If no, we just try calling takePhoto() again
            console.debug(`state: ${Object.keys(State)[event.state]}`);
            switch (event.state) {
                case State.BEGAN: {
                    // enter "recording mode"
                    return;
                }
                case State.END:
                case State.FAILED:
                case State.CANCELLED: {
                    // exit "recording mode"
                    await takePhoto();

                    return;
                }
                default:
                    break;
            }
        },
        [takePhoto],
    );
    //#endregion
    //#region Pan handler
    const panHandler = useRef<PanGestureHandler>();
    const onPanGestureEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        {offsetY?: number; startY?: number}
    >({
        onStart: (event, context) => {
            context.startY = event.absoluteY;
            const yForFullZoom = context.startY * 0.7;
            const offsetYForFullZoom = context.startY - yForFullZoom;

            // extrapolate [0 ... 1] zoom -> [0 ... Y_FOR_FULL_ZOOM] finger position
            context.offsetY = interpolate(
                cameraZoom.value,
                [minZoom, maxZoom],
                [0, offsetYForFullZoom],
                Extrapolate.CLAMP,
            );
        },
        onActive: (event, context) => {
            const offset = context.offsetY ?? 0;
            const startY = context.startY ?? SCREEN_HEIGHT;
            const yForFullZoom = startY * 0.7;

            cameraZoom.value = interpolate(
                event.absoluteY - offset,
                [yForFullZoom, startY],
                [maxZoom, minZoom],
                Extrapolate.CLAMP,
            );
        },
    });
    //#endregion

    const shadowStyle = useAnimatedStyle(
        () => ({
            transform: [
                {
                    scale: withSpring(1, {
                        mass: 1,
                        damping: 35,
                        stiffness: 300,
                    }),
                },
            ],
        })
    );
    const buttonStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(enabled ? 1 : 0.3, {
                duration: 100,
                easing: Easing.linear,
            }),
        };
    }, [enabled]);

    return (
        <TapGestureHandler
            enabled={enabled}
            ref={tapHandler}
            onHandlerStateChange={onHandlerStateChanged}
            shouldCancelWhenOutside={false}
            maxDurationMs={99999999} // <-- this prevents the TapGestureHandler from going to State.FAILED when the user moves his finger outside of the child view (to zoom)
            simultaneousHandlers={panHandler}>
            <Reanimated.View {...props} style={[buttonStyle, style]}>
                <PanGestureHandler
                    enabled={enabled}
                    ref={panHandler}
                    failOffsetX={PAN_GESTURE_HANDLER_FAIL_X}
                    activeOffsetY={PAN_GESTURE_HANDLER_ACTIVE_Y}
                    onGestureEvent={onPanGestureEvent}
                    simultaneousHandlers={tapHandler}>
                    <Reanimated.View style={styles.flex}>
                        <Reanimated.View style={[styles.shadow, shadowStyle]} />
                        <View style={styles.button} />
                    </Reanimated.View>
                </PanGestureHandler>
            </Reanimated.View>
        </TapGestureHandler>
    );
};

export const CaptureButton = React.memo(_CaptureButton);

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    shadow: {
        position: 'absolute',
        width: CAPTURE_BUTTON_SIZE,
        height: CAPTURE_BUTTON_SIZE,
        borderRadius: CAPTURE_BUTTON_SIZE / 2,
        backgroundColor: '#e34077',
    },
    button: {
        width: CAPTURE_BUTTON_SIZE,
        height: CAPTURE_BUTTON_SIZE,
        borderRadius: CAPTURE_BUTTON_SIZE / 2,
        borderWidth: BORDER_WIDTH,
        borderColor: 'white',
    },
});
