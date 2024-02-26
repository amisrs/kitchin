import {
    RefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {
    Text,
    Button,
    TextInput,
    useTheme,
    SegmentedButtons,
    MD3Theme,
    FAB,
    Snackbar,
    Icon,
    TouchableRipple,
} from 'react-native-paper';
import Realm from 'realm';
import Item from '../data/Item/Item';
import ItemRepository from '../data/Item/ItemRepository';
import {useRealm} from '@realm/react';
import Table from '../components/Table/Table';
import {NavigationProp} from '@react-navigation/native';
import SpaceRepository from '../data/Space/SpaceRepository';
import DropDownPicker from 'react-native-dropdown-picker';
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import isTabletDimensions from '../util/isTabletDimensions';
import Modal from 'react-native-modal';
import {Dropdown} from 'react-native-element-dropdown';
import Animated, {
    SharedValue,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
interface DropdownItem {
    label: string;
    value: string;
}
const InventoryScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
    // if (Platform.OS === 'android') {
    //     if (UIManager.setLayoutAnimationEnabledExperimental) {
    //         UIManager.setLayoutAnimationEnabledExperimental(true);
    //     }
    // }

    const [itemsList, setItemsList] = useState<Realm.Results<Item>>();

    const isTablet = isTabletDimensions();
    const realm = useRealm();
    const itemRepo = new ItemRepository(realm);
    const spaceRepo = new SpaceRepository(realm);
    const items = itemRepo.Find();

    const theme = useTheme();

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['70%'], []);
    const currentPosition = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
        const scale = interpolate(currentPosition.value, [100, 500], [1, 2]);

        return {
            transform: [{translateY: scale}],
        };
    });

    const [tabletModalIsOpen, setTabletModalIsOpen] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');
    const showSnackbarWithText = (text: string) => {
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSnackbarVisible(true);
        setSnackbarText(text);

        // setTimeout(() => {
        //     // LayoutAnimation.configureNext(
        //     //     LayoutAnimation.Presets.easeInEaseOut,
        //     // );

        //     setSnackbarVisible(false);
        // }, 2000);
    };

    const openMobileModal = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

    const openTabletModal = () => {
        setTabletModalIsOpen(true);
    };

    const styles = makeStyles(theme);
    return (
        <View style={{height: '100%', flex: 1}}>
            <View style={styles.container}>
                <SegmentedButtons
                    style={{
                        width: '100%',
                        marginBottom: 8,
                        marginTop: 8,
                        padding: 8,
                    }}
                    value={'Storage'}
                    onValueChange={value => {}}
                    buttons={[
                        {
                            value: 'Spaces',
                            label: 'Space',
                            icon: 'wardrobe',
                        },
                        {value: 'Tag', label: 'Tag', icon: 'tag'},
                        {
                            value: 'Expiry',
                            label: 'Expiry',
                            icon: 'calendar-clock',
                        },
                    ]}
                />
                <Table
                    data={items.map(item => item)}
                    showSnackBarWithText={showSnackbarWithText}
                    navigation={navigation}
                />
            </View>
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
                    isVisible={tabletModalIsOpen}
                    avoidKeyboard={false}
                    onDismiss={() => {
                        console.log('dismiss modal');
                        setTabletModalIsOpen(false);
                    }}
                    onBackdropPress={() => setTabletModalIsOpen(false)}>
                    {renderAddItemComponent(
                        theme,
                        itemRepo,
                        spaceRepo,
                        true,
                        showSnackbarWithText,
                        navigation,
                    )}
                </Modal>
            ) : (
                <BottomSheetModal
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    ref={bottomSheetRef}
                    index={0}
                    enablePanDownToClose={true}
                    snapPoints={snapPoints}
                    animatedPosition={currentPosition}
                    backdropComponent={props => (
                        <BottomSheetBackdrop
                            {...props}
                            appearsOnIndex={0}
                            disappearsOnIndex={-1}
                        />
                    )}
                    keyboardBlurBehavior="restore"
                    keyboardBehavior="interactive"
                    android_keyboardInputMode="adjustPan">
                    {renderAddItemComponent(
                        theme,
                        itemRepo,
                        spaceRepo,
                        false,
                        showSnackbarWithText,
                        navigation,
                        bottomSheetRef,
                        currentPosition,
                        animatedStyles,
                    )}
                </BottomSheetModal>
            )}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '100%',
                }}>
                <View
                    style={{
                        flex: 1,
                        width: 'auto',
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                    }}>
                    <View style={{flex: 1, flexGrow: 1}}></View>
                    <FAB
                        icon={'plus'}
                        label={'Add Item'}
                        style={{
                            flexShrink: 1,
                            position: 'relative',
                            maxWidth: 'auto',
                            margin: 16,
                            right: 0,
                            bottom: 0,
                        }}
                        onPress={isTablet ? openTabletModal : openMobileModal}
                    />
                </View>

                <View
                    style={{
                        flex: 1,
                        alignItems: 'flex-end',
                    }}>
                    <Snackbar
                        style={{
                            flex: 1,
                        }}
                        wrapperStyle={{
                            flex: 1,
                            position: 'relative',
                            maxWidth: 512,
                        }}
                        visible={snackbarVisible}
                        onDismiss={() => setSnackbarVisible(false)}
                        duration={2000}
                        action={{
                            label: 'Dismiss',
                            onPress: () => {
                                setSnackbarVisible(false);
                            },
                        }}>
                        {snackbarText}
                    </Snackbar>
                </View>
            </View>
        </View>
    );
};

const renderAddItemComponent = (
    theme: MD3Theme,
    itemRepo: ItemRepository,
    spaceRepo: SpaceRepository,
    isTablet: boolean,
    showSnackBarWithText: (text: string) => void,
    navigation: NavigationProp<any>,
    modalRef?: RefObject<BottomSheetModal>,
    currentPosition?: SharedValue<number>,
    animatedStyles?: any,
) => {
    const spacesValues = Array.from(spaceRepo.Find().entries()).map(entry => {
        return {label: entry[1].name, value: entry[1]._id.toHexString()};
    });
    spacesValues.unshift({label: 'None', value: 'n'});
    spacesValues.unshift({label: 'None', value: 'n'});
    spacesValues.unshift({label: 'None', value: 'n'});
    const toggleModal = (toggle: boolean) => {
        setModalVisible(toggle);
    };
    const [isModalVisible, setModalVisible] = useState(false);

    const CreateItem = () => {
        itemRepo.Create({
            name: name,
            units: new Map<string, number>([
                [unit === '' ? 'units' : unit, quantity],
            ]),
            space: selectedSpace,
        });
    };
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [unit, setUnit] = useState('units');

    const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
    const [spaces, setSpaces] = useState(spacesValues);
    const [spaceDropdownOpen, setSpaceDropdownOpen] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [dropdownContainerOffset, setDropdownContainerOffset] = useState(0);
    const [baseOffsetValue, setBaseOffsetValue] = useState(0);

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
    const styles = makeStyles(theme);
    return (
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
                    onPress={() =>
                        navigation.navigate('Inventory', {
                            screen: 'Camera',
                        })
                    }
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
                    <Icon
                        size={48}
                        source={'camera-plus'}
                        color={theme.colors.outline}
                    />
                </TouchableRipple>
                <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row', gap: 8}}>
                        {isTablet ? (
                            <TextInput
                                mode="outlined"
                                label="Name"
                                style={{
                                    flex: 2,
                                    color: theme.colors.onPrimaryContainer,
                                }}
                                onChangeText={text => setName(text)}
                            />
                        ) : (
                            <TextInput
                                mode="outlined"
                                label="Name"
                                style={{
                                    flex: 2,
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                }}
                                onChangeText={text => setName(text)}
                                render={props => (
                                    <BottomSheetTextInput {...(props as any)} />
                                )}
                            />
                        )}
                    </View>
                    <View style={{flexDirection: 'row', gap: 8}}>
                        {isTablet ? (
                            <TextInput
                                mode="outlined"
                                label="Quantity"
                                style={{flex: 1}}
                                inputMode="numeric"
                                onChangeText={text =>
                                    setQuantity(
                                        parseInt(text.replace(/[^0-9]/g, '')),
                                    )
                                }
                                value={quantity.toString()}
                                selectTextOnFocus
                            />
                        ) : (
                            <TextInput
                                mode="outlined"
                                label="Quantity"
                                style={{flex: 1}}
                                inputMode="numeric"
                                onChangeText={text => {
                                    const parsedText = parseInt(
                                        text.replace(/[^0-9]/g, ''),
                                    );
                                    setQuantity(
                                        isNaN(parsedText) ? 0 : parsedText,
                                    );
                                }}
                                value={quantity.toString()}
                                render={props => (
                                    <BottomSheetTextInput {...(props as any)} />
                                )}
                                selectTextOnFocus
                            />
                        )}
                        {isTablet ? (
                            <TextInput
                                mode="outlined"
                                label="Unit"
                                placeholder="units"
                                style={{flex: 1}}
                                onChangeText={text => setUnit(text)}
                            />
                        ) : (
                            <TextInput
                                mode="outlined"
                                label="Unit"
                                placeholder="units"
                                style={{flex: 1}}
                                onChangeText={text => setUnit(text)}
                                render={props => (
                                    <BottomSheetTextInput {...(props as any)} />
                                )}
                            />
                        )}
                        {/* <Text>{dropdownContainerOffset}</Text> */}
                    </View>
                </View>
            </View>
            <Animated.View style={[{flexDirection: 'row'}, animatedStyles]}>
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
                        top: isTablet ? 0 : -15 + dropdownContainerOffset,
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
                    value={selectedSpace}
                    onChange={space => {
                        setSelectedSpace(space.value);
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
                                {item.value === selectedSpace ? (
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
                        toggleModal(false);
                        modalRef?.current?.dismiss();
                        showSnackBarWithText('Added item');
                    }}>
                    Add
                </Button>
            </View>
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

export default InventoryScreen;
