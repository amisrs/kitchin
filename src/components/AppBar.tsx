import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';
import { Appbar, SegmentedButtons, Text } from 'react-native-paper';

const AppBar = ({ screen, navigation }: { screen: string, navigation: NativeStackNavigationProp<any> }) => {
    let hasBack = true;
    if (screen === 'List') {
        hasBack = false;
    }

    return (
        <Appbar.Header elevated>
            {hasBack && <Appbar.BackAction onPress={() => navigation.goBack()} />}
            <Appbar.Content title={screen} />
            <Appbar.Action icon="calendar" onPress={() => { }} />
            <Appbar.Action icon="magnify" onPress={() => { }} />
        </Appbar.Header>
    );
}
export default AppBar;