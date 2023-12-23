import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Realm from 'realm';
import Item from '../data/Item/Item';
import ItemRepository from '../data/Item/ItemRepository';
import { useQuery, useRealm } from '@realm/react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Dropdown from '../components/Dropdown';
import ItemUnit from '../data/Item/ItemUnit';
import Voice, { SpeechEndEvent, SpeechErrorEvent, SpeechResultsEvent, SpeechStartEvent } from '@react-native-voice/voice';

const HomeScreen = () => {
    const [itemsList, setItemsList] = useState<Realm.Results<Item>>();
    const items = useQuery(Item, items => items);
    const realm = useRealm();
    const itemRepo = new ItemRepository(realm);

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [unit, setUnit] = useState("");

    const [voiceOn, setVoiceOn] = useState(false);

    useEffect(() => {
        Voice.onSpeechStart = onSpeechStartHandler;
        Voice.onSpeechEnd = onSpeechEndHandler;
        Voice.onSpeechResults = onSpeechResultsHandler;
        Voice.onSpeechPartialResults = onSpeechPartialResultsHandler;
        Voice.onSpeechError = onSpeechErrorHandler;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechStartHandler = (e: SpeechStartEvent) => {
        console.log('Speech started');
    };

    const onSpeechEndHandler = (e: SpeechEndEvent) => {
        console.log('Speech ended');
    };

    const onSpeechResultsHandler = (e: SpeechResultsEvent) => {
        console.log('Speech results');
        console.log(e)
        setVoiceOn(false);
    }

    const onSpeechPartialResultsHandler = (e: SpeechResultsEvent) => {
        console.log('Speech partial results');
        console.log(e)
    }

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
            Voice.start('en-US', {EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS : 3000});
        } else {
            console.log('stop');
            Voice.stop();
        }
    }

    return (
        <View style={styles.screen}>
            <SafeAreaView style={styles.inputContainer}>
                <TextInput style={[styles.input, styles.black]} onChangeText={setName} />
                <TextInput style={[styles.quantityInput, styles.black]} inputMode='numeric' onChangeText={(text) => setQuantity(parseInt(text))} />
            </SafeAreaView>
            <Dropdown onSelect={(dropdownItem) => { setUnit(dropdownItem.value) }} label="dudu" data={[{ label: "bubu", value: "bubu" }]} />
            <Button title="bubu" onPress={CreateItem} />

            <Text style={styles.black}>Hello bubu</Text>
            {items?.map((item, index) => {
                const firstUnit = item.units.entries().next().value;
                const unitString = firstUnit ? ` - ${firstUnit[1]} ${firstUnit[0]}` : "";
                return <Button key={index} title={`${item.name}${unitString}`} onPress={() => DeleteItem(item)} />
            })}
            <Button title={voiceOn ? "on" : "off"} onPress={() => onSpeechToggle(!voiceOn)} />

        </View>
    );
};

const styles = StyleSheet.create({
    black: {
        color: 'black',
    },
    input: {
        borderWidth: 1,
        flex: 9
    },
    quantityInput: {
        borderWidth: 1,
        flex: 1
    },
    inputContainer: {
        flexDirection: 'row',
        width: '100%'
    },
    screen: {
        padding: 8
    }
});

export default HomeScreen;
