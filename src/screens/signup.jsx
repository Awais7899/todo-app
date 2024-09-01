import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import {InputField, PrimaryButton} from '../components';
import {useForm, Controller} from 'react-hook-form';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export function SignUp({navigation}) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 0,
    },
  });

  const onSubmit = data => {
    const {name, email, password, role} = data;
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async res => {
        console.log('User account created & signed in!', res);
        const userId = res.user.uid;

        firebase
          .app()
          .database(
            'https://todo-8e5a6-default-rtdb.asia-southeast1.firebasedatabase.app/',
          )
          .ref(`/users/${userId}`)
          .set({
            name: name,
            email: email,
            role: role, // Assuming role is 'user' by default
          });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          Alert.alert('That email address is invalid!');
        }
        console.log('error', error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>SignUp</Text>
        </View>
        <View style={styles.formContainer}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <InputField
                placeholder="Enter name"
                fieldValue={value}
                onBlur={onBlur}
                onChange={onChange}
                password={false}
              />
            )}
            name="name"
          />
          {errors.name && <ErrorText />}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <InputField
                placeholder="Enter email"
                fieldValue={value}
                onBlur={onBlur}
                onChange={onChange}
                password={false}
              />
            )}
            name="email"
          />
          {errors.email && <ErrorText />}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <InputField
                placeholder="Enter password"
                fieldValue={value}
                onBlur={onBlur}
                onChange={onChange}
                password={true}
              />
            )}
            name="password"
          />
          {errors.password && <ErrorText />}

          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <View
                style={{
                  flexDirection: 'row',
                  margin: 8,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    onChange(value === 0 ? 1 : 0);
                  }}
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 4,
                    backgroundColor: value === 1 ? 'red' : '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: value === 1 ? 0 : 1,
                  }}>
                  <FontAwesome5 color={'#fff'} size={13} name="check" />
                </TouchableOpacity>

                <Text
                  style={{
                    fontWeight: '500',
                    marginHorizontal: 8,
                  }}>
                  Regisrer as Admin
                </Text>
              </View>
            )}
            name="role"
          />

          <PrimaryButton text="Register" onPress={handleSubmit(onSubmit)} />
          <View
            style={{
              marginVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: '#000',
              }}>
              Don't have any account ?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <Text
                style={{
                  color: 'red',
                  fontWeight: '600',
                }}>
                LogIn
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  subContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  mainText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  formContainer: {},
});
