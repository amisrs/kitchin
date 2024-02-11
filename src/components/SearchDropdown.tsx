import React, { useRef, useState } from "react";
import { FlatList, Modal, NativeSyntheticEvent, StyleProp, StyleSheet, Text, TextInputFocusEventData, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements"
import Item from "../data/Item/Item";
import { Searchbar, TextInput } from "react-native-paper";

interface Props {
    style: StyleProp<any>;
    label: string;
    data: Array<{ label: string; value: string; }>;
    onSelect: (item: DropdownItem) => void;
}

interface DropdownItem {
    label: string;
    value: string;
}

const SearchDropdown = ({ setUnitSearchQuery, style }: { setUnitSearchQuery: (value: string) => void, style: StyleProp<any> }) => {
    const [visible, setVisible] = useState(false);
    const [dropdownTop, setDropdownTop] = useState(0);
    const [selected, setSelected] = useState<DropdownItem>();
    const dropdownButton = useRef<TouchableOpacity>(null);
    const [searchText, setSearchText] = useState("");

    const toggleDropdown = () => {
        visible ? setVisible(false) : openDropdown();
    }

    const openDropdown = () => {
        setVisible(true);
        dropdownButton.current?.measure((x, y, width, height, pageX, pageY) => {
            setDropdownTop(pageY + height);
        })
    }

    const renderItem = ({ item }: { item: DropdownItem }) => {
        return (
            <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
                <Text style={styles.itemText}> {item.label} </Text>
            </TouchableOpacity>
        )
    }

    const onItemPress = (item: DropdownItem) => {
        setSelected(item);
        setVisible(false);
    }

    const renderDropdown = () => {
        if (visible) {
            return (
                <Modal visible={visible} transparent animationType="none">
                    <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
                        <View style={[styles.dropdown, { top: dropdownTop }]}>
                            {/* <FlatList data={data} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} /> */}
                        </View>
                    </TouchableOpacity>
                </Modal>
            )
        };
    }

    return (
        <TouchableOpacity ref={dropdownButton} onPress={toggleDropdown} style={{ flex: 1 }}>
            {renderDropdown()}
            {/* <Text style={styles.buttonText}> {(selected?.label || label)} </Text> */}
            <TextInput
                value={searchText}
                onChangeText={(e) => { setSearchText(e); setUnitSearchQuery(e) }}
                placeholder="Unit"
                clearButtonMode='while-editing'
                style={style} />

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '100%',
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
    },
    overlay: {
        width: '100%',
        height: '100%',
    },
    item: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        color: 'black',
    },
    itemText: {
        color: 'black'
    }
});

export default SearchDropdown;