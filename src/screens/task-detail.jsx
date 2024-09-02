import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {firebase} from '@react-native-firebase/database';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export function TaskDetail({route, navigation}) {
  const [taskData, setTaskData] = useState({});

  useEffect(() => {
    firebase
      .app()
      .database(
        'https://todo-8e5a6-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref(`/tasks/${route.params.taskId}`)
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          setTaskData(snapshot.val());
        } else {
          console.log('User data not found!');
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <View style={{padding: 16}}>
        <View style={{ flexDirection: 'row', alignItems: 'center',}}>
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}>
            <MaterialIcons name="arrow-back" size={22} color={'#000'} />
          </TouchableOpacity>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text
              style={{
                fontWeight: '600',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: 24,
                color:'#000'
              }}>
              Task Detail
            </Text>
          </View>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontWeight: '500',
                fontSize: 16,
                marginVertical: 8,
                color: 'red',
              }}>
              Title:
            </Text>
            <Text style={{fontSize: 14, margin: 8, color: '#000'}}>
              {taskData.title}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontWeight: '500',
                fontSize: 16,
                marginVertical: 8,
                color: 'red',
              }}>
              Status:
            </Text>
            <Text style={{fontSize: 14, margin: 8, color: '#000'}}>
              {taskData?.status}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontWeight: '500',
                fontSize: 16,
                marginVertical: 8,
                color: 'red',
              }}>
              Priority:
            </Text>
            <Text style={{fontSize: 14, margin: 8, color: '#000'}}>
              {taskData?.priority}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontWeight: '500',
                fontSize: 16,
                marginVertical: 8,
                color: 'red',
              }}>
              Due Date:
            </Text>
            <Text style={{fontSize: 14, margin: 8, color: '#000'}}>
              {taskData?.due_date}
            </Text>
          </View>
          <View style={{ 
            flexDirection:"row",
           }}>
            <Text
              style={{
                fontWeight: '500',
                fontSize: 16,
                marginVertical: 8,
                color: 'red',
              }}>
              Description :
            </Text>
            <Text style={{fontSize: 14, color: '#000', margin:8, flex:1}}>
              {taskData?.description}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
