import {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import App from './app';
import {Guest} from './guest';

const Stack = createStackNavigator();

export function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const subscribe = auth().onAuthStateChanged(user => {
      if (user != null) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return subscribe;
  }, []);

  return <>{isLoggedIn ? <App /> : <Guest />}</>;
}
