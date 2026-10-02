import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors, COMPANY, rs } from '../lib/data';
import { cartTotals, placeOrder, showToast, useStore } from '../lib/store';
import { Card, PrimaryButton } from '../components/ui';

const METHODS = [
  { id: 'JazzCash', icon: 'mobile' as const },
  { id: 'Easypaisa', icon: 'mobile' as const },
  { id: 'Debit / Credit Card', icon: 'credit-card' as const },
  { id: 'PayPal', icon: 'paypal' as const },
  { id: 'Bank Transfer', icon: 'bank' as const },
];

export default function Checkout() {
  const router = useRouter();
  const cart = useStore((s) => s.cart);
  const totals = cartTotals();
  const [method, setMethod] = useState('JazzCash');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (cart.length === 0) {
      setError('Your cart is empty. Add a plan or domain first.');
      return;
    }
    if (name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address for your invoice.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number (used for JazzCash/Easypaisa confirmation).');
      return;
    }
    const order = placeOrder(method);
    showToast('Order placed');
    router.replace({ pathname: '/success', params: { order: order.id, total: String(order.total), method } });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
        <Text style={styles.h}>Your details</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor="#8a9a8f" style={styles.input} />
        <TextInput value={email} onChangeText={setEmail} placeholder="Email for invoice" placeholderTextColor="#8a9a8f" style={styles.input} autoCapitalize="none" keyboardType="email-address" />
        <TextInput value={phone} onChangeText={setPhone} placeholder="Phone (03xx xxxxxxx)" placeholderTextColor="#8a9a8f" style={styles.input} keyboardType="phone-pad" />

        <Text style={styles.h}>Payment method</Text>
        {METHODS.map((m) => {
          const active = method === m.id;
          return (
            <Pressable key={m.id} onPress={() => setMethod(m.id)} style={[styles.method, active && styles.methodActive]}>
              <FontAwesome name={m.icon} size={18} color={active ? Colors.green : '#7c8d80'} />
              <Text style={[styles.methodText, active && { color: Colors.greenDark }]}>{m.id}</Text>
              {active ? <FontAwesome name="check-circle" size={18} color={Colors.green} style={{ marginLeft: 'auto' }} /> : null}
            </Pressable>
          );
        })}
        <Text style={styles.methodNote}>Demo checkout. No real payment is taken in this preview build.</Text>

        <Text style={styles.h}>Order summary</Text>
        <Card>
          {cart.map((c) => (
            <View key={c.key} style={styles.sumRow}>
              <Text style={styles.sumLabel}>{c.title}</Text>
              <Text style={styles.sumVal}>{rs(c.price)}</Text>
            </View>
          ))}
          {cart.length === 0 ? <Text style={styles.sumLabel}>Cart is empty.</Text> : null}
          {totals.discount > 0 ? (
            <View style={styles.sumRow}>
              <Text style={[styles.sumLabel, { color: Colors.green }]}>WELCOME10 discount</Text>
              <Text style={[styles.sumVal, { color: Colors.green }]}>- {rs(totals.discount)}</Text>
            </View>
          ) : null}
          <View style={[styles.sumRow, { borderTopWidth: 1, borderTopColor: Colors.line, paddingTop: 10, marginTop: 4 }]}>
            <Text style={styles.totalLabel}>Total due today</Text>
            <Text style={styles.totalVal}>{rs(totals.total)}</Text>
          </View>
        </Card>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={{ marginTop: 16 }}>
          <PrimaryButton label={`Place Order . ${rs(totals.total)}`} onPress={submit} />
        </View>
        <Text style={styles.legal}>By placing this order you agree to the PK Hosting terms. {COMPANY.legal}. This is a preview build; services are not really provisioned.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  h: { fontSize: 16, fontWeight: '800', color: Colors.ink, marginTop: 16, marginBottom: 10 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.line, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: Colors.ink, marginBottom: 10 },
  method: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.line, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, marginBottom: 8 },
  methodActive: { borderColor: Colors.green, backgroundColor: '#eef7f0' },
  methodText: { fontSize: 15, fontWeight: '700', color: Colors.inkSoft, marginLeft: 12 },
  methodNote: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  sumLabel: { fontSize: 13.5, color: Colors.inkSoft, flex: 1, marginRight: 10 },
  sumVal: { fontSize: 13.5, fontWeight: '700', color: Colors.ink },
  totalLabel: { fontSize: 15, fontWeight: '800', color: Colors.ink },
  totalVal: { fontSize: 17, fontWeight: '900', color: Colors.greenDark },
  error: { color: Colors.red, fontSize: 13.5, fontWeight: '600', marginTop: 12 },
  legal: { fontSize: 11.5, color: Colors.muted, marginTop: 14, lineHeight: 16, textAlign: 'center' },
});
