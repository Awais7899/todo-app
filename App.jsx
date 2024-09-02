import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Navigation} from './src/navigation';
import {AuthContextProvider} from './src/context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{flex: 1}}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <AuthContextProvider>
          <Navigation />
        </AuthContextProvider>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
