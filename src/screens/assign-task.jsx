import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {ErrorText, InputField, PrimaryButton} from '../components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {firebase} from '@react-native-firebase/database';
import DropDownPicker from 'react-native-dropdown-picker';

export function AssignTask({route, navigation}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const items = [
    {label: 'Low', value: 'Low'},
    {label: 'Medium', value: 'Medium'},
    {label: 'High', value: 'High'},
  ];

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      due_date: '',
      priority: '',
    },
  });

  const onSubmit = data => {
    setLoading(true);
    const taskId = uuidv4();
    const {title, description, due_date, priority} = data;
    const reference = firebase
      .app()
      .database(
        'https://todo-8e5a6-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref(`/tasks/${taskId}`);

    reference
      .set({
        title: title,
        description: description,
        due_date: due_date,
        priority: priority,
        status: "pending",
        userId: route.params?.userId,
      })
      .then(() => {
        setLoading(false);
        navigation.popToTop();
      })
      .catch(error => {
        setLoading(false);
        console.error('Error writing task to Firebase:', error);
      });
  };

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
                color: '#000',
              }}>
              Assign Task
            </Text>
          </View>
        </View>
        <View>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <InputField
                placeholder="Enter title"
                fieldValue={value}
                onBlur={onBlur}
                onChange={onChange}
                password={false}
                type={'text'}
              />
            )}
            name="title"
          />
          {errors.title && <ErrorText />}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <InputField
                placeholder="Enter description"
                fieldValue={value}
                onBlur={onBlur}
                onChange={onChange}
                password={false}
                type={'text'}
              />
            )}
            name="description"
          />
          {errors.description && <ErrorText />}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <InputField
                placeholder="Enter due date"
                fieldValue={value}
                onBlur={onBlur}
                onChange={onChange}
                password={true}
                type={'number'}
              />
            )}
            name="due_date"
          />
          {errors.due_date && <ErrorText />}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={callback => {
                  const selectedValue =
                    typeof callback === 'function' ? callback(value) : callback;
                  onChange(selectedValue);
                }}
                style={{
                  marginVertical: 12,
                  borderRadius: 16,
                }}
              />
            )}
            name="priority"
          />
          {errors.priority && <ErrorText />}

          <PrimaryButton
            text="Assign"
            onPress={handleSubmit(onSubmit)}
            loader={loading}
          />
        </View>
      </View>
    </View>
  );
}
