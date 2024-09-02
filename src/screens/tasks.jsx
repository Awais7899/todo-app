import {View, Text, TouchableOpacity, FlatList, Alert} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {UpdateTask} from '../components/modal';
import {AuthContext} from '../context';

export function Tasks({navigation}) {
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState(false);
  const [taskId, setTaskId] = useState(null);

  const user = auth().currentUser;
  const userId = user.uid;

  const {userData} = useContext(AuthContext);

  useEffect(() => {
    if (userData.role === 0) {
      firebase
        .app()
        .database(
          'https://todo-8e5a6-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref(`/tasks`)
        .orderByChild('userId')
        .equalTo(userId)
        .once('value')
        .then(snapshot => {
          if (snapshot.exists()) {
            const users = snapshot.val();
            const usersArray = Object.keys(users).map(key => ({
              id: key, // The unique ID (userId) from the object
              ...users[key], // Spread the properties of each user
            }));
            setTasks(usersArray);
          } else {
            Alert.alert("No user's tasks exist exists.");
          }
        })
        .catch(error => {
          console.error('Error fetching users with role 0: ', error);
        });
    } else {
      firebase
        .app()
        .database(
          'https://todo-8e5a6-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref(`/tasks`)
        .once('value')
        .then(snapshot => {
          if (snapshot.exists()) {
            const tasks = snapshot.val();
            const tasksArray = Object.keys(tasks).map(key => ({
              id: key, // The unique ID (userId) from the object
              ...tasks[key], // Spread the properties of each user
            }));
            setTasks(tasksArray);
          } else {
            Alert.alert('No tasks exists');
          }
        })
        .catch(error => {
          console.error('Error fetching users with role 0: ', error);
        });
    }
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

  const updateTaskStatus = taskId => {
    const reference = firebase
      .app()
      .database(
        'https://todo-8e5a6-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref(`/tasks/${taskId}`);

    reference
      .update({
        status: 'completed',
      })
      .then(() => {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? {...task, status: 'completed'} : task,
          ),
        );
      })
      .catch(error => {
        console.error('Error updating task in Firebase:', error);
      });
  };

  const taskComponent = useCallback(
    item => {
      return (
        <View
          style={{
            margin: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 16,
            paddingHorizontal: 8,
            paddingVertical: 6,
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
            <Text
              style={{
                color: '#000',
                marginVertical: 6,
                fontSize: 13,
              }}>
              <Text
                style={{
                  fontWeight: '600',
                  color: 'red',
                }}>
                Priority :
              </Text>
              {'  '}
              {item?.priority}
            </Text>
            {userData.role === 1 ? (
              <Text
                style={{
                  color: '#000',
                  marginVertical: 6,
                  fontSize: 13,
                }}>
                <Text
                  style={{
                    fontWeight: '600',
                    color: 'red',
                  }}>
                  Status :
                </Text>
                {'  '} {item?.status}
              </Text>
            ) : null}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {userData.role === 1 ? (
              <>
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
              </>
            ) : (
              <>
                <TouchableOpacity
                  disabled={item.status === 'completed' ? true : false}
                  onPress={() => {
                    updateTaskStatus(item.id);
                  }}
                  style={{
                    backgroundColor:
                      item.status === 'completed' ? 'green' : 'red',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                    }}>
                    {item.status === 'pending' ? 'update status' : item.status}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('TaskDetail', {
                      taskId: item.id,
                    });
                  }}
                  style={{
                    backgroundColor: 'lightblue',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    marginHorizontal: 6,
                  }}>
                  <Text
                    style={{
                      color: '#000',
                    }}>
                    Details
                  </Text>
                </TouchableOpacity>
              </>
            )}
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
              color:"#000"
            }}>
            Tasks
          </Text>
        </View>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item?.id}
        renderItem={({item}) => taskComponent(item)}
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
