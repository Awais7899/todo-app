import {View, Text} from 'react-native';
import React from 'react';
import {AssignTask, Home, Members, TaskDetail, Tasks} from '../screens';
import {
  DASHBOARD,
  MEMBERS,
  TASKS,
  TASKDETAIL,
  ASSIGNTASK,
} from '../utils/constants/route-name';

import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={DASHBOARD}
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={MEMBERS}
        component={Members}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={TASKS}
        component={Tasks}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ASSIGNTASK}
        component={AssignTask}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={TASKDETAIL}
        component={TaskDetail}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
