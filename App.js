import React from "react";
import UserTypeSelectionScreen from "./screens/userTypeScreen.jsx";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "./screens/authScreen.jsx";
import HomeScreen from "./screens/home.jsx";
import { AuthProvider } from "./context/authContext.js";
import CartScreen from "./screens/cartScreen.jsx";
import { Header } from "react-native/Libraries/NewAppScreen";
import CurrentOrdersScreen from "./screens/orders.jsx";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
        
          <Stack.Screen
            name="UserType"
            component={UserTypeSelectionScreen}
            options={{
              headerTransparent: true,
              headerShown: true,
              headerTitle: "Select your role",
            }}
          />
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{
              headerTransparent: true,
              headerTitle: "Authenticate yourself",
            }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerBackVisible: false }}
          />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Orders" component={CurrentOrdersScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
