import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors, COMPANY, rs } from '../../lib/data';
import { cartTotals, removeFromCart, setPromo, showToast, useStore } from '../../lib/store';
import { Card, PrimaryButton, SectionTitle } from '../../components/ui';

export default function CartScreen() {
  const router = useRouter();
  const cart = useStore((s) => s.cart);
  const promoApplied = useStore((s) => s.promoApplied);
  const [promo, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState('');
  const totals = cartTotals();

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === COMPANY.promo.code) {
      setPromo(true);
      setPromoMsg('WELCOME10 applied: 10% off Shared and Reseller items.');
      showToast('Promo applied');
    } else {
      setPromo(false);
      setPromoMsg('That code is not valid for these items.');
    }
  };

  if (cart.length === 0) {
    return (
      <View style={styles.empty}>
        <FontAwesome name="shopping-cart" size={44} color="#c3d2c6" />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySub}>Browse hosting plans and domains, then come back here to check out.</Text>
        <View style={{ width: '70%', marginTop: 18 }}>
          <PrimaryButton label="Browse Plans" onPress={() => router.push('/plans')} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
        <SectionTitle title={`${cart.length} item${cart.length > 1 ? 's' : ''} in cart`} />
        {cart.map((item) => (
          <Card key={item.key} style={{ marginBottom: 10 }}>
            <View style={styles.rowBetween}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemPrice}>{rs(item.price)}</Text>
            </View>
            <Text style={styles.itemSub}>{item.subtitle} . {item.cycle.replace('/', 'per ').replace('per years', 'years')}</Text>
            <Pressable onPress={() => removeFromCart(item.key)} style={{ marginTop: 8, alignSelf: 'flex-start' }}>
              <Text style={styles.remove}>Remove</Text>
            </Pressable>
          </Card>
        ))}

        <SectionTitle title="Promo code" />
        <View style={styles.promoRow}>
          <TextInput
            value={promo}
            onChangeText={setPromoInput}
            placeholder="Try WELCOME10"
            placeholderTextColor="#8a9a8f"
            style={styles.promoInput}
            autoCapitalize="characters"
          />
          <Pressable onPress={applyPromo} style={({ pressed }) => [styles.promoBtn, pressed && { opacity: 0.85 }]}>
            <Text style={styles.promoBtnText}>Apply</Text>
          </Pressable>
        </View>
        {promoMsg ? <Text style={[styles.promoMsg, { color: promoApplied ? Colors.green : Colors.red }]}>{promoMsg}</Text> : null}

        <SectionTitle title="Summary" />
        <Card>
          <View style={styles.sumRow}><Text style={styles.sumLabel}>Subtotal</Text><Text style={styles.sumVal}>{rs(totals.subtotal)}</Text></View>
          {totals.discount > 0 ? (
            <View style={styles.sumRow}><Text style={[styles.sumLabel, { color: Colors.green }]}>WELCOME10 discount</Text><Text style={[styles.sumVal, { color: Colors.green }]}>- {rs(totals.discount)}</Text></View>
          ) : null}
          <View style={[styles.sumRow, { borderTopWidth: 1, borderTopColor: Colors.line, paddingTop: 10, marginTop: 4 }]}>
            <Text style={styles.totalLabel}>Total due today</Text><Text style={styles.totalVal}>{rs(totals.total)}</Text>
          </View>
          <Text style={styles.taxNote}>Prices include PKR billing as listed on pkhosting.com. Checkout confirms the final price.</Text>
        </Card>

        <View style={{ marginTop: 18 }}>
          <PrimaryButton label="Proceed to Checkout" onPress={() => router.push('/checkout')} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, backgroundColor: Colors.bg },
  emptyTitle: { fontSize: 19, fontWeight: '800', color: Colors.ink, marginTop: 14 },
  emptySub: { fontSize: 13.5, color: Colors.muted, textAlign: 'center', marginTop: 6, lineHeight: 19 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemTitle: { fontSize: 15, fontWeight: '800', color: Colors.ink, flex: 1, marginRight: 10 },
  itemPrice: { fontSize: 15, fontWeight: '900', color: Colors.greenDark },
  itemSub: { fontSize: 12.5, color: Colors.muted, marginTop: 3 },
  remove: { color: Colors.red, fontSize: 13, fontWeight: '700' },
  promoRow: { flexDirection: 'row' },
  promoInput: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.line, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.ink },
  promoBtn: { backgroundColor: Colors.ink, borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center', marginLeft: 10 },
  promoBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  promoMsg: { fontSize: 12.5, marginTop: 8, fontWeight: '600' },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  sumLabel: { fontSize: 14, color: Colors.inkSoft },
  sumVal: { fontSize: 14, fontWeight: '700', color: Colors.ink },
  totalLabel: { fontSize: 15, fontWeight: '800', color: Colors.ink },
  totalVal: { fontSize: 17, fontWeight: '900', color: Colors.greenDark },
  taxNote: { fontSize: 11.5, color: Colors.muted, marginTop: 8, lineHeight: 16 },
});
