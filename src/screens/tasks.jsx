import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {firebase} from '@react-native-firebase/database';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {UpdateTask} from '../components/modal';

export function Tasks({navigation}) {
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState(false);
  const [taskId, setTaskId] = useState(null);
  useEffect(() => {
    firebase
      .app()
      .database(
        'https://todo-8e5a6-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref(`/tasks`)
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          const tasksArray = Object.keys(users).map(key => ({
            id: key, // The unique ID (userId) from the object
            ...users[key], // Spread the properties of each user
          }));
          setTasks(tasksArray);
        } else {
          Alert.alert('No user exists');
        }
      })
      .catch(error => {
        console.error('Error fetching users with role 0: ', error);
      });
  }, []);

  const deleteTask = taskId => {
    firebase
      .app()
      .database(
        'https://todo-8e5a6-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref(`/tasks/${taskId}`)
      .remove()
      .then(() => {
        const updatedArray = tasks.filter(item => item.id !== taskId);
        setTasks(updatedArray);
      })
      .catch(error => {
        console.error('Error deleting task: ', error);
      });
  };

  const userComponent = useCallback(
    item => {
      return (
        <View
          style={{
            margin: 12,
            borderRadius: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                color: '#000',
                fontWeight: '500',
                fontSize: 16,
              }}>
              {item?.title}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                setModal(!modal);
                setTaskId(item.id);
              }}
              style={{
                backgroundColor: 'lightblue',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                marginHorizontal: 8,
              }}>
              <Text
                style={{
                  color: '#000',
                }}>
                update
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                deleteTask(item.id);
              }}
              style={{
                backgroundColor: 'red',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
              <Text
                style={{
                  color: '#fff',
                }}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [tasks],
  );
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <View style={{padding: 16, flexDirection: 'row', alignItems: 'center'}}>
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
            }}>
            Tasks
          </Text>
        </View>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item?.id}
        renderItem={({item}) => userComponent(item)}
      />

      <UpdateTask
        setModal={setModal}
        modal={modal}
        taskId={taskId}
        setTasks={setTasks}
      />
    </View>
  );
}
