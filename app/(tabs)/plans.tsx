import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Colors, PLANS } from '../../lib/data';
import PlanCard from '../../components/PlanCard';
import { Chip } from '../../components/ui';

const CATEGORIES = ['Shared', 'WordPress', 'Reseller', 'VPS', 'Dedicated'] as const;

export default function PlansScreen() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('Shared');
  const [annual, setAnnual] = useState(false);
  const plans = PLANS.filter((p) => p.category === category);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
        <View style={styles.toggleCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>{annual ? 'Annual billing' : 'Monthly billing'}</Text>
            <Text style={styles.toggleSub}>
              {category === 'VPS' ? 'Annual is 11x monthly on VPS plans.' : 'Annual is 10x monthly on this range.'}
            </Text>
          </View>
          <Switch value={annual} onValueChange={setAnnual} trackColor={{ true: Colors.green, false: '#cfd8cf' }} thumbColor="#fff" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }} contentContainerStyle={{ paddingRight: 8 }}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
          ))}
        </ScrollView>

        <View style={{ marginTop: 14 }}>
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} annual={annual} />
          ))}
        </View>

        <Text style={styles.note}>
          Prices in PKR as listed on pkhosting.com. Checkout price takes precedence. Free .com domain applies on 3-year shared terms. Dedicated servers are confirmed by quote.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  toggleCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.line, padding: 14,
  },
  toggleTitle: { fontSize: 15, fontWeight: '800', color: Colors.ink },
  toggleSub: { fontSize: 12.5, color: Colors.muted, marginTop: 2 },
  note: { fontSize: 11.5, color: Colors.muted, marginTop: 6, lineHeight: 16 },
});
