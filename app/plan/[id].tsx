import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Colors, PLANS, rs } from '../../lib/data';
import { addPlanToCart } from '../../lib/store';
import { Badge, Card, Check, PrimaryButton } from '../../components/ui';

export default function PlanDetail() {
  const { id, annual } = useLocalSearchParams<{ id: string; annual?: string }>();
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) {
    return (
      <View style={styles.center}>
        <Text style={styles.missing}>Plan not found.</Text>
      </View>
    );
  }
  const isAnnual = annual === '1';
  const price = isAnnual ? plan.monthly * plan.annualFactor : plan.monthly;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 28 }}>
      <Stack.Screen options={{ title: plan.name }} />
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <Card>
          <View style={styles.head}>
            <Text style={styles.name}>{plan.name}</Text>
            {plan.badge ? <Badge label={plan.badge.toUpperCase()} color={plan.badge === 'Most Popular' ? Colors.green : Colors.red} /> : null}
          </View>
          <Text style={styles.category}>{plan.category} Hosting</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{rs(price)}</Text>
            <Text style={styles.cycle}>{isAnnual ? ' /year' : ' /month'}</Text>
          </View>
          <Text style={styles.note}>
            {isAnnual ? `Billed annually. Monthly rate is ${rs(plan.monthly)}.` : 'Billed monthly. Switch to annual on the Plans tab to save.'}
          </Text>
        </Card>

        <Text style={styles.section}>What is included</Text>
        <Card>
          {plan.features.map((f) => (
            <Check key={f} label={f} />
          ))}
        </Card>

        <Text style={styles.section}>Good to know</Text>
        <Card>
          <Text style={styles.body}>
            Prices in PKR as listed on pkhosting.com; the checkout price takes precedence. Payment by JazzCash, Easypaisa, debit or credit card, PayPal or bank transfer. Local support from the Lahore team, phone and tickets answered daily.
          </Text>
        </Card>

        <View style={{ marginTop: 20 }}>
          <PrimaryButton label={`Add to Cart . ${rs(price)}${isAnnual ? '/year' : '/month'}`} onPress={() => addPlanToCart(plan, isAnnual)} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missing: { fontSize: 16, color: Colors.muted },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 19, fontWeight: '900', color: Colors.ink, flex: 1, marginRight: 8 },
  category: { fontSize: 13, color: Colors.muted, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 12 },
  price: { fontSize: 32, fontWeight: '900', color: Colors.greenDark },
  cycle: { fontSize: 15, color: Colors.muted, fontWeight: '600' },
  note: { fontSize: 12.5, color: Colors.muted, marginTop: 4 },
  section: { fontSize: 16, fontWeight: '800', color: Colors.ink, marginTop: 20, marginBottom: 10 },
  body: { fontSize: 13.5, color: Colors.inkSoft, lineHeight: 20 },
});
