import {
    Button,
    Icon,
    IconButton,
    MD3Theme,
    Text,
    TextInput,
    TouchableRipple,
} from 'react-native-paper';
import ItemRepository from '../data/Item/ItemRepository';
import SpaceRepository from '../data/Space/SpaceRepository';
import {NavigationProp} from '@react-navigation/native';
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import Animated, {SharedValue} from 'react-native-reanimated';
import {
    RefObject,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {Keyboard, View, StyleSheet, Pressable, Image} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Modal from 'react-native-modal';
import {CameraContext} from './Camera/CameraContext';
import CameraScreen from '../screens/CameraScreen';
import {AddItemModalContext} from './AddItemModalContext';
import {
    DocumentDirectoryPath,
    copyFile,
    exists,
    mkdir,
    writeFile,
} from '@dr.pogodin/react-native-fs';
export const AddItemModal = ({
    theme,
    itemRepo,
    spaceRepo,
    isTablet,
    showSnackBarWithText,
    navigation,
    animatedStyles,
}: {
    theme: MD3Theme;
    itemRepo: ItemRepository;
    spaceRepo: SpaceRepository;
    isTablet: boolean;
    showSnackBarWithText: (text: string) => void;
    navigation: NavigationProp<any>;
    animatedStyles?: any;
}) => {
    const spacesValues = Array.from(spaceRepo.Find().entries()).map(entry => {
        return {label: entry[1].name, value: entry[1]._id.toHexString()};
    });
    spacesValues.unshift({label: 'None', value: 'n'});
    const CreateItem = async () => {
        const result = itemRepo.Create({
            name: addItemName,
            units: new Map<string, number>([
                [addItemUnit === '' ? 'units' : addItemUnit, addItemQuantity],
            ]),
            space: addItemSpace,
        });
        if (result) {
            if (photo) {
                if (!(await exists(`${DocumentDirectoryPath}/photos`))) {
                    mkdir(`${DocumentDirectoryPath}/photos`);
                }
                await copyFile(
                    photo?.path,
                    `${DocumentDirectoryPath}/photos/${result.toString()}.jpg`,
                );
            }

            showSnackBarWithText(`Added ${addItemName} to inventory`);
            setIsModalActive(false);
            setAddItemName('');
            setAddItemQuantity(0);
            setAddItemUnit('');
            setAddItemSpace(null);
            setPhoto(null);
        } else {
            // TODO: Error state
        }
    };
    const tempRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(() => ['10%', '70%'], []);

    const [spaces, setSpaces] = useState(spacesValues);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [dropdownContainerOffset, setDropdownContainerOffset] = useState(0);
    const {photo, setPhoto, isCameraActive, setIsCameraActive} =
        useContext(CameraContext);

    const {
        isModalActive,
        setIsModalActive,
        addItemName,
        addItemQuantity,
        addItemUnit,
        addItemSpace,
        setAddItemName,
        setAddItemQuantity,
        setAddItemUnit,
        setAddItemSpace,
        modalRef,
        setModalRef,
    } = useContext(AddItemModalContext);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardOpen(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardOpen(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(() => {
        setModalRef(tempRef);
    }, [tempRef]);
    const styles = makeStyles(theme);

    const renderAddItemForm = (isTablet: boolean) => {
        return (
            <>
                {isTablet ? (
                    <View
                        style={{
                            gap: 16,
                        }}>
                        <Text variant="titleLarge">Add an item</Text>
                        <View style={{flexDirection: 'row', gap: 16}}>
                            <TouchableRipple
                                onPress={() => {
                                    setIsCameraActive(true);
                                    setIsModalActive(false);
                                }}
                                style={{
                                    borderColor: theme.colors.outline,
                                    borderStyle: 'dashed',
                                    borderWidth: 2,
                                    borderRadius: 8,
                                    minHeight: 100,
                                    flexGrow: 0,
                                    aspectRatio: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <View>
                                    {photo !== null && (
                                        <>
                                            <Image
                                                width={100}
                                                height={100}
                                                borderRadius={8}
                                                source={{
                                                    uri: `file://${photo?.path}`,
                                                }}
                                            />
                                            <IconButton
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                }}
                                                size={16}
                                                mode="contained"
                                                icon={'close'}
                                                onPress={() => setPhoto(null)}
                                            />
                                        </>
                                    )}
                                    {photo === null && (
                                        <Icon
                                            size={48}
                                            source={'camera-plus'}
                                            color={theme.colors.outline}
                                        />
                                    )}
                                </View>
                            </TouchableRipple>
                            <View style={{flex: 1, gap: 16}}>
                                <View style={{flexDirection: 'row', gap: 16}}>
                                    <TextInput
                                        mode="outlined"
                                        label="Name"
                                        style={{
                                            flex: 2,
                                            color: theme.colors
                                                .onPrimaryContainer,
                                        }}
                                        onChangeText={text =>
                                            setAddItemName(text)
                                        }
                                        value={addItemName}
                                    />
                                </View>
                                <View style={{flexDirection: 'row', gap: 16}}>
                                    <TextInput
                                        mode="outlined"
                                        label="Quantity"
                                        style={{flex: 1}}
                                        inputMode="numeric"
                                        onChangeText={text =>
                                            setAddItemQuantity(
                                                parseInt(
                                                    text.replace(/[^0-9]/g, ''),
                                                ),
                                            )
                                        }
                                        value={addItemQuantity.toString()}
                                        selectTextOnFocus
                                    />
                                    <TextInput
                                        mode="outlined"
                                        label="Unit"
                                        placeholder="units"
                                        style={{flex: 1}}
                                        onChangeText={text =>
                                            setAddItemUnit(text)
                                        }
                                        value={addItemUnit}
                                    />
                                    {/* <Text>{dropdownContainerOffset}</Text> */}
                                </View>
                            </View>
                        </View>
                        <Animated.View
                            style={[{flexDirection: 'row'}, animatedStyles]}>
                            <Dropdown
                                style={{
                                    height: 50,
                                    borderColor: theme.colors.outline,
                                    borderWidth: 1,
                                    borderRadius: theme.roundness,
                                    paddingHorizontal: 16,
                                    width: '100%',
                                }}
                                selectedTextStyle={{
                                    color: theme.colors.onPrimaryContainer,
                                }}
                                placeholderStyle={{
                                    color: theme.colors.secondary,
                                }}
                                containerStyle={{
                                    top: isTablet
                                        ? 0
                                        : -15 + dropdownContainerOffset,
                                    borderWidth: 1,
                                    borderRadius: theme.roundness,
                                }}
                                keyboardAvoiding={true}
                                showsVerticalScrollIndicator={true}
                                searchPlaceholder="Search..."
                                search={spaces.length > 5}
                                data={spaces}
                                maxHeight={240}
                                labelField="label"
                                valueField="value"
                                placeholder="Select a space"
                                value={addItemSpace}
                                onChange={space => {
                                    setAddItemSpace(space.value);
                                }}
                                onFocus={() => {
                                    // Hack to get dropdown to show up offset if opened whilst keyboard is open
                                    // if (!isKeyboardOpen) {
                                    //     setBaseOffsetValue(currentPosition?.value || 0);
                                    // }
                                    // setDropdownContainerOffset(
                                    //     isKeyboardOpen ? baseOffsetValue || 0 : 0,
                                    // );
                                }}
                                renderItem={item => {
                                    return (
                                        <View
                                            style={{
                                                padding: 16,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}>
                                            <Text
                                                style={{
                                                    color: theme.colors.primary,
                                                    ...theme.fonts.bodyLarge,
                                                }}>
                                                {item.label}
                                            </Text>
                                            {item.value === addItemSpace ? (
                                                <Icon
                                                    size={24}
                                                    source={'check'}
                                                    color={theme.colors.primary}
                                                />
                                            ) : null}
                                        </View>
                                    );
                                }}
                            />
                        </Animated.View>
                        <View style={{padding: 8}}>
                            <Button
                                mode="contained"
                                onPress={() => {
                                    CreateItem();
                                    setIsModalActive(false);
                                }}>
                                Add
                            </Button>
                        </View>
                    </View>
                ) : (
                    <View
                        style={{
                            margin: 0,
                            width: isTablet ? '70%' : '100%',
                            padding: 32,
                            backgroundColor: 'white',
                            flexDirection: 'column',
                            gap: 16,
                            borderRadius: 8,
                        }}>
                        <Text variant="titleLarge">Add an item</Text>
                        <View style={{flexDirection: 'row', gap: 8}}>
                            <TouchableRipple
                                onPress={() => {
                                    setIsCameraActive(true);
                                    setIsModalActive(false);
                                }}
                                style={{
                                    borderColor: theme.colors.outline,
                                    borderStyle: 'dashed',
                                    borderWidth: 2,
                                    borderRadius: 8,
                                    minHeight: 100,
                                    flexGrow: 0,
                                    aspectRatio: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <View>
                                    {photo !== null && (
                                        <>
                                            <Image
                                                width={100}
                                                height={100}
                                                borderRadius={8}
                                                source={{
                                                    uri: `file://${photo?.path}`,
                                                }}
                                            />
                                            <IconButton
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                }}
                                                size={16}
                                                mode="contained"
                                                icon={'close'}
                                                onPress={() => setPhoto(null)}
                                            />
                                        </>
                                    )}
                                    {photo === null && (
                                        <Icon
                                            size={48}
                                            source={'camera-plus'}
                                            color={theme.colors.outline}
                                        />
                                    )}
                                </View>
                            </TouchableRipple>
                            <View style={{flex: 1}}>
                                <View style={{flexDirection: 'row', gap: 8}}>
                                    <TextInput
                                        mode="outlined"
                                        label="Name"
                                        style={{
                                            flex: 2,
                                            alignContent: 'center',
                                            justifyContent: 'center',
                                        }}
                                        onChangeText={text =>
                                            setAddItemName(text)
                                        }
                                        value={addItemName}
                                        render={props => (
                                            <BottomSheetTextInput
                                                {...(props as any)}
                                            />
                                        )}
                                    />
                                </View>
                                <View style={{flexDirection: 'row', gap: 8}}>
                                    <TextInput
                                        mode="outlined"
                                        label="Quantity"
                                        style={{flex: 1}}
                                        inputMode="numeric"
                                        onChangeText={text => {
                                            const parsedText = parseInt(
                                                text.replace(/[^0-9]/g, ''),
                                            );
                                            setAddItemQuantity(
                                                isNaN(parsedText)
                                                    ? 0
                                                    : parsedText,
                                            );
                                        }}
                                        value={addItemQuantity.toString()}
                                        render={props => (
                                            <BottomSheetTextInput
                                                {...(props as any)}
                                            />
                                        )}
                                        selectTextOnFocus
                                    />
                                    <TextInput
                                        mode="outlined"
                                        label="Unit"
                                        placeholder="units"
                                        style={{flex: 1}}
                                        onChangeText={text =>
                                            setAddItemUnit(text)
                                        }
                                        value={addItemUnit}
                                        render={props => (
                                            <BottomSheetTextInput
                                                {...(props as any)}
                                            />
                                        )}
                                    />
                                    {/* <Text>{dropdownContainerOffset}</Text> */}
                                </View>
                            </View>
                        </View>
                        <Animated.View
                            style={[{flexDirection: 'row'}, animatedStyles]}>
                            <Dropdown
                                style={{
                                    height: 50,
                                    borderColor: theme.colors.outline,
                                    borderWidth: 1,
                                    borderRadius: theme.roundness,
                                    paddingHorizontal: 16,
                                    width: '100%',
                                }}
                                selectedTextStyle={{
                                    color: theme.colors.onPrimaryContainer,
                                }}
                                placeholderStyle={{
                                    color: theme.colors.secondary,
                                }}
                                containerStyle={{
                                    top: isTablet
                                        ? 0
                                        : -15 + dropdownContainerOffset,
                                    borderWidth: 1,
                                    borderRadius: theme.roundness,
                                }}
                                keyboardAvoiding={true}
                                showsVerticalScrollIndicator={true}
                                searchPlaceholder="Search..."
                                search={spaces.length > 5}
                                data={spaces}
                                maxHeight={240}
                                labelField="label"
                                valueField="value"
                                placeholder="Select a space"
                                value={addItemSpace}
                                onChange={space => {
                                    setAddItemSpace(space.value);
                                }}
                                onFocus={() => {
                                    // Hack to get dropdown to show up offset if opened whilst keyboard is open
                                    // if (!isKeyboardOpen) {
                                    //     setBaseOffsetValue(currentPosition?.value || 0);
                                    // }
                                    // setDropdownContainerOffset(
                                    //     isKeyboardOpen ? baseOffsetValue || 0 : 0,
                                    // );
                                }}
                                renderItem={item => {
                                    return (
                                        <View
                                            style={{
                                                padding: 16,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}>
                                            <Text
                                                style={{
                                                    color: theme.colors.primary,
                                                    ...theme.fonts.bodyLarge,
                                                }}>
                                                {item.label}
                                            </Text>
                                            {item.value === addItemSpace ? (
                                                <Icon
                                                    size={24}
                                                    source={'check'}
                                                    color={theme.colors.primary}
                                                />
                                            ) : null}
                                        </View>
                                    );
                                }}
                            />
                        </Animated.View>
                        <View style={{padding: 8}}>
                            <Button
                                mode="contained"
                                onPress={() => {
                                    CreateItem();
                                    setIsModalActive(false);
                                    showSnackBarWithText('Added item');
                                }}>
                                Add
                            </Button>
                        </View>
                    </View>
                )}
            </>
        );
    };
    const renderCamera = () => {
        return (
            <View
                style={{
                    position: 'absolute',
                    flex: 1,
                    borderWidth: 8,
                    borderColor: 'yellow',
                    width: 100,
                    height: 100,
                    zIndex: 100,
                }}>
                <Text>hello</Text>
                <CameraScreen />
            </View>
        );
    };

    return (
        <View
            style={{
                flex: 1,
                // width: '100%',
                // height: '100%',
                // zIndex: 100,
                // justifyContent: 'center',
                // alignItems: 'center',
            }}>
            {isTablet ? (
                <Modal
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    useNativeDriver={true}
                    hideModalContentWhileAnimating={true}
                    animationIn={'bounceIn'}
                    animationOut={'bounceOut'}
                    isVisible={isModalActive}
                    avoidKeyboard={true}
                    coverScreen={true}
                    onDismiss={() => {
                        console.log('dismiss modal');
                        setIsModalActive(false);
                        setIsCameraActive(false);
                    }}
                    onBackdropPress={() => {
                        setIsCameraActive(false);
                        setIsModalActive(false);
                        console.log('backdrop pressed');
                    }}>
                    <View
                        style={{
                            position: 'relative',
                            width: '70%',
                            // height: 'auto',
                            // justifyContent: 'center',
                            // alignItems: 'center',
                        }}>
                        <View
                            style={{
                                margin: 0,
                                padding: 32,
                                backgroundColor: 'white',
                                flexDirection: 'column',
                                gap: 16,
                                borderRadius: 8,
                            }}>
                            {renderAddItemForm(isTablet)}
                        </View>
                    </View>
                </Modal>
            ) : (
                // </TouchableRipple>
                <BottomSheetModal
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    ref={modalRef}
                    index={1}
                    enablePanDownToClose={true}
                    snapPoints={snapPoints}
                    backdropComponent={props => (
                        <BottomSheetBackdrop
                            {...props}
                            appearsOnIndex={0}
                            disappearsOnIndex={-1}
                        />
                    )}
                    onDismiss={() => setIsModalActive(false)}
                    keyboardBlurBehavior="restore"
                    keyboardBehavior="interactive"
                    android_keyboardInputMode="adjustPan">
                    {renderAddItemForm(isTablet)}
                </BottomSheetModal>
            )}
        </View>
    );
};

const makeStyles = (theme: MD3Theme) =>
    StyleSheet.create({
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
        },
        black: {
            color: 'black',
        },
        input: {
            flex: 9,
        },
        quantityInput: {
            flex: 1,
        },
        inputContainer: {},
        container: {
            display: 'flex',
            height: '100%',
            padding: 0,
            backgroundColor: theme.colors.surface,
        },
    });
