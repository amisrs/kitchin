import {useCallback, useEffect, useRef, useState} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';
import {
    Text,
    Button,
    FAB,
    Modal,
    Portal,
    TextInput,
    AnimatedFAB,
    useTheme,
    SegmentedButtons,
} from 'react-native-paper';
import Realm from 'realm';
import Item from '../data/Item/Item';
import ItemRepository from '../data/Item/ItemRepository';
import {useQuery, useRealm} from '@realm/react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import ItemUnit from '../data/Item/ItemUnit';
import Voice, {
    SpeechEndEvent,
    SpeechErrorEvent,
    SpeechRecognizedEvent,
    SpeechResultsEvent,
    SpeechStartEvent,
} from '@react-native-voice/voice';
import WinkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import Table from '../components/Table/Table';
import {NavigationProp} from '@react-navigation/native';
import AppBar from '../components/AppBar';
import SpaceRepository from '../data/Space/SpaceRepository';
import DropDownPicker from 'react-native-dropdown-picker';
const InventoryScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
    const [itemsList, setItemsList] = useState<Realm.Results<Item>>();
    const realm = useRealm();
    const itemRepo = new ItemRepository(realm);
    const spaceRepo = new SpaceRepository(realm);
    const items = itemRepo.Find();

    const [isModalVisible, setModalVisible] = useState(false);

    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [unit, setUnit] = useState('');
    const theme = useTheme();

    const spacesValues = Array.from(spaceRepo.Find().entries()).map(entry => {
        return {label: entry[1].name, value: entry[1]._id.toHexString()};
    });
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [spaces, setSpaces] = useState(spacesValues);
    const [spaceDropdownOpen, setSpaceDropdownOpen] = useState(false);

    const CreateItem = () => {
        itemRepo.Create({
            name: name,
            units: new Map<string, number>([[unit, quantity]]),
            space: selectedSpace,
        });
    };

    const DeleteItem = (item: Item) => {
        itemRepo.Delete(item);
    };

    const toggleModal = (toggle: boolean) => {
        setModalVisible(toggle);
    };

    const insets = useSafeAreaInsets();
    const styles = StyleSheet.create({
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
        inputContainer: {
            margin: '10%',
            padding: 16,
            backgroundColor: 'white',
            flexDirection: 'column',
            gap: 8,
        },
        container: {
            display: 'flex',
            flexBasis: '100%',
            backgroundColor: theme.colors.surface,
        },
    });

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <SegmentedButtons
                    value={'Storage'}
                    onValueChange={value => {}}
                    buttons={[
                        {value: 'Spaces', label: 'Space', icon: 'wardrobe'},
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
                    setModalVisible={setModalVisible}
                    navigation={navigation}
                />
            </View>
            <Modal
                visible={isModalVisible}
                onDismiss={() => toggleModal(false)}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={styles.inputContainer}>
                    <Text variant="titleLarge">Add an item</Text>
                    <View style={{flexDirection: 'row', gap: 8}}>
                        <TextInput
                            mode="outlined"
                            label="Item"
                            style={{flex: 2}}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={{flexDirection: 'row', gap: 8}}>
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
                        />
                        <TextInput
                            mode="outlined"
                            label="Unit"
                            style={{flex: 1}}
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
                            }}>
                            Add
                        </Button>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
};

export default InventoryScreen;
