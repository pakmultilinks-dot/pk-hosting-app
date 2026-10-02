import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Plan, rs } from '../lib/data';
import { addPlanToCart } from '../lib/store';
import { Badge, Check } from './ui';

export default function PlanCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  const router = useRouter();
  const price = annual ? plan.monthly * plan.annualFactor : plan.monthly;
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/plan/[id]', params: { id: plan.id, annual: annual ? '1' : '0' } })}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
    >
      <View style={styles.head}>
        <Text style={styles.name}>{plan.name}</Text>
        {plan.badge ? <Badge label={plan.badge.toUpperCase()} color={plan.badge === 'Most Popular' ? Colors.green : Colors.red} /> : null}
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{rs(price)}</Text>
        <Text style={styles.cycle}>{annual ? ' /year' : ' /month'}</Text>
      </View>
      {annual ? <Text style={styles.annualNote}>Billed annually. Monthly rate {rs(plan.monthly)}.</Text> : null}
      <View style={{ marginTop: 8 }}>
        {plan.features.slice(0, 5).map((f) => (
          <Check key={f} label={f} />
        ))}
        {plan.features.length > 5 ? <Text style={styles.more}>+ {plan.features.length - 5} more on details</Text> : null}
      </View>
      <View style={styles.actions}>
        <Pressable
          onPress={(e) => { e.stopPropagation?.(); addPlanToCart(plan, annual); }}
          style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.addBtnText}>Add to Cart</Text>
        </Pressable>
        <Text style={styles.details}>Details {'>'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1, borderColor: Colors.line,
    padding: 16, marginBottom: 12,
  },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '800', color: Colors.ink, flex: 1, marginRight: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  price: { fontSize: 26, fontWeight: '900', color: Colors.greenDark },
  cycle: { fontSize: 14, color: Colors.muted, fontWeight: '600' },
  annualNote: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  more: { fontSize: 12, color: Colors.green, fontWeight: '600', marginTop: 6 },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  addBtn: { backgroundColor: Colors.green, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  details: { marginLeft: 14, color: Colors.inkSoft, fontWeight: '600', fontSize: 14 },
});
