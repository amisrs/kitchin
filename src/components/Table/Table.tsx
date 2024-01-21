import React, { createContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import Item from '../../data/Item/Item';
import { Button, DataTable, FAB, IconButton, useTheme } from 'react-native-paper';
import { useRealm } from '@realm/react';
import ItemRepository from '../../data/Item/ItemRepository';
import { NavigationProp } from '@react-navigation/native';
import TableRow from './TableRow';

interface TableProps {
    data: Item[];
    setModalVisible: (flag: boolean) => void;
    navigation: NavigationProp<any>;
}
export const TableContext = createContext({
    openedRow: {} as Item | null,
    setOpenedRow: (row: Item | null) => {}
});

const Table = (props: TableProps) => {
    const realm = useRealm();
    const itemRepo = new ItemRepository(realm);
    const theme = useTheme()
    const [openedRow, setOpenedRow] = useState<Item|null>(null);
    const styles = StyleSheet.create({
        dataTable: {
            height: '100%'
        },
        scrollContainer: {
            maxHeight: '100%',
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

    return (
        <TableContext.Provider value={{ openedRow, setOpenedRow }}>
            <DataTable style={styles.dataTable}>
                <DataTable.Header style={{ backgroundColor: theme.colors.primaryContainer }}>
                    <DataTable.Title>Test</DataTable.Title>
                </DataTable.Header>

                <ScrollView style={styles.scrollContainer}>
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