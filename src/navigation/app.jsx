import {View, Text} from 'react-native';
import React from 'react';
import {AssignTask, Home, Members, Tasks} from '../screens';

import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Members"
        component={Members}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Tasks"
        component={Tasks}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="AssignTask"
        component={AssignTask}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
