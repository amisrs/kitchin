import {RefObject, useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
    Text,
    Button,
    TextInput,
    useTheme,
    SegmentedButtons,
    MD3Theme,
    FAB,
    Snackbar,
} from 'react-native-paper';
import Realm from 'realm';
import Item from '../data/Item/Item';
import ItemRepository from '../data/Item/ItemRepository';
import {useRealm} from '@realm/react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
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
    const snapPoints = useMemo(() => ['50%'], []);

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

    const insets = useSafeAreaInsets();
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
                        bottomSheetRef,
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
    modalRef?: RefObject<BottomSheetModal>,
) => {
    const spacesValues = Array.from(spaceRepo.Find().entries()).map(entry => {
        return {label: entry[1].name, value: entry[1]._id.toHexString()};
    });
    const toggleModal = (toggle: boolean) => {
        setModalVisible(toggle);
    };
    const [isModalVisible, setModalVisible] = useState(false);

    const CreateItem = () => {
        itemRepo.Create({
            name: name,
            units: new Map<string, number>([[unit, quantity]]),
            space: selectedSpace,
        });
    };
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [unit, setUnit] = useState('units');

    const [selectedSpace, setSelectedSpace] = useState(null);
    const [spaces, setSpaces] = useState(spacesValues);
    const [spaceDropdownOpen, setSpaceDropdownOpen] = useState(false);

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
                borderRadius: theme.roundness,
            }}>
            <Text variant="titleLarge">Add an item</Text>
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
                            setQuantity(parseInt(text.replace(/[^0-9]/g, '')))
                        }
                        value={quantity.toString()}
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
                            setQuantity(isNaN(parsedText) ? 0 : parsedText);
                        }}
                        value={quantity.toString()}
                        render={props => (
                            <BottomSheetTextInput {...(props as any)} />
                        )}
                    />
                )}

                <TextInput
                    mode="outlined"
                    label="Unit"
                    placeholder="units"
                    style={{flex: 1}}
                    value="units"
                    onChangeText={text => setUnit(text)}
                />
            </View>
            <View style={{flexDirection: 'row', gap: 8}}>
                {/* <TextInput mode="outlined" label="Space" style={{ flex: 1 }} inputMode='numeric' onChangeText={(text) => setQuantity(parseInt(text))} /> */}
                <DropDownPicker
                    placeholder="Space"
                    listMode="SCROLLVIEW"
                    dropDownDirection="AUTO"
                    value={selectedSpace}
                    open={spaceDropdownOpen}
                    items={spaces}
                    setOpen={setSpaceDropdownOpen}
                    setValue={setSelectedSpace}
                    setItems={setSpaces}
                />
            </View>
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
