import {View, Text} from 'react-native';
import React from 'react';

export function ErrorText() {
  return (
    <View>
      <Text
        style={{
          color: 'red',
          fontWeight: '500',
        }}>
        This field is required.
      </Text>
    </View>
  );
}
