import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {firebase} from '@react-native-firebase/database';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export function Members({navigation}) {
  const [members, setMembers] = useState([]);

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
              }}>
              {item?.name}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AssignTask', {
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
                  color: '#000',
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
    firebase
      .app()
      .database(
        'https://todo-8e5a6-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref(`/users`)
      .orderByChild('role')
      .equalTo(0)
      .once('value')
      .then(snapshot => {
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
        console.error('Error fetching users with role 0: ', error);
      });
  }, []);
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
            Members
          </Text>
        </View>
      </View>
      <FlatList
        data={members}
        keyExtractor={item => item?.id}
        renderItem={({item}) => userComponent(item)}
      />
    </View>
  );
}
