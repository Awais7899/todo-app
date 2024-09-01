import React, {useState, useEffect} from 'react';
import {View, Text, Modal, TouchableOpacity, Alert} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useForm, Controller} from 'react-hook-form';
import {InputField} from '../input-field';
import {ErrorText} from '../error-text';
import {PrimaryButton} from '../primary-button';
import DropDownPicker from 'react-native-dropdown-picker';
import firebase from '@react-native-firebase/app';

export function UpdateTask({setModal, modal, taskId, setTasks}) {
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
    setValue, // Used to set the default values
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      due_date: '',
      priority: '', // Default priority value
    },
  });

  useEffect(() => {
    // Fetch the task data from Firebase
    const reference = firebase
      .app()
      .database(
        'https://todo-8e5a6-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref(`/tasks/${taskId}`);

    reference
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          const taskData = snapshot.val();
          setValue('title', taskData.title);
          setValue('description', taskData.description);
          setValue('due_date', taskData.due_date);
          setValue('priority', taskData.priority);
        } else {
          setModal(false);
        }
      })
      .catch(error => {
        console.error('Error fetching task from Firebase:', error);
      });
  }, [setValue, setModal, taskId]);

  const onSubmit = data => {
    setLoading(true);
    const {title, description, due_date, priority} = data;
    const reference = firebase
      .app()
      .database(
        'https://todo-8e5a6-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref(`/tasks/${taskId}`);

    reference
      .update({
        title: title,
        description: description,
        due_date: due_date,
        priority: priority,
      })
      .then(() => {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId
              ? {...task, title, description, due_date, priority}
              : task,
          ),
        );
        setModal(false);
      })
      .catch(error => {
        console.error('Error updating task in Firebase:', error);
      });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modal}
      onRequestClose={() => {
        setModal(!modal);
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '90%',
            backgroundColor: '#fff',
            borderRadius: 12,
            elevation: 10,
            shadowOpacity: 0.75,
            shadowRadius: 0.75,
            shadowColor: '#000',
            shadowOffset: {
              height: 0,
              width: 2,
            },
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16,
            }}>
            <View style={{flex: 2, alignItems: 'center'}}>
              <Text
                style={{
                  fontWeight: '600',
                  fontWeight: '700',
                  fontSize: 22,
                  color: '#000',
                }}>
                Update Task
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setModal(!modal);
              }}>
              <MaterialIcons name="cancel" size={18} color={'#000'} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              padding: 16,
            }}>
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
                  password={false}
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
              render={({field: {onChange, value}}) => (
                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={onChange}
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
              text="Update"
              onPress={handleSubmit(onSubmit)}
              loader={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
