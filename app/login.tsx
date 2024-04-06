import callApi from '@/utilities/callApi';
import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Text} from 'react-native';
import * as Keychain from 'react-native-keychain';
import { Album } from '@/models/models';
import { useRouter } from 'expo-router';
import { API_URL } from '@env';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [albums, setAlbums] = useState<Album[]>([]);
  const router = useRouter();

  async function getToken() {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving token', error);
      return null;
    }
  }

  const handleLogin = async () => {
    console.log('Email:', email, 'Password:', password);
    
    try {
      const res = await callApi(`${API_URL}/auth/mobileLogin`, {
        method: 'POST',
        body: { email, password }
      });
      //console.log('Res:', res);
      if(res.user.token){
        await storeToken(res.user.token);
        console.log("User token: ", res.user.token)
        console.log('Login successful:', res);
        router.replace('/(tabs)')
      }
  
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  async function storeToken(userToken: string) {
    await Keychain.setGenericPassword('token', userToken);
  }

  const testQuery = async () => {    
    const token = await getToken();
    console.log("TOKEN: ", token)
    try {
      const res = await callApi(`${API_URL}/album/user/16b43208-ab8d-481d-a4d6-8b7e4b4c9478`, {
        method: 'GET',
      });
      setAlbums(res)

      console.log('ALBUMS:', albums);
    } catch (error) {
      console.error('Query failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* <MapComponent /> */}
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Test Query" onPress={testQuery} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
  },
});

export default LoginScreen;
