// import { ThemedText } from "@/components/themed-text";
// import { ThemedView } from "@/components/themed-view";

// const SignIn = () => {

//   return <>
//     <ThemedView>
//       <ThemedThemedText>Glad You{`\'`}re Here </ThemedThemedText>
//     </ThemedView>
//   </>
// };

// export default SignIn;

import { ThemedText } from '@/components/themed-text';
import { login } from '@/services/firebaseAuth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      router.replace('/(main)/today');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32, backgroundColor: '#fafaf9' }}>
      {/* Header */}
      <View style={{ marginBottom: 40, alignItems: 'center' }}>
        <ThemedText style={{ fontSize: 30, fontWeight: '700', color: '#292524', marginBottom: 8 }}>
          Glad You{`\'`}re Here
        </ThemedText>
        <ThemedText style={{ color: '#78716c' }}>
          Sign in to continue your journey
        </ThemedText>
      </View>

      {/* Form */}
      <View style={{ gap: 16 }}>
        {/* Email */}
        <View style={{ gap: 4 }}>
          <ThemedText style={{ fontSize: 14, fontWeight: '500', color: '#44403c' }}>
            Email
          </ThemedText>

          <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#e7e5e4', backgroundColor: '#ffffff', paddingHorizontal: 12 }}>
            <Ionicons name="mail-outline" size={20} color="#a8a29e" style={{ marginRight: 8 }} />
            <TextInput
              onChangeText={setEmail}
              placeholder="hello@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#a8a29e"
              style={{ flex: 1, paddingVertical: 12, color: '#292524' }}
            />
          </View>
        </View>


        {/* Password */}
        <View style={{ gap: 4 }}>
          <ThemedText style={{ fontSize: 14, fontWeight: '500', color: '#44403c' }}>
            Password
          </ThemedText>

          <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#e7e5e4', backgroundColor: '#ffffff', paddingHorizontal: 12 }}>
            <Ionicons name="lock-closed-outline" size={20} color="#a8a29e" style={{ marginRight: 8 }} />
            <TextInput
            onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              placeholderTextColor="#a8a29e"
              style={{ flex: 1, paddingVertical: 12, color: '#292524' }}
            />
          </View>
        </View>

        {/* Error */}
        {error && <ThemedText style={{ color: '#dc2626', fontSize: 14, marginTop: 4 }}>{error}</ThemedText>}

        {/* Sign In Button */}
        <TouchableOpacity
          disabled={loading}
          onPress={handleLogin}
          activeOpacity={0.85}
          style={{ marginTop: 16, width: '100%', backgroundColor: '#059669', paddingVertical: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: '#6ee7b7', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 4 }}
        >
          <ThemedText style={{ color: '#ffffff', fontWeight: '600' }}>Sign In</ThemedText>
          <Ionicons name="arrow-forward-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <ThemedText style={{ marginTop: 32, textAlign: 'center', fontSize: 14, color: '#78716c' }}>
        Don&apos;t have an account?{' '}
        <ThemedText onPress={() => router.replace('/(auth)/sign-up')} style={{ color: '#059669', fontWeight: '600', textDecorationLine: 'underline' }}>
          Create one
        </ThemedText>
      </ThemedText>
    </View>
  );
}
