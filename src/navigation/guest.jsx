import React from 'react';
import {Login, SignUp} from '../screens';

import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
export function Guest() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
