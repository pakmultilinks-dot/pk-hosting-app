import { Tabs } from 'expo-router';
import { Text, View, type ColorValue } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../../lib/data';
import { useStore } from '../../lib/store';

function TabIcon({ name, color }: { name: React.ComponentProps<typeof FontAwesome>['name']; color: ColorValue }) {
  return <FontAwesome name={name} size={22} color={color} />;
}

function CartTabIcon({ color }: { color: ColorValue }) {
  const count = useStore((s) => s.cart.length);
  return (
    <View>
      <FontAwesome name="shopping-cart" size={22} color={color} />
      {count > 0 ? (
        <View
          style={{
            position: 'absolute', right: -10, top: -6, backgroundColor: Colors.red, borderRadius: 9,
            minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{count}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.green,
        tabBarInactiveTintColor: '#8a9a8f',
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6, borderTopColor: Colors.line },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        headerStyle: { backgroundColor: Colors.ink },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '800', fontSize: 18 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', headerTitle: 'PK Hosting', tabBarIcon: ({ color }) => <TabIcon name="home" color={color} /> }} />
      <Tabs.Screen name="plans" options={{ title: 'Plans', tabBarIcon: ({ color }) => <TabIcon name="server" color={color} /> }} />
      <Tabs.Screen name="domains" options={{ title: 'Domains', tabBarIcon: ({ color }) => <TabIcon name="globe" color={color} /> }} />
      <Tabs.Screen name="cart" options={{ title: 'Cart', tabBarIcon: ({ color }) => <CartTabIcon color={color} /> }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: ({ color }) => <TabIcon name="user" color={color} /> }} />
    </Tabs>
  );
}
