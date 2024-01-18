import * as React from 'react';
import { Appbar, Text } from 'react-native-paper';

const AppBar = ({ screen }: { screen: string }) => {

    console.log(screen)
    return (
        <Appbar.Header>
            <Appbar.Content title={screen} />
            <Appbar.Action icon="calendar" onPress={() => { }} />
            <Appbar.Action icon="magnify" onPress={() => { }} />
        </Appbar.Header>
    );
}
export default AppBar;