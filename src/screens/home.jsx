import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import {PrimaryBox} from '../components';
import {AuthContext} from '../context';
import {COLORS} from '../utils/constants/color';
import {MEMBERS, TASKS} from '../utils/constants/route-name';

export function Home({navigation}) {
  const {userData, setUserData} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const user = auth().currentUser;
  const userId = user.uid;
  console.log(userId);
  console.log(userData);

  useEffect(() => {
    setLoading(true);
    firebase
      .app()
      .database(process.env.DB_URL)
      .ref(`/users/${userId}`)
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          setUserData(snapshot.val());
        } else {
          console.log('User data not found!');
        }
        setLoading(false);
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
                  backgroundColor: COLORS.primary,
                  borderRadius: 18,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}>
                <Text style={{color: COLORS.white}}>Sign Out</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 24,
                  paddingHorizontal: 12,
                  paddingVertical: 16,
                  color: COLORS.dark,
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
                    navigation.navigate(MEMBERS);
                  }}
                />
              )}
              <PrimaryBox
                title="Tasks"
                onPress={() => {
                  navigation.navigate(TASKS);
                }}
              />
            </View>
          </View>
        </View>
      )}
    </>
  );
}
