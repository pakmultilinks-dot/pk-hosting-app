import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors, rs } from '../lib/data';
import { Card, PrimaryButton } from '../components/ui';

export default function Success() {
  const router = useRouter();
  const { order, total, method } = useLocalSearchParams<{ order: string; total: string; method: string }>();
  const totalNum = Number(total ?? 0);

  return (
    <View style={styles.screen}>
      <View style={styles.checkWrap}>
        <FontAwesome name="check" size={38} color="#fff" />
      </View>
      <Text style={styles.title}>Order confirmed</Text>
      <Text style={styles.sub}>
        Shukriya! Your order <Text style={{ fontWeight: '800', color: Colors.ink }}>{order}</Text> is confirmed. A payment request and invoice will be sent to your email and phone.
      </Text>
      <Card style={{ width: '100%', marginTop: 20 }}>
        <View style={styles.row}><Text style={styles.k}>Order</Text><Text style={styles.v}>{order}</Text></View>
        <View style={styles.row}><Text style={styles.k}>Amount</Text><Text style={styles.v}>{rs(isNaN(totalNum) ? 0 : totalNum)}</Text></View>
        <View style={styles.row}><Text style={styles.k}>Payment method</Text><Text style={styles.v}>{method}</Text></View>
        <View style={styles.row}><Text style={styles.k}>Status</Text><Text style={[styles.v, { color: Colors.green }]}>Processing, provisioning next</Text></View>
      </Card>
      <Text style={styles.note}>Your services now appear under Account, marked Processing until provisioning completes.</Text>
      <View style={{ width: '100%', marginTop: 18 }}>
        <PrimaryButton label="View My Services" onPress={() => router.replace('/account')} />
        <View style={{ height: 10 }} />
        <PrimaryButton label="Back to Home" tone="dark" onPress={() => router.replace('/')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', paddingHorizontal: 22, paddingTop: 48 },
  checkWrap: { width: 84, height: 84, borderRadius: 42, backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: Colors.ink, marginTop: 18 },
  sub: { fontSize: 14, color: Colors.muted, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  k: { fontSize: 13.5, color: Colors.muted },
  v: { fontSize: 13.5, fontWeight: '700', color: Colors.ink },
  note: { fontSize: 12.5, color: Colors.muted, textAlign: 'center', marginTop: 14, lineHeight: 18 },
});
