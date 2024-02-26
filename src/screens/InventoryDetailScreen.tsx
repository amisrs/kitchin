import {Realm, useRealm} from '@realm/react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {Avatar, Card, DataTable, Surface, Text} from 'react-native-paper';
import ItemRepository from '../data/Item/ItemRepository';
import Carousel from 'react-native-reanimated-carousel';
import {Suspense, useEffect, useState} from 'react';
import {NavigationProp} from '@react-navigation/native';
import Item from '../data/Item/Item';

const InventoryDetailScreen = ({
    route,
    navigation,
}: {
    route: any;
    navigation: NavigationProp<any>;
}) => {
    const {id} = route.params;
    const realm = useRealm();
    const repo = new ItemRepository(realm);
    const width = Dimensions.get('window').width;
    const item = repo.FindOne(new Realm.BSON.ObjectId(id));
    if (!item) {
        navigation.goBack();
        return null;
    }

    const units = Array.from(item.units.entries());

    const hasMoreThanOneUnitWithValue = item?.units.size > 1;
    return (
        <View>
            <Surface
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                    padding: 16,
                }}>
                <Text variant="titleLarge">{item.name}</Text>
                <Text variant="titleMedium">
                    {units[0][1]} {units[0][0]}
                </Text>
            </Surface>
            <Surface
                style={{
                    height: '100%',
                    padding: 16,
                    gap: 16,
                }}>
                {renderHistoryPanel(item)}
                {renderUnitsPanel(item)}
            </Surface>
            {/* <Carousel
                width={width}
                height={width / 2}
                loop
                data={[1, 2, 3]}
                scrollAnimationDuration={200}
                renderItem={({ index }) => {
                    switch (index) {
                        case 0: return renderHistoryPanel(item);
                        case 1: return <Text>second</Text>
                        case 2: return <Text>third</Text>
                        default: return <></>
                    }
                }}
            /> */}
        </View>
    );
};

const renderUnitsPanel = (item: Item) => {
    const units = Array.from(item.units.entries());
    return (
        <Card>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Unit</DataTable.Title>
                    <DataTable.Title numeric>Quantity</DataTable.Title>
                </DataTable.Header>
                {units.map(unit => {
                    return (
                        <DataTable.Row key={unit[0]}>
                            <DataTable.Cell>{unit[0]}</DataTable.Cell>
                            <DataTable.Cell numeric>{unit[1]}</DataTable.Cell>
                        </DataTable.Row>
                    );
                })}
            </DataTable>
        </Card>
    );
};

const renderHistoryPanel = (item: Item) => {
    console.log(item);
    return (
        <Card>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Operation</DataTable.Title>
                    <DataTable.Title>Quantity</DataTable.Title>
                    <DataTable.Title>Date</DataTable.Title>
                </DataTable.Header>
                {item.history.map(line => {
                    return (
                        <DataTable.Row key={line._id.toString()}>
                            <DataTable.Cell>{line.operation}</DataTable.Cell>
                            <DataTable.Cell>
                                {line.quantity} {line.unit}
                            </DataTable.Cell>
                            <DataTable.Cell>
                                {line.date.toDateString()}
                            </DataTable.Cell>
                        </DataTable.Row>
                    );
                })}
            </DataTable>
        </Card>
    );
};

const styles = StyleSheet.create({
    topFragment: {},
});
export default InventoryDetailScreen;
