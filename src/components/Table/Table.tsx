import React, { ReactNode, createContext, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import Item from '../../data/Item/Item';
import { Button, DataTable, FAB, IconButton, List, Surface, Text, useTheme } from 'react-native-paper';
import { useRealm } from '@realm/react';
import ItemRepository from '../../data/Item/ItemRepository';
import { NavigationProp } from '@react-navigation/native';
import TableRow from './TableRow';
import { KeyboardAwareFlatList, KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated from 'react-native-reanimated';

interface TableProps {
    data: Item[];
    setModalVisible: (flag: boolean) => void;
    navigation: NavigationProp<any>;
}
export const TableContext = createContext({
    openedRow: {} as Item | null,
    setOpenedRow: (row: Item | null) => { }
});

const Table = (props: TableProps) => {
    const realm = useRealm();
    const itemRepo = new ItemRepository(realm);
    const theme = useTheme()
    const [openedRow, setOpenedRow] = useState<Item | null>(null);
    const styles = StyleSheet.create({
        container: {
            height: '50%',
            borderRadius: 8,
            padding: 4
        },
        header: {
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: 8,
            flexGrow: 0,
            padding: 8
        },
        scrollContainer: {
            height: '80%',
        },
        kbView: {
            flex: 1,
            // flexGrow: 1,
        },
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
        }
    });

    const { data, setModalVisible, navigation } = props;
    const DeleteItem = (item: Item) => {
        itemRepo.Delete(item);
    }
    let scrollView = useRef<KeyboardAwareScrollView>(null);
    return (
        <TableContext.Provider value={{ openedRow, setOpenedRow }}>
            <DataTable>
                <DataTable.Header style={{ backgroundColor: theme.colors.primaryContainer }}>
                    <DataTable.Title>Test</DataTable.Title>
                </DataTable.Header>

                <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps={'handled'}>
                    {data.map(item => {
                        return (<TableRow item={item} navigation={navigation} key={item._objectKey()} />)
                    })}
                </ScrollView>
            </DataTable>
            <FAB icon={'plus'} label={'Add Item'} style={styles.fab} onPress={() => setModalVisible(true)} />

        </TableContext.Provider>
    );
};

export default Table;