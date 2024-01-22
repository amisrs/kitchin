import { Realm, useRealm } from "@realm/react";
import { Dimensions, Image, StyleSheet, View } from "react-native"
import { Avatar, Card, DataTable, Surface, Text } from "react-native-paper"
import ItemRepository from "../data/Item/ItemRepository";
import Carousel from "react-native-reanimated-carousel";
import { Suspense, useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import Item from "../data/Item/Item";

const InventoryDetailScreen = ({ route, navigation }: { route: any, navigation: NavigationProp<any> }) => {
    const { id } = route.params;
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
            <Surface style={styles.topFragment}>
                <Text variant="titleLarge">{item.name}</Text>
                <Text variant="titleMedium">{units[0][1]} {units[0][0]}</Text>
            </Surface>
            <Carousel
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
            />
        </View>
    )

}

const renderHistoryPanel = (item: Item) => {
    console.log(item)
    return (
        <Card>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Test</DataTable.Title>
                    <DataTable.Title>Test</DataTable.Title>
                </DataTable.Header>
                {item.history.map((line) => {
                    return (
                        <DataTable.Row key={line._id.toString()}>
                            <DataTable.Cell>{line.operation}</DataTable.Cell>
                            <DataTable.Cell>{line.quantity}</DataTable.Cell>
                            <DataTable.Cell>{line.unit}</DataTable.Cell>
                            <DataTable.Cell>{line.date.toDateString()}</DataTable.Cell>
                        </DataTable.Row>
                    )
                })}
            </DataTable>
        </Card>
    )
}

const styles = StyleSheet.create({
    topFragment: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16
    }
})
export default InventoryDetailScreen