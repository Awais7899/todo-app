import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

export function PrimaryBox({title, onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: 100,
        width: '45%',
        backgroundColor: 'red',
        marginVertical: 16,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: '#fff',
          fontSize: 16,
          fontWeight: '500',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
