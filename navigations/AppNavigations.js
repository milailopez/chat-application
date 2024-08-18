// navigation/AppNavigation.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomePage from '../components/HomePage';
import Chat from '../components/Chat';
import Settings from '../components/Settings';
import Login from '../components/Login';
import Register from '../components/Register';

const Drawer = createDrawerNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="HomePage">
        <Drawer.Screen name="Home" component={HomePage} />
        <Drawer.Screen name="Chat" component={Chat} />
        <Drawer.Screen name="Settings" component={Settings} />
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Register" component={Register} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
