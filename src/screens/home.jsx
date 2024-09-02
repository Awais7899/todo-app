import {View, Text, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import {PrimaryBox} from '../components';
import { AuthContext } from '../context';

export function Home({navigation}) {
  const {userData, setUserData} = useContext(AuthContext);
  const user = auth().currentUser;
  const userId = user.uid;

  console.log(userData)

  useEffect(() => {
    firebase
      .app()
      .database(
        'https://todo-8e5a6-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref(`/users/${userId}`)
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          console.log(snapshot.val())
          setUserData(snapshot.val());
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
      <View
        style={{
          padding: 16,
        }}>
        <View
          style={{
            alignItems: 'flex-end',
          }}>
          <TouchableOpacity
            onPress={() => {
              auth()
                .signOut()
                .then(() => console.log('User signed out!'));
            }}
            style={{
              backgroundColor: 'red',
              borderRadius: 18,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}>
            <Text style={{color: '#fff'}}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 24,
              paddingHorizontal: 12,
              paddingVertical: 16,
              color: '#000',
            }}>
            Welcome! {userData?.name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {userData?.role === 1 && (
            <PrimaryBox
              title="Members"
              onPress={() => {
                navigation.navigate('Members');
              }}
            />
          )}
          <PrimaryBox
            title="Tasks"
            onPress={() => {
              navigation.navigate('Tasks');
            }}
          />
        </View>
      </View>
    </View>
  );
}
