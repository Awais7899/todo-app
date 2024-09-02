import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {firebase} from '@react-native-firebase/database';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Header} from '../components';
import {COLORS} from '../utils/constants/color';

export function TaskDetail({route, navigation}) {
  const [taskData, setTaskData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    firebase
      .app()
      .database(process.env.DB_URL)
      .ref(`/tasks/${route.params.taskId}`)
      .once('value')
      .then(snapshot => {
        setLoading(false);
        if (snapshot.exists()) {
          console.log(snapshot.val());
          setTaskData(snapshot.val());
        } else {
          console.log('User data not found!');
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Error fetching user data:', error);
      });
  }, []);

  return (
    <>
      {loading ? (
        <ActivityIndicator
          size={'large'}
          color={'red'}
          style={{
            flex: 1,
            alignItems: 'center',
          }}
        />
      ) : (
        <View style={styles.container}>
          <Header text={'Task Details'} />
          <View style={{padding: 16}}>
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
                  color: COLORS.primary,
                }}>
                Title:
              </Text>
              <Text style={{fontSize: 14, margin: 8, color: COLORS.dark}}>
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
                  color: COLORS.primary,
                }}>
                Status:
              </Text>
              <Text style={{fontSize: 14, margin: 8, color: COLORS.dark}}>
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
                  color: COLORS.primary,
                }}>
                Priority:
              </Text>
              <Text style={{fontSize: 14, margin: 8, color: COLORS.dark}}>
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
                  color: COLORS.primary,
                }}>
                Due Date:
              </Text>
              <Text style={{fontSize: 14, margin: 8, color: COLORS.dark}}>
                {taskData?.due_date}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 16,
                  marginVertical: 8,
                  color: COLORS.primary,
                }}>
                Description :
              </Text>
              <Text
                style={{fontSize: 14, color: COLORS.dark, margin: 8, flex: 1}}>
                {taskData?.description}
              </Text>
            </View>
          </View>
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
});
