import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../lib/data';
import { useStore } from '../lib/store';

function Toast() {
  const toast = useStore((s) => s.toast);
  if (!toast) return null;
  return (
    <View style={styles.toastWrap} pointerEvents="none">
      <View style={styles.toast}>
        <Text style={styles.toastText}>{toast}</Text>
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.ink },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '800' },
          contentStyle: { backgroundColor: Colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="plan/[id]" options={{ title: 'Plan Details' }} />
        <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
        <Stack.Screen name="success" options={{ title: 'Order Confirmed', headerBackVisible: false }} />
        <Stack.Screen name="ticket/[id]" options={{ title: 'Support Ticket' }} />
        <Stack.Screen name="new-ticket" options={{ title: 'New Ticket' }} />
        <Stack.Screen name="about" options={{ title: 'About PK Hosting' }} />
      </Stack>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  toastWrap: { position: 'absolute', left: 0, right: 0, bottom: 96, alignItems: 'center', zIndex: 50 },
  toast: { backgroundColor: Colors.ink, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 10, maxWidth: '88%' },
  toastText: { color: '#fff', fontSize: 13.5, fontWeight: '600', textAlign: 'center' },
});
