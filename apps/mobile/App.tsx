import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import PayrollCalculateScreen from './screens/PayrollCalculateScreen';
import PayrollListScreen from './screens/PayrollListScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  PayrollCalculate: undefined;
  PayrollList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PayrollCalculate" component={PayrollCalculateScreen} />
        <Stack.Screen name="PayrollList" component={PayrollListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}