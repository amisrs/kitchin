import { Realm, useRealm } from "@realm/react";
import { Dimensions, Image, StyleSheet, View } from "react-native"
import { Avatar, Surface, Text } from "react-native-paper"
import ItemRepository from "../data/Item/ItemRepository";
import Carousel from "react-native-reanimated-carousel";
import { Suspense, useEffect, useState } from "react";

const InventoryDetailScreen = ({ route, navigation }: { route: any, navigation: any }) => {
    const { id } = route.params;
    const realm = useRealm();
    const repo = new ItemRepository(realm);
    const width = Dimensions.get('window').width;
    const item = repo.FindOne(new Realm.BSON.ObjectId(id));

    return (
        <View>
            <Surface style={styles.topFragment}>
                <Text variant="titleLarge">{item?.name}</Text>
            </Surface>
            <Carousel
                width={width}
                height={width / 2}
                loop
                data={[1, 2, 3, 4, 5]}
                scrollAnimationDuration={200}
                renderItem={({ index }) => <Text>{index}</Text>}
            />
        </View>
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