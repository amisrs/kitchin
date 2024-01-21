/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/InventoryScreen';
import Item from './data/Item/Item';
import { RealmProvider, createRealmContext, useRealm } from '@realm/react';
import Realm, { schemaVersion } from 'realm';
import { Appbar, Icon, MD3DarkTheme, MD3LightTheme, PaperProvider, Portal } from 'react-native-paper';
import AppBar from './components/AppBar';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import InventoryScreenNavigator from './screens/InventoryScreenNavigator';
import SettingsScreen from './screens/SettingsScreen';
import ItemHistoryLine from './data/Item/ItemHistoryLine';

const Stack = createNativeStackNavigator();
const realmConfig: Realm.Configuration = {
    schema: [Item],
};

function App(): React.JSX.Element {

    const Tab = createMaterialBottomTabNavigator();
    return (
        <RealmProvider schema={[Item, ItemHistoryLine]} deleteRealmIfMigrationNeeded={true} schemaVersion={2}>
            <PaperProvider theme={MD3LightTheme}>
                <NavigationContainer>
                    <Tab.Navigator >
                        <Tab.Screen name="Inventory" component={InventoryScreenNavigator} options={{tabBarIcon: ({focused, color}) => <Icon color={color} size={24} source={'archive'} />}}/>
                        <Tab.Screen name="Settings" component={SettingsScreen} />
                    </Tab.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </RealmProvider>
    );
}

export default App;
