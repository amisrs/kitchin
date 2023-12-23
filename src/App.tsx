/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import Item from './data/Item/Item';
import { RealmProvider, createRealmContext, useRealm } from '@realm/react';
import Realm, { schemaVersion } from 'realm';
import ItemRepository from './data/Item/ItemRepository';
import ItemUnit from './data/Item/ItemUnit';

const Stack = createNativeStackNavigator();
const realmConfig: Realm.Configuration = {
    schema: [Item],
};

function App(): React.JSX.Element {

    return (
        <RealmProvider schema={[Item]} schemaVersion={2}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </RealmProvider>
    );
}

export default App;
