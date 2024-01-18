import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import Item from '../../data/Item/Item';
import { DataTable, FAB, useTheme } from 'react-native-paper';
import { useRealm } from '@realm/react';
import ItemRepository from '../../data/Item/ItemRepository';
import { NavigationProp } from '@react-navigation/native';

interface TableProps {
    data: Item[];
    setModalVisible: (flag: boolean) => void;
    navigation: NavigationProp<any>;
}

const Table = (props: TableProps) => {
    const realm = useRealm();

    const itemRepo = new ItemRepository(realm);

    const theme = useTheme()
    const { data, setModalVisible, navigation } = props;

    const DeleteItem = (item: Item) => {
        itemRepo.Delete(item);
    }

    return (
        <>
            <DataTable style={styles.dataTable}>
                <DataTable.Header style={{ backgroundColor: theme.colors.primaryContainer }}>
                    <DataTable.Title>Test</DataTable.Title>
                </DataTable.Header>

                <ScrollView style={styles.scrollContainer}>
                    {data.map(item => {
                        const firstUnit = item.units.entries().next();
                        const unitString = firstUnit ? `${firstUnit.value[1]} ${firstUnit.value[0]}` : "";
                        return (
                            <DataTable.Row key={item._objectKey()} style={{ backgroundColor: theme.colors.surface }} 
                                onPress={() => navigation.navigate('Inventory', { screen: 'Details', params: { id: item._id.toString() } })}>
                                <DataTable.Cell textStyle={{ color: theme.colors.primary }}>{item.name}</DataTable.Cell>
                                <DataTable.Cell textStyle={{ color: theme.colors.primary }}>{unitString}</DataTable.Cell>
                            </DataTable.Row>)
                    })}
                </ScrollView>
            </DataTable>
            <FAB icon={'plus'} label={'Add Item'} style={styles.fab} onPress={() => setModalVisible(true)} />

        </>
    );
};

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

export default Table;