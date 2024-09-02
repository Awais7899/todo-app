import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {firebase} from '@react-native-firebase/database';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Header} from '../components';
import {COLORS} from '../utils/constants/color';
import {ASSIGNTASK} from '../utils/constants/route-name';

export function Members({navigation}) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

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
                color: COLORS.dark,
              }}>
              {item?.name}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(ASSIGNTASK, {
                  userId: item.id,
                });
              }}
              style={{
                backgroundColor: 'lightblue',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
              <Text
                style={{
                  color: COLORS.dark,
                }}>
                Assign Task
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [members],
  );

  useEffect(() => {
    setLoading(true);
    firebase
      .app()
      .database(process.env.DB_URL)
      .ref(`/users`)
      .orderByChild('role')
      .equalTo(0)
      .once('value')
      .then(snapshot => {
        setLoading(false);
        if (snapshot.exists()) {
          const users = snapshot.val();
          console.log(users);
          const usersArray = Object.keys(users).map(key => ({
            id: key, // The unique ID (userId) from the object
            ...users[key], // Spread the properties of each user
          }));
          setMembers(usersArray);
        } else {
          Alert.alert('No user exists');
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Error fetching users with role 0: ', error);
      });
  }, []);
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
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.white,
          }}>
          <Header text={'Members'} />
          <FlatList
            data={members}
            keyExtractor={item => item?.id}
            renderItem={({item}) => userComponent(item)}
          />
        </View>
      )}
    </>
  );
}
