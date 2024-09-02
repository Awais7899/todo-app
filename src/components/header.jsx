import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export function Header({text}) {
  const navigation = useNavigation();
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', padding: 16}}>
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
          {text}
        </Text>
      </View>
    </View>
  );
}
