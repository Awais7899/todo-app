import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import {InputField, PrimaryButton, ErrorText} from '../components';
import {useForm, Controller} from 'react-hook-form';
import auth from '@react-native-firebase/auth';
import {COLORS} from '../utils/constants/color';
import {SIGNUP} from '../utils/constants/route-name';

export function Login({navigation}) {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = data => {
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then(() => {
        console.log('User account created & signed in!');
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          Alert.alert('That email address is invalid!');
        }
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>LogIn</Text>
        </View>
        <View style={styles.formContainer}>
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

          <PrimaryButton
            text="LogIn"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
          />

          <View
            style={{
              marginVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: COLORS.dark,
              }}>
              Don't have any account ?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(SIGNUP);
              }}>
              <Text
                style={{
                  color: COLORS.primary,
                  fontWeight: '600',
                }}>
                SignUp
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
    backgroundColor: COLORS.white,
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
    color: COLORS.dark,
  },
});
