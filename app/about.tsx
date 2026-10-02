import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, COMPANY } from '../lib/data';
import { Card, SectionTitle } from '../components/ui';

export default function About() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <Card>
          <Text style={styles.brand}>PK Hosting</Text>
          <Text style={styles.tagline}>{COMPANY.tagline}</Text>
          <Text style={styles.body}>
            PK Hosting is the hosting brand of {COMPANY.legal}. We have been crafting quality web hosting for Pakistan since {COMPANY.since}: treating your website as our own, with hands-on local support and clear billing.
          </Text>
        </Card>

        <SectionTitle title="Where your sites live" />
        <Card>
          <Text style={styles.body}>
            Dedicated servers and Cloud VPS run in Europe (Germany, Nuremberg). Premium VPS runs on NVMe servers in Virginia, United States, with Anti-DDoS protection and daily snapshots.
          </Text>
        </Card>

        <SectionTitle title="Talk to us" />
        <Card>
          <Text style={styles.kv}>Phone: {COMPANY.phoneDisplay}</Text>
          <Text style={styles.kv}>Email: {COMPANY.email}</Text>
          <Text style={styles.kv}>Office: {COMPANY.address}</Text>
          <Text style={styles.kv}>{COMPANY.hours}</Text>
        </Card>

        <SectionTitle title="Payments we accept" />
        <Card>
          <Text style={styles.body}>{COMPANY.payments.join(', ')}.</Text>
        </Card>

        <Text style={styles.foot}>This app is a preview build for approval. Prices are taken from pkhosting.com; the checkout price takes precedence.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  brand: { fontSize: 22, fontWeight: '900', color: Colors.ink },
  tagline: { fontSize: 14, color: Colors.green, fontWeight: '700', marginTop: 2 },
  body: { fontSize: 14, color: Colors.inkSoft, lineHeight: 21, marginTop: 8 },
  kv: { fontSize: 13.5, color: Colors.inkSoft, marginBottom: 6, lineHeight: 19 },
  foot: { fontSize: 11.5, color: Colors.muted, textAlign: 'center', marginTop: 18, lineHeight: 16 },
});
