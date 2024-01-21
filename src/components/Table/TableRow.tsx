import { LayoutAnimation, Platform, StyleSheet, UIManager, View } from "react-native"
import Item from "../../data/Item/Item"
import { DataTable, IconButton, Searchbar, Surface, Text, TextInput, useTheme } from "react-native-paper"
import { NavigationProp } from "@react-navigation/native"
import { useContext, useEffect, useState } from "react"
import { TableContext } from "./Table"
import { TextInput as NativeTextInput } from 'react-native';
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"

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
            // top: '-100%',
            zIndex: -1

        }
    });

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{
            translateX: withTiming(translate.value, {
                duration: 250,
                easing: Easing.inOut(Easing.quad),
                reduceMotion: ReduceMotion.System,
            })
        }],
    }));

    const animatedStyles2 = useAnimatedStyle(() => ({
        transform: [{
            translateY: withTiming(0, {
                duration: 250,
                easing: Easing.inOut(Easing.quad),
                reduceMotion: ReduceMotion.System,
            })
        }]
    }));

    const firstUnit = item.units.entries().next();
    const unitString = firstUnit ? `${firstUnit.value[1]} ${firstUnit.value[0]}` : "";
    const { openedRow, setOpenedRow } = useContext(TableContext);
    const [unitSearchQuery, setUnitSearchQuery] = useState('');

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

    useEffect(() => {
        if (openedRow !== item) {
            translate.value = (-100);
        }
    }, [openedRow])

    const renderEditPanel = (item: Item) => {
        return (
            <Animated.View style={[animatedStyles, { zIndex: -1 }]}>
                <Surface style={styles.editPanel}>
                    <TextInput label="Quantity" mode="flat" render={(props) => <NativeTextInput inputMode="numeric" {...props} />} />
                    <Searchbar value={unitSearchQuery} onChangeText={setUnitSearchQuery} placeholder="Unit" mode="bar" style={{ flex: 1 }} />
                    <IconButton icon={'basket-minus'} animated={true} containerColor={theme.colors.error} iconColor="white" />
                    <IconButton icon={'basket-plus'} animated={true} containerColor={theme.colors.primary} iconColor="white" />
                </Surface>
            </Animated.View>
        )
    }

    return (
        <Animated.View key={item._objectKey()} style={[animatedStyles2, { display: 'flex', flexDirection: 'column' }]}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <DataTable.Row style={styles.dataTableRow}
                    onPress={() => navigation.navigate('Inventory', { screen: 'Details', params: { id: item._id.toString() } })}>
                    <DataTable.Cell textStyle={{ color: theme.colors.primary }}>{item.name}</DataTable.Cell>
                    <DataTable.Cell textStyle={{ color: theme.colors.primary }}>{unitString}</DataTable.Cell>
                </DataTable.Row>
                <View style={styles.rowButtons}>
                    <IconButton icon={openedRow === item ? 'basket-unfill' : 'basket-fill'} onPress={() => toggleRowOpened(openedRow !== item)}></IconButton>
                </View>
            </View>
            {/* renderEditPanel(item) */}
            {openedRow === item && (renderEditPanel(item))}
        </Animated.View>
    )

}

export default TableRow;

