import {createNativeStackNavigator} from '@react-navigation/native-stack';
import InventoryScreen from './InventoryScreen';
import InventoryDetailScreen from './InventoryDetailScreen';
import AppBar from '../components/AppBar';
import CameraScreen from './CameraScreen';

const InventoryScreenNavigator = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                header: props => (
                    <AppBar
                        screen={props.route.name}
                        navigation={props.navigation}
                    />
                ),
            }}>
            <Stack.Screen component={InventoryScreen} name="List" />
            <Stack.Screen component={InventoryDetailScreen} name="Details" />
            <Stack.Screen component={CameraScreen} name="Camera" />
        </Stack.Navigator>
    );
};

export default InventoryScreenNavigator;
