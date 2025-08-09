import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const API_URL = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';

type LoginForm = { email: string; password: string; };

export default function LoginScreen({ navigation }: any) {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({ defaultValues: { email: '', password: '' } });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const { access_token, refresh_token } = await res.json();
      await SecureStore.setItemAsync('access_token', access_token);
      await SecureStore.setItemAsync('refresh_token', refresh_token);
      navigation.replace('Home');
    } catch (err: any) {
      Alert.alert('Login failed', err.message || 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Controller
        name="email"
        control={control}
        rules={{ required: true, pattern: /\S+@\S+\.\S+/ }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            accessibilityLabel="Email"
          />
        )}
      />
      {errors.email && <Text style={styles.error}>Enter a valid email</Text>}
      <Controller
        name="password"
        control={control}
        rules={{ required: true, minLength: 8 }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            style={styles.input}
            secureTextEntry
            accessibilityLabel="Password"
          />
        )}
      />
      {errors.password && <Text style={styles.error}>Password min 8 chars</Text>}
      <Button title={isSubmitting ? 'Signing in...' : 'Sign In'} onPress={handleSubmit(onSubmit)} disabled={isSubmitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:16, backgroundColor:'#f9fafb' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:16 },
  input: { width:'100%', padding:12, marginVertical:8, backgroundColor:'#fff', borderRadius:8, borderWidth:1, borderColor:'#ccc' },
  error: { color:'red', fontSize:12 }
});