/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Item from './data/Item/Item';
import { RealmProvider } from '@realm/react';
import { Icon, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import InventoryScreenNavigator from './screens/InventoryScreenNavigator';
import ItemHistoryLine from './data/Item/ItemHistoryLine';
import Space from './data/Space/Space';
import SpacesScreen from './screens/SpacesScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Keyboard } from 'react-native';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    const Tab = createMaterialBottomTabNavigator();
    return (
        <RealmProvider schema={[Item, ItemHistoryLine, Space]} deleteRealmIfMigrationNeeded={true} schemaVersion={2}>
            <PaperProvider theme={MD3LightTheme}>
                <SafeAreaProvider>
                    <NavigationContainer>
                        <Tab.Navigator
                            keyboardHidesNavigationBar={true}
                            barStyle={{position: 'relative'}}
                        >
                            <Tab.Screen
                                name="Inventory"
                                component={InventoryScreenNavigator}
                                options={{ tabBarIcon: ({ focused, color }) => <Icon color={color} size={24} source={'playlist-edit'} /> }
                                }
                            />
                            <Tab.Screen
                                name="Spaces"
                                component={SpacesScreen}
                                options={{ tabBarIcon: ({ focused, color }) => <Icon color={color} size={24} source={'wardrobe'} /> }}
                            />
                        </Tab.Navigator>
                    </NavigationContainer>
                </SafeAreaProvider>
            </PaperProvider>
        </RealmProvider>
    );
}

export default App;
