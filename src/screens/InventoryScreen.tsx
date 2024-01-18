import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Text, Button, FAB, Modal, Portal, TextInput, AnimatedFAB } from 'react-native-paper';
import Realm from 'realm';
import Item from '../data/Item/Item';
import ItemRepository from '../data/Item/ItemRepository';
import { useQuery, useRealm } from '@realm/react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Dropdown from '../components/Dropdown';
import ItemUnit from '../data/Item/ItemUnit';
import Voice, { SpeechEndEvent, SpeechErrorEvent, SpeechRecognizedEvent, SpeechResultsEvent, SpeechStartEvent } from '@react-native-voice/voice';
import WinkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import Table from '../components/Table/Table';
import { NavigationProp } from '@react-navigation/native';
import AppBar from '../components/AppBar';
const InventoryScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
    const [itemsList, setItemsList] = useState<Realm.Results<Item>>();
    const items = useQuery(Item, items => items);
    const realm = useRealm();
    const itemRepo = new ItemRepository(realm);

    const [isModalVisible, setModalVisible] = useState(false);

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [unit, setUnit] = useState("");

    const [voiceOn, setVoiceOn] = useState(false);
    const [speechResults, setSpeechResults] = useState("");
    const finalSpeechResult = useRef("");  

  
  
    const onSpeechStartHandler = (e: SpeechStartEvent) => {
        console.log('Speech started');
    };

    const onSpeechEndHandler = (e: SpeechEndEvent) => {
        console.log('Speech ended');
    };

    const onSpeechRecognizedHandler = (e: SpeechRecognizedEvent) => {
        console.log('Speech recognized ');
    }

    // const getResultHandler = useCallback((e: SpeechResultsEvent) => {
    //     return () => {
    //         const nlp = WinkNLP(model);

    //         console.log(`getresults: ${speechResults}`);
    //         const doc = nlp.readDoc(speechResults);
    //         console.log(doc.entities().out());

    //     }
    // }, [speechResults])

    function onSpeechResultsHandler(e: SpeechResultsEvent) {
        console.log(`Speech results: ${e.value}`);
        const patterns = [
            { name: 'quantity', patterns: ['CARDINAL'] },
            { name: 'noun', patterns: ['NOUN'] }
        ]

        const nlp = WinkNLP(model);
        const its = nlp.its;
        nlp.as;
        nlp.learnCustomEntities(patterns);
        // console.log(`getresults: ${finalSpeechResult.current}`);
        const doc = nlp.readDoc(finalSpeechResult.current);
        console.log(doc.out());
        console.log(doc.tokens().out());
        console.log(doc.customEntities().out(its.detail));
        setVoiceOn(false);

    };

    const onSpeechPartialResultsHandler = (e: SpeechResultsEvent) => {
        console.log('Speech partial results');
        console.log(e)
        if (e.value) {
            setSpeechResults(e.value[0]);
            finalSpeechResult.current = e.value[0];
        }
    }

    useEffect(() => {
        Voice.onSpeechStart = onSpeechStartHandler;
        Voice.onSpeechEnd = onSpeechEndHandler;
        Voice.onSpeechResults = onSpeechResultsHandler;
        Voice.onSpeechPartialResults = onSpeechPartialResultsHandler;
        Voice.onSpeechError = onSpeechErrorHandler;

        Voice.onSpeechRecognized = onSpeechRecognizedHandler;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);
    const onSpeechErrorHandler = (e: SpeechErrorEvent) => {
        console.log('Speech error');
        console.log(e)
        setVoiceOn(false);
    }

    const CreateItem = () => {
        itemRepo.Create({
            name: name, units: new Map<string, number>(
                [
                    [unit, quantity]
                ]
            )
        });
    }

    const DeleteItem = (item: Item) => {
        itemRepo.Delete(item);
    }

    const onSpeechToggle = (toggle: boolean) => {
        setVoiceOn(toggle);
        if (toggle) {
            Voice.start('en-US', { EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 2000 });
        } else {
            console.log('stop');
            Voice.stop();
        }
    }

    const toggleModal = (toggle: boolean) => {
        setModalVisible(toggle);
    }

    return (
        <View style={styles.container}>
            <AppBar screen='Inventory'/>
            <Table data={items.map((item) => item)} setModalVisible={setModalVisible} navigation={navigation}/>
            <Portal>
                <Modal visible={isModalVisible} onDismiss={() => toggleModal(false)}>
                    <View style={styles.inputContainer}>
                        <Text variant='titleLarge'>Add an item</Text>
                        <SafeAreaView style={{ flexDirection: 'row', gap: 8 }}>
                            <TextInput mode="outlined" label="Item" style={{ flex: 2 }} onChangeText={setName} />
                        </SafeAreaView>
                        <SafeAreaView style={{ flexDirection: 'row', gap: 8 }}>
                            <TextInput mode="outlined" label="Quantity" style={{ flex: 1 }} inputMode='numeric' onChangeText={(text) => setQuantity(parseInt(text))} />
                            <TextInput mode="outlined" label="Unit" style={{ flex: 1 }} onChangeText={(text) => (setUnit(text))} />
                        </SafeAreaView>
                        <SafeAreaView style={{ padding: 8 }}>
                            <Button mode="contained" onPress={() => { CreateItem(); toggleModal(false) }}>Add</Button>
                        </SafeAreaView>
                    </View>

                </Modal>
            </Portal>
            {/* <Text>voice</Text>
            <Button title={voiceOn ? "on" : "off"} onPress={() => onSpeechToggle(!voiceOn)} />
            <Text style={styles.black}>Result: {speechResults}</Text> */}
        </View>
    );
};

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
        flex: 9
    },
    quantityInput: {
        flex: 1
    },
    inputContainer: {
        margin: "10%",
        padding: 16,
        backgroundColor: 'white',
        flexDirection: 'column',
        gap: 8
    },
    container: {
        height: '100%',
    }
});

export default InventoryScreen;
