import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, ScrollView, Switch, useColorScheme } from 'react-native';

const Settings = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [checkInReminders, setCheckInReminders] = useState(true);
  const [pixelTheme, setPixelTheme] = useState(false);

  return (
    <ThemedView style={{ flex: 1, backgroundColor: colorScheme === 'light' ? '#fafaf9' : '#1f1f1f' }}>
      {/* Header */}
      <ThemedView style={{ paddingTop: 48, paddingHorizontal: 24, paddingBottom: 16, backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', borderBottomWidth: 1, borderBottomColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46' }}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16, gap: 32 }}>
        {/* Preferences Section */}
        <ThemedView style={{ backgroundColor: 'transparent' }}>
          <ThemedText style={{ fontSize: 10, fontWeight: '700', color: colorScheme === 'light' ? '#78716c' : '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Preferences</ThemedText>

          <ThemedView style={{ backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', borderRadius: 16, borderWidth: 1, borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46', overflow: 'hidden' }}>
            {/* Notifications */}
            <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colorScheme === 'light' ? '#f5f5f4' : '#3f3f46' }}>
              <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <ThemedView style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#d1fae5', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="notifications-outline" size={16} color="#10b981" />
                </ThemedView>
                <ThemedText style={{ fontSize: 14, fontWeight: '500', color: colorScheme === 'light' ? '#292524' : '#fafafa' }}>Notifications</ThemedText>
              </ThemedView>
              <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: '#10b981', false: colorScheme === 'light' ? '#e5e7eb' : '#3f3f46' }} thumbColor={colorScheme === 'light' ? '#ffffff' : '#fafafa'} />
            </ThemedView>

            {/* Daily Check-in */}
            <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colorScheme === 'light' ? '#f5f5f4' : '#3f3f46' }}>
              <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <ThemedView style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#d1fae5', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="time-outline" size={16} color="#10b981" />
                </ThemedView>
                <ThemedText style={{ fontSize: 14, fontWeight: '500', color: colorScheme === 'light' ? '#292524' : '#fafafa' }}>Daily Check-in</ThemedText>
              </ThemedView>
              <Switch value={checkInReminders} onValueChange={setCheckInReminders} trackColor={{ true: '#10b981', false: colorScheme === 'light' ? '#e5e7eb' : '#3f3f46' }} thumbColor={colorScheme === 'light' ? '#ffffff' : '#fafafa'} />
            </ThemedView>

            {/* Pixel Art Theme */}
            <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
              <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <ThemedView style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#ede9fe', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="sunny-outline" size={16} color="#7c3aed" />
                </ThemedView>
                <ThemedText style={{ fontSize: 14, fontWeight: '500', color: colorScheme === 'light' ? '#292524' : '#fafafa' }}>Pixel Art Theme</ThemedText>
              </ThemedView>
              <Switch value={pixelTheme} onValueChange={setPixelTheme} trackColor={{ true: '#7c3aed', false: colorScheme === 'light' ? '#e5e7eb' : '#3f3f46' }} thumbColor={colorScheme === 'light' ? '#ffffff' : '#fafafa'} />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Account Section */}
        <ThemedView style={{ backgroundColor: 'transparent' }}>
          <ThemedText style={{ fontSize: 10, fontWeight: '700', color: colorScheme === 'light' ? '#78716c' : '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Account</ThemedText>

          <ThemedView style={{ backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', borderRadius: 16, borderWidth: 1, borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46', overflow: 'hidden' }}>
            {/* Privacy & Security */}
            <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colorScheme === 'light' ? '#f5f5f4' : '#3f3f46' }}>
              <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'transparent' }}>
                <ThemedView style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colorScheme === 'light' ? '#e5e7eb' : '#3f3f46', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="shield-outline" size={16} color={colorScheme === 'light' ? '#57534e' : '#10b981'} />
                </ThemedView>
                <ThemedText style={{ fontSize: 14, fontWeight: '500', color: colorScheme === 'light' ? '#292524' : '#fafafa' }}>Privacy & Security</ThemedText>
              </ThemedView>
              <Ionicons name="chevron-forward" size={16} color={colorScheme === 'light' ? '#9ca3af' : '#a1a1aa'} />
            </Pressable>

            {/* Log Out */}
            <Pressable onPress={() => navigation.navigate('Login' as never)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
              <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'transparent' }}>
                <ThemedView style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="log-out-outline" size={16} color="#ef4444" />
                </ThemedView>
                <ThemedText style={{ fontSize: 14, fontWeight: '500', color: '#ef4444' }}>Log Out</ThemedText>
              </ThemedView>
            </Pressable>
          </ThemedView>
        </ThemedView>

        {/* App Version */}
        <ThemedText style={{ fontSize: 10, color: colorScheme === 'light' ? '#78716c' : '#a1a1aa', textAlign: 'center', marginTop: 32 }}>Here App v1.0.0</ThemedText>
      </ScrollView>
    </ThemedView>
  );
};

export default Settings;
