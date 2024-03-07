/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Item from './data/Item/Item';
import {RealmProvider} from '@realm/react';
import {Icon, MD3LightTheme, PaperProvider, Portal} from 'react-native-paper';
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import InventoryScreenNavigator from './screens/InventoryScreenNavigator';
import ItemHistoryLine from './data/Item/ItemHistoryLine';
import Space from './data/Space/Space';
import SpacesScreen from './screens/SpacesScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Keyboard} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import ItemTag from './data/Item/ItemTag';
import {PhotoFile, useCameraPermission} from 'react-native-vision-camera';
import {CameraContext} from './components/Camera/CameraContext';
import CameraScreen from './screens/CameraScreen';
import {AddItemModalContext} from './components/AddItemModalContext';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [photo, setPhoto] = useState<PhotoFile | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isModalActive, setIsModalActive] = useState(false);
    const [addItemName, setAddItemName] = useState('');
    const [addItemQuantity, setAddItemQuantity] = useState(0);
    const [addItemUnit, setAddItemUnit] = useState('');
    const [addItemSpace, setAddItemSpace] = useState<string | null>(null);
    const [addItemTags, setAddItemTags] = useState<string[]>([]);

    const Tab = createMaterialBottomTabNavigator();
    return (
        <RealmProvider
            schema={[Item, ItemHistoryLine, ItemTag, Space]}
            deleteRealmIfMigrationNeeded={true}
            schemaVersion={2}>
            <PaperProvider theme={MD3LightTheme}>
                <SafeAreaProvider>
                    <GestureHandlerRootView style={{flex: 1}}>
                        <BottomSheetModalProvider>
                            <CameraContext.Provider
                                value={{
                                    photo,
                                    setPhoto,
                                    isCameraActive,
                                    setIsCameraActive,
                                }}>
                                <AddItemModalContext.Provider
                                    value={{
                                        isModalActive,
                                        setIsModalActive,
                                        addItemName,
                                        setAddItemName,
                                        addItemQuantity,
                                        setAddItemQuantity,
                                        addItemUnit,
                                        setAddItemUnit,
                                        addItemSpace,
                                        setAddItemSpace,
                                    }}>
                                    <CameraScreen />
                                    <NavigationContainer>
                                        <Tab.Navigator
                                            keyboardHidesNavigationBar={true}
                                            barStyle={{position: 'relative'}}>
                                            <Tab.Screen
                                                name="Inventory"
                                                component={
                                                    InventoryScreenNavigator
                                                }
                                                options={{
                                                    tabBarIcon: ({
                                                        focused,
                                                        color,
                                                    }) => (
                                                        <Icon
                                                            color={color}
                                                            size={24}
                                                            source={
                                                                'playlist-edit'
                                                            }
                                                        />
                                                    ),
                                                }}
                                            />
                                            <Tab.Screen
                                                name="Spaces"
                                                component={SpacesScreen}
                                                options={{
                                                    tabBarIcon: ({
                                                        focused,
                                                        color,
                                                    }) => (
                                                        <Icon
                                                            color={color}
                                                            size={24}
                                                            source={'wardrobe'}
                                                        />
                                                    ),
                                                }}
                                            />
                                        </Tab.Navigator>
                                    </NavigationContainer>
                                </AddItemModalContext.Provider>
                            </CameraContext.Provider>
                        </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                </SafeAreaProvider>
            </PaperProvider>
        </RealmProvider>
    );
}

export default App;
