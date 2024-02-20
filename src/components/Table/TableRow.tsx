import {
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    StyleSheet,
    UIManager,
    View,
} from 'react-native';
import Item from '../../data/Item/Item';
import {
    DataTable,
    IconButton,
    Portal,
    Searchbar,
    Snackbar,
    Surface,
    Text,
    TextInput,
    useTheme,
} from 'react-native-paper';
import {NavigationProp} from '@react-navigation/native';
import {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {TableContext} from './Table';
import {TextInput as NativeTextInput} from 'react-native';
import Animated, {
    Easing,
    Keyframe,
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import SearchDropdown from '../SearchDropdown';
import {ITEM_OPERATIONS} from '../../constants';
import {useRealm} from '@realm/react';
import ItemRepository from '../../data/Item/ItemRepository';
import {Keyboard} from 'react-native';
import Space from '../../data/Space/Space';

const TableRow = ({
    item,
    navigation,
    showSnackbarWithText,
}: {
    item: Item;
    navigation: NavigationProp<any>;
    showSnackbarWithText: (text: string) => void;
}) => {
    if (Platform.OS === 'android') {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    const theme = useTheme();
    const translate = useSharedValue(-100);
    const styles = StyleSheet.create({
        dataTableRow: {
            backgroundColor: theme.colors.surface,
            flexShrink: 0,
            flexGrow: 1,
            position: 'relative',
        },
        rowButtons: {
            flexShrink: 1,
            flexGrow: 0,
            display: 'flex',
        },
        editPanel: {},
        triangle: {
            width: 0,
            height: 0,
            top: 8,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderTopWidth: 15,
            borderRightWidth: 0,
            borderBottomWidth: 15,
            borderLeftWidth: 15,
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
            borderLeftColor: theme.colors.primary,
        },
    });

    const rowAnimatedStyles = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: withTiming(0, {
                    duration: 50,
                    easing: Easing.inOut(Easing.quad),
                    reduceMotion: ReduceMotion.System,
                }),
            },
        ],
    }));

    const firstUnit = item.units.entries().next();
    const unitString = firstUnit
        ? `${firstUnit.value[1]} ${firstUnit.value[0]}`
        : '';
    const {openedRow, setOpenedRow} = useContext(TableContext);
    const [quantityValue, setQuantityValue] = useState(0);
    const [unitSearchQuery, setUnitSearchQuery] = useState('');
    const realm = useRealm();
    const repository = new ItemRepository(realm);
    const quantityFieldRef = useRef<NativeTextInput>(null);
    const [shouldFocusNextRender, setShouldFocusNextRender] = useState(false);

    const [editPanelX, setEditPanelX] = useState(0);

    const toggleRowOpened = (flag: boolean) => {
        if (flag) {
            setOpenedRow(item);
            setShouldFocusNextRender(true);
            // quantityFieldRef.current?.focus();
        } else {
            setOpenedRow(null);
            Keyboard.dismiss();
        }
    };

    useEffect(() => {
        if (shouldFocusNextRender) {
            quantityFieldRef.current?.focus();
            setShouldFocusNextRender(false);
        }
    });

    const updateItemQuantity = (
        quantity: number,
        operation: ITEM_OPERATIONS,
    ) => {
        if (operation === ITEM_OPERATIONS.ADD) {
            const success = repository.UpdateOperationAdd(
                item._id,
                quantity,
                unitSearchQuery ?? 'unit',
            );

            if (!success) {
                showSnackbarWithText(
                    `Failed to add ${quantity} ${unitSearchQuery ?? 'unit'}`,
                );
            } else {
                showSnackbarWithText(
                    `Added ${quantity} ${unitSearchQuery ?? 'unit'} of ${
                        item.name
                    }`,
                );
            }
        } else if (operation === ITEM_OPERATIONS.REMOVE) {
            const success = repository.UpdateOperationRemove(
                item._id,
                quantity,
                unitSearchQuery ?? 'unit',
            );

            if (!success) {
                showSnackbarWithText(
                    `Failed to remove ${quantity} ${unitSearchQuery ?? 'unit'}`,
                );
            } else {
                showSnackbarWithText(
                    `Removed ${quantity} ${unitSearchQuery ?? 'unit'} of ${
                        item.name
                    }`,
                );
            }
        }
    };

    const renderEditPanel = (item: Item) => {
        return (
            <View
                style={[
                    {
                        zIndex: 100,
                        position: 'absolute',
                        right: 48,
                        display: 'flex',
                        flexDirection: 'row',
                    },
                ]}>
                <Surface
                    mode="elevated"
                    elevation={1}
                    style={{
                        width: 'auto',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 8,
                        gap: 4,
                        zIndex: -1,
                        borderRadius: theme.roundness,
                    }}>
                    <IconButton
                        icon={'basket-minus'}
                        onPress={() =>
                            updateItemQuantity(
                                quantityValue,
                                ITEM_OPERATIONS.REMOVE,
                            )
                        }
                        animated={true}
                        containerColor={theme.colors.error}
                        iconColor="white"
                    />

                    <TextInput
                        dense
                        ref={quantityFieldRef}
                        // label={'Quantity'}
                        mode="outlined"
                        placeholder='Qty'
                        inputMode="numeric"
                        onChangeText={value =>
                            setQuantityValue(parseFloat(value))
                        }
                    />
                    <IconButton
                        icon={'basket-plus'}
                        onPress={() =>
                            updateItemQuantity(
                                quantityValue,
                                ITEM_OPERATIONS.ADD,
                            )
                        }
                        animated={true}
                        containerColor={theme.colors.primary}
                        iconColor="white"
                    />
                </Surface>
                <View
                    style={{
                        display: 'flex',
                        width: 0,
                        height: 0,
                        top: 8,
                        backgroundColor: 'transparent',
                        borderStyle: 'solid',
                        borderTopWidth: 15,
                        borderRightWidth: 0,
                        borderBottomWidth: 15,
                        borderLeftWidth: 15,
                        borderTopColor: 'transparent',
                        borderRightColor: 'transparent',
                        borderBottomColor: 'transparent',
                        borderLeftColor:
                            openedRow === item
                                ? theme.colors.surfaceVariant
                                : 'transparent',
                    }}
                />
            </View>
        );
    };
    return (
        <View>
            <Animated.View
                key={item._objectKey()}
                style={[
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        overflow: 'visible',
                    },
                ]}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <DataTable.Row
                        style={styles.dataTableRow}
                        onPress={() =>
                            navigation.navigate('Inventory', {
                                screen: 'Details',
                                params: {id: item._id.toString()},
                            })
                        }>
                        <DataTable.Cell
                            textStyle={{color: theme.colors.primary}}>
                            {item.name}
                        </DataTable.Cell>
                        <DataTable.Cell
                            textStyle={{color: theme.colors.primary}}
                            style={{
                                width: '100%',
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text>{unitString}</Text>
                            </View>
                        </DataTable.Cell>
                        <DataTable.Cell
                            textStyle={{color: theme.colors.primary}}>
                            <Text>
                                {item.linkingObjects<Space>(Space, 'items')[0]
                                    ?.name ?? 'no space'}
                            </Text>
                        </DataTable.Cell>
                    </DataTable.Row>

                    <View style={styles.rowButtons}>
                        <IconButton
                            style={{
                                borderRadius: 0,
                                flex: 1,
                                margin: 0,
                            }}
                            icon={'basket-fill'}
                            containerColor={
                                openedRow === item
                                    ? theme.colors.primaryContainer
                                    : theme.colors.surface
                            }
                            onPress={() => toggleRowOpened(openedRow !== item)}
                        />
                    </View>
                </View>
            </Animated.View>
            {openedRow === item && renderEditPanel(item)}
        </View>
    );
};

export default TableRow;
