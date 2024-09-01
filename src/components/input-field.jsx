import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';

export function InputField({fieldValue, placeholder, onBlur, onChange, type}) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        value={fieldValue}
        style={{
          borderWidth: 1,
          borderRadius: 16,
          paddingHorizontal: 12,
        }}
        keyboardType={type === 'number' ? 'numeric' : 'default'}
        onBlur={onBlur}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 12,
  },
});
