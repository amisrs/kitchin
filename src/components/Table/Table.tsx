import React, {ReactNode, createContext, useRef, useState} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    UIManager,
    LayoutAnimation,
} from 'react-native';
import Item from '../../data/Item/Item';
import {
    Button,
    DataTable,
    FAB,
    Icon,
    IconButton,
    List,
    Snackbar,
    Surface,
    Text,
    useTheme,
} from 'react-native-paper';
import {useRealm} from '@realm/react';
import ItemRepository from '../../data/Item/ItemRepository';
import {NavigationProp} from '@react-navigation/native';
import TableRow from './TableRow';
import {
    KeyboardAwareFlatList,
    KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';
// import {Animated, Easing} from 'react-native';
interface TableProps {
    data: Item[];
    showSnackBarWithText: (text: string) => void;
    navigation: NavigationProp<any>;
}
export const TableContext = createContext({
    openedRow: {} as Item | null,
    setOpenedRow: (row: Item | null) => {},
});

const Table = (props: TableProps) => {
    // if (Platform.OS === 'android') {
    //     if (UIManager.setLayoutAnimationEnabledExperimental) {
    //         UIManager.setLayoutAnimationEnabledExperimental(true);
    //     }
    // }
    const realm = useRealm();
    const itemRepo = new ItemRepository(realm);
    const theme = useTheme();
    const [openedRow, setOpenedRow] = useState<Item | null>(null);

    const styles = StyleSheet.create({
        container: {
            height: '50%',
            borderRadius: 8,
            padding: 4,
        },
        header: {
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: 8,
            flexGrow: 0,
            padding: 8,
        },
        scrollContainer: {
            height: '100%',
            position: 'relative',
            overflow: 'scroll',
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
        },
    });

    const {data, showSnackBarWithText, navigation} = props;
    const DeleteItem = (item: Item) => {
        itemRepo.Delete(item);
    };
    let scrollView = useRef<KeyboardAwareScrollView>(null);
    return (
        <TableContext.Provider value={{openedRow, setOpenedRow}}>
            <DataTable>
                <DataTable.Header
                    style={{backgroundColor: theme.colors.primaryContainer}}>
                    <DataTable.Title>Item</DataTable.Title>
                    <DataTable.Title>Tags</DataTable.Title>
                    <DataTable.Title>Space</DataTable.Title>
                    <View style={{flexShrink: 1, flexGrow: 0, display: 'flex'}}>
                        <IconButton
                            style={{
                                borderRadius: 0,
                                flex: 1,
                                margin: 0,
                            }}
                            icon={'basket-fill'}
                            iconColor="transparent"
                        />
                    </View>
                </DataTable.Header>

                <KeyboardAwareScrollView
                    style={styles.scrollContainer}
                    keyboardShouldPersistTaps={'handled'}>
                    {data.map(item => {
                        return (
                            <TableRow
                                item={item}
                                navigation={navigation}
                                key={item._objectKey()}
                                showSnackbarWithText={showSnackBarWithText}
                            />
                        );
                    })}
                    <View style={{height: 200}} />
                </KeyboardAwareScrollView>
            </DataTable>
        </TableContext.Provider>
    );
};

export default Table;
