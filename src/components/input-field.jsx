import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
export function InputField({
  fieldValue,
  placeholder,
  onBlur,
  onChange,
  type,
  password,
}) {
  const [secure, setSecure] = useState(true);
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
        secureTextEntry={password && secure}
      />
      {password && (
        <TouchableOpacity
          onPress={() => {
            setSecure(!secure);
          }}
          style={{position: 'absolute', right: 12, top: 12}}>
          {secure ? (
            <Entypo name="eye" size={20} color={'#000'} />
          ) : (
            <Entypo name="eye-with-line" size={20} color={'#000'} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 12,
  },
});
