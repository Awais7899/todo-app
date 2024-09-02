import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import {UpdateTask} from '../components/modal';
import {AuthContext} from '../context';
import {Header} from '../components';
import {COLORS} from '../utils/constants/color';
import {TASKDETAIL} from '../utils/constants/route-name';

export function Tasks({navigation}) {
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = auth().currentUser;
  const userId = user.uid;

  const {userData} = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    if (userData.role === 0) {
      firebase
        .app()
        .database(process.env.DB_URL)
        .ref(`/tasks`)
        .orderByChild('userId')
        .equalTo(userId)
        .once('value')
        .then(snapshot => {
          setLoading(false);
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
          setLoading(false);
          console.error('Error fetching users with role 0: ', error);
        });
    } else {
      firebase
        .app()
        .database(process.env.DB_URL)
        .ref(`/tasks`)
        .once('value')
        .then(snapshot => {
          if (snapshot.exists()) {
            setLoading(false);
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
          setLoading(false);
          console.error('Error fetching users with role 0: ', error);
        });
    }
  }, []);

  const deleteTask = taskId => {
    firebase
      .app()
      .database(process.env.DB_URL)
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
      .database(process.env.DB_URL)
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
        <View style={styles.componentContainer}>
          <View>
            <Text
              style={{
                color: COLORS.dark,
                fontWeight: '500',
                fontSize: 16,
              }}>
              {item?.title}
            </Text>
            <Text
              style={{
                color: COLORS.dark,
                marginVertical: 6,
                fontSize: 13,
              }}>
              <Text
                style={{
                  fontWeight: '600',
                  color: COLORS.primary,
                }}>
                Priority :
              </Text>
              {'  '}
              {item?.priority}
            </Text>
            {userData.role === 1 ? (
              <Text
                style={{
                  color: COLORS.dark,
                  marginVertical: 6,
                  fontSize: 13,
                }}>
                <Text
                  style={{
                    fontWeight: '600',
                    color: COLORS.primary,
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
                      color: COLORS.dark,
                    }}>
                    update
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    deleteTask(item.id);
                  }}
                  style={{
                    backgroundColor: COLORS.primary,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}>
                  <Text
                    style={{
                      color: COLORS.white,
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
                      color: COLORS.white,
                    }}>
                    {item.status === 'pending' ? 'update status' : item.status}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(TASKDETAIL, {
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
                      color: COLORS.dark,
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
    <>
      {loading ? (
        <ActivityIndicator
          size={'large'}
          color={COLORS.primary}
          style={{
            flex: 1,
            alignItems: 'center',
          }}
        />
      ) : (
        <View style={styles.container}>
          <Header text={'Tasks'} />
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
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  componentContainer: {
    margin: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.dark,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
});
