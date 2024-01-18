import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InventoryScreen from "./InventoryScreen"
import InventoryDetailScreen from "./InventoryDetailScreen";

const InventoryScreenNavigator = () => {
    const Stack = createNativeStackNavigator();

    return <Stack.Navigator>
        <Stack.Screen component={InventoryScreen} name="List" options={{ headerShown: false }}/>
        <Stack.Screen component={InventoryDetailScreen} name="Details" />
    </Stack.Navigator>
}

export default InventoryScreenNavigator