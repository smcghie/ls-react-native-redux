import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as Keychain from 'react-native-keychain';

export default function TabFourScreen() {
  const handleRemovePassword = async () => {
    try {
      await Keychain.resetGenericPassword();
      alert('Password removed successfully!');
      router.replace('../login')
    } catch (error) {
      console.error('Could not remove the password from keychain:', error);
      alert('Failed to remove the password. Please try again.');
    }
  };

  const handleLogToken = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log('Token:', credentials.password);
        alert(`Token: ${credentials.password}`);
      } else {
        console.log('No credentials stored.');
        alert('No token found.');
      }
    } catch (error) {
      console.error('Could not retrieve the token from keychain:', error);
      alert('Failed to retrieve the token. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Four</Text>
      <View style={styles.separator}  />
      <Button
        title="Remove Password"
        onPress={handleRemovePassword}
      />
            <Button
        title="Log Token"
        onPress={handleLogToken}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
