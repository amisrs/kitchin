import {Realm, useRealm} from '@realm/react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {
    Avatar,
    Card,
    DataTable,
    Icon,
    IconButton,
    Surface,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import ItemRepository from '../data/Item/ItemRepository';
import Carousel from 'react-native-reanimated-carousel';
import {Suspense, useContext, useEffect, useState} from 'react';
import {NavigationProp} from '@react-navigation/native';
import Item from '../data/Item/Item';
import {DocumentDirectoryPath, exists} from '@dr.pogodin/react-native-fs';
import {CameraContext} from '../components/Camera/CameraContext';

const InventoryDetailScreen = ({
    route,
    navigation,
}: {
    route: any;
    navigation: NavigationProp<any>;
}) => {
    const {isCameraActive, setIsCameraActive} = useContext(CameraContext);
    const [photoExists, setPhotoExists] = useState(false);
    const {id} = route.params;
    const realm = useRealm();
    const theme = useTheme();
    const repo = new ItemRepository(realm);
    const width = Dimensions.get('window').width;
    const item = repo.FindOne(new Realm.BSON.ObjectId(id));
    if (!item) {
        navigation.goBack();
        return null;
    }

    const units = Array.from(item.units.entries());

    const hasMoreThanOneUnitWithValue = item?.units.size > 1;
    useEffect(() => {
        async function checkPhoto() {
            setPhotoExists(
                await exists(
                    `${DocumentDirectoryPath}/photos/${item!._id.toString()}.jpg`,
                ),
            );
        }
        checkPhoto();
    }, []);
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
                <TouchableRipple
                    onPress={() => {
                        setIsCameraActive(true);
                    }}
                    style={{
                        borderColor: theme.colors.outline,
                        borderStyle: 'dashed',
                        borderWidth: photoExists ? 0 : 2,
                        borderRadius: 8,
                        minHeight: 100,
                        flexGrow: 0,
                        aspectRatio: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View>
                        {!photoExists && (
                            <Icon
                                size={48}
                                source={'camera-plus'}
                                color={theme.colors.outline}
                            />
                        )}
                        {photoExists && (
                            <View>
                                <Image
                                    width={100}
                                    height={100}
                                    borderRadius={8}
                                    source={{
                                        uri: `file://${DocumentDirectoryPath}/photos/${item._id.toString()}.jpg`,
                                    }}
                                />
                                <IconButton
                                    style={{
                                        position: 'absolute',
                                        top: -16,
                                        right: -16,
                                        elevation: 4,
                                    }}
                                    size={16}
                                    mode="contained"
                                    icon={'close'}
                                    onPress={() => {}}
                                />
                            </View>
                        )}
                    </View>
                </TouchableRipple>
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
