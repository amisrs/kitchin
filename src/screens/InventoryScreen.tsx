import {
    RefObject,
    useCallback,
    useContext,
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
import {AddItemModal} from '../components/AddItemModal';
import {CameraContext} from '../components/Camera/CameraContext';
import {PhotoFile} from 'react-native-vision-camera';
import {AddItemModalContext} from '../components/AddItemModalContext';
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
    const snapPoints = useMemo(() => ['10%', '70%'], []);
    const currentPosition = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
        const scale = interpolate(currentPosition.value, [100, 500], [1, 2]);

        return {
            transform: [{translateY: scale}],
        };
    });
    const [photo, setPhoto] = useState<PhotoFile | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [tabletModalIsOpen, setTabletModalIsOpen] = useState(false);
    const [mobileModalIsOpen, setMobileModalIsOpen] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');

    const {isModalActive, setIsModalActive} = useContext(AddItemModalContext);
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

    const openTabletModal = () => {
        setTabletModalIsOpen(true);
    };

    const styles = makeStyles(theme);
    return (
        <View
            style={{
                height: '100%',
                flex: 1,
            }}>
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
            <AddItemModal
                theme={theme}
                itemRepo={itemRepo}
                spaceRepo={spaceRepo}
                isTablet={isTablet}
                showSnackBarWithText={showSnackbarWithText}
                navigation={navigation}
                animatedStyles={animatedStyles}
            />
            {/* <Overlay /> */}

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
                        onPress={() => setIsModalActive(true)}
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
