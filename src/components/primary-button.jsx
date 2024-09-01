import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React from 'react';

export const PrimaryButton = ({text, onPress, loading}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 14,
        backgroundColor: 'red',
        borderRadius: 16,
        alignItems: 'center',
        marginVertical: 12,
      }}>
      {loading ? (
        <ActivityIndicator size={'small'} color={'#fff'} />
      ) : (
        <Text
          style={{
            color: '#fff',
            fontWeight: 600,
          }}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};
