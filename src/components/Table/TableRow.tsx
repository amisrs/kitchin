import { LayoutAnimation, Platform, StyleSheet, UIManager, View } from "react-native"
import Item from "../../data/Item/Item"
import { DataTable, IconButton, Portal, Searchbar, Snackbar, Surface, Text, TextInput, useTheme } from "react-native-paper"
import { NavigationProp } from "@react-navigation/native"
import { useContext, useEffect, useState } from "react"
import { TableContext } from "./Table"
import { TextInput as NativeTextInput } from 'react-native';
import Animated, { Easing, Keyframe, ReduceMotion, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"
import SearchDropdown from "../SearchDropdown"
import { ITEM_OPERATIONS } from "../../constants"
import { useRealm } from "@realm/react"
import ItemRepository from "../../data/Item/ItemRepository"

const TableRow = ({ item, navigation }: { item: Item, navigation: NavigationProp<any> }) => {
    if (Platform.OS === 'android') {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    const theme = useTheme();
    const translate = useSharedValue(-100)
    const styles = StyleSheet.create({
        dataTableRow: {
            backgroundColor: theme.colors.surface,
            flexShrink: 0,
            flexGrow: 1
        },
        rowButtons: {
            flexShrink: 1,
            flexGrow: 0
        },
        editPanel: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            gap: 8,
            zIndex: -1

        }
    });

    const rowAnimatedStyles = useAnimatedStyle(() => ({
        transform: [{
            translateY: withTiming(0, {
                duration: 50,
                easing: Easing.inOut(Easing.quad),
                reduceMotion: ReduceMotion.System,
            })
        }]
    }));

    const firstUnit = item.units.entries().next();
    const unitString = firstUnit ? `${firstUnit.value[1]} ${firstUnit.value[0]}` : "";
    const { openedRow, setOpenedRow } = useContext(TableContext);
    const [quantityValue, setQuantityValue] = useState(0);
    const [unitSearchQuery, setUnitSearchQuery] = useState('');
    const realm = useRealm();
    const repository = new ItemRepository(realm);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');

    const toggleRowOpened = (flag: boolean) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (flag) {
            setOpenedRow(item);
            translate.value = (0);
        } else {
            setOpenedRow(null);
            translate.value = (-100);
        }
    }

    const showSnackbarWithText = (text: string) => {
        setSnackbarText(text);
        setSnackbarVisible(true);
        setTimeout(() => {
            setSnackbarVisible(false);
        }, 2000);
    }

    const updateItemQuantity = (quantity: number, operation: ITEM_OPERATIONS) => {
        if (operation === ITEM_OPERATIONS.ADD) {
            repository.UpdateOperationAdd(item._id, quantity, unitSearchQuery ?? "unit");
        } else if (operation === ITEM_OPERATIONS.REMOVE) {
            const success = repository.UpdateOperationRemove(item._id, quantity, unitSearchQuery ?? "unit");

            if (!success) {
                showSnackbarWithText(`Failed to remove ${quantity} ${unitSearchQuery ?? "unit"}`);
            } else {
                showSnackbarWithText(`Removed ${quantity} ${unitSearchQuery ?? "unit"}`);
            }
        }
    }

    useEffect(() => {
        // repository.UpdateOperationAdd(item._id, 1, unitString ?? "unit");

        if (openedRow !== item) {
            translate.value = (-100);
        }
    }, [openedRow])

    const renderEditPanel = (item: Item) => {
        return (
            <View style={[
                {
                    zIndex: -1,
                    position: openedRow === item ? 'relative' : 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                }]}>
                <Surface style={styles.editPanel}>
                    <TextInput
                        label="Quantity"
                        mode="flat"
                        onChangeText={(value) => setQuantityValue(parseFloat(value))}
                        render={(props) => <NativeTextInput placeholder="Quantity" inputMode="numeric" {...props} />}
                    />
                    <SearchDropdown setUnitSearchQuery={setUnitSearchQuery} />
                    <IconButton
                        icon={'basket-minus'}
                        onPress={() => updateItemQuantity(quantityValue, ITEM_OPERATIONS.REMOVE)}
                        animated={true}
                        containerColor={theme.colors.error}
                        iconColor="white"
                    />
                    <IconButton icon={'basket-plus'} animated={true} containerColor={theme.colors.primary} iconColor="white" />
                </Surface>
            </View>
        )
    }

    return (
        <Animated.View key={item._objectKey()} style={[rowAnimatedStyles, { display: 'flex', flexDirection: 'column' }]}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <DataTable.Row style={styles.dataTableRow}
                    onPress={() => navigation.navigate('Inventory', { screen: 'Details', params: { id: item._id.toString() } })}>
                    <DataTable.Cell textStyle={{ color: theme.colors.primary }}>{item.name}</DataTable.Cell>
                    <DataTable.Cell textStyle={{ color: theme.colors.primary }}>{unitString}</DataTable.Cell>
                    <IconButton icon={openedRow === item ? 'basket-unfill' : 'basket-fill'} onPress={() => toggleRowOpened(openedRow !== item)}></IconButton>

                </DataTable.Row>
                {/* <View style={styles.rowButtons}>
                    <IconButton icon={openedRow === item ? 'basket-unfill' : 'basket-fill'} onPress={() => toggleRowOpened(openedRow !== item)}></IconButton>
                </View> */}
            </View>
            {renderEditPanel(item)}
            {/* {openedRow === item && (renderEditPanel(item))} */}
            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} action={
                { label: 'Dismiss', onPress: () => { setSnackbarVisible(false) } }
            }>{snackbarText}</Snackbar>
        </Animated.View>
    )

}

export default TableRow;

