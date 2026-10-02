import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors, COMPANY, PLANS, rs } from '../../lib/data';
import PlanCard from '../../components/PlanCard';
import { Badge, Card, SectionTitle } from '../../components/ui';

export default function HomeScreen() {
  const router = useRouter();
  const [domain, setDomain] = useState('');
  const popular = PLANS.filter((p) => p.badge === 'Most Popular' && p.category !== 'Dedicated').slice(0, 3);

  const quick = [
    { label: 'Hosting', icon: 'server' as const, go: () => router.push('/plans') },
    { label: 'Domains', icon: 'globe' as const, go: () => router.push('/domains') },
    { label: 'VPS', icon: 'cloud' as const, go: () => router.push('/plans') },
    { label: 'Support', icon: 'life-ring' as const, go: () => router.push('/account') },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <View style={[styles.bar, { backgroundColor: '#e9e7e4', height: 12 }]} />
            <View style={[styles.bar, { backgroundColor: Colors.greenBright, height: 20 }]} />
            <View style={[styles.bar, { backgroundColor: '#e9e7e4', height: 12 }]} />
          </View>
          <Text style={styles.logoText}>PK <Text style={{ color: Colors.greenBright }}>Hosting</Text><Text style={{ color: Colors.red }}>.</Text></Text>
        </View>
        <Text style={styles.heroTitle}>Quality-crafted web hosting in Pakistan</Text>
        <Text style={styles.heroSub}>{COMPANY.tagline} Hosting with local support since {COMPANY.since}.</Text>

        <View style={styles.searchBox}>
          <TextInput
            value={domain}
            onChangeText={setDomain}
            placeholder="Find your domain, e.g. mybusiness"
            placeholderTextColor="#9fb3a5"
            style={styles.searchInput}
            autoCapitalize="none"
            onSubmitEditing={() => router.push({ pathname: '/domains', params: { q: domain } })}
          />
          <Pressable
            onPress={() => router.push({ pathname: '/domains', params: { q: domain } })}
            style={({ pressed }) => [styles.searchBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.searchBtnText}>Search</Text>
          </Pressable>
        </View>
        <Text style={styles.heroHint}>.com from {rs(3999)}/year  .  .pk {rs(4699)}/2 years</Text>
      </View>

      <View style={styles.promo}>
        <Badge label="NEW CUSTOMERS" color={Colors.red} />
        <Text style={styles.promoText}>Use code <Text style={{ fontWeight: '900' }}>WELCOME10</Text> for 10% off Shared and Reseller hosting.</Text>
      </View>

      <View style={styles.quickRow}>
        {quick.map((q) => (
          <Pressable key={q.label} onPress={q.go} style={({ pressed }) => [styles.quick, pressed && { opacity: 0.8 }]}>
            <View style={styles.quickIcon}>
              <FontAwesome name={q.icon} size={20} color={Colors.green} />
            </View>
            <Text style={styles.quickLabel}>{q.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <SectionTitle title="Most popular plans" sub="Real prices from pkhosting.com, billed in PKR" />
        {popular.map((p) => (
          <PlanCard key={p.id} plan={p} annual={false} />
        ))}

        <SectionTitle title="Why PK Hosting" />
        <Card>
          {[
            ['Since 2010', '16+ years of hosting experience, based in Lahore.'],
            ['Local support that answers', 'Phone, email, tickets and live chat. ' + COMPANY.hours],
            ['Servers where you need them', 'Europe (Germany) and Premium VPS in Virginia, USA.'],
            ['Pay your way', COMPANY.payments.join(', ') + '.'],
          ].map(([t, d]) => (
            <View key={t} style={styles.whyRow}>
              <FontAwesome name="check-circle" size={18} color={Colors.greenBright} style={{ marginTop: 1 }} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.whyTitle}>{t}</Text>
                <Text style={styles.whyText}>{d}</Text>
              </View>
            </View>
          ))}
        </Card>

        <SectionTitle title="Explore" />
        <View style={styles.exploreGrid}>
          {[
            ['WordPress Hosting', 'From Rs 999/mo'],
            ['Reseller Hosting', 'From Rs 1,499/mo'],
            ['Dedicated Servers', 'From Rs 24,999/mo'],
            ['Free Website Migration', 'Move in zero downtime'],
          ].map(([t, d]) => (
            <Pressable key={t} onPress={() => router.push('/plans')} style={({ pressed }) => [styles.explore, pressed && { opacity: 0.85 }]}>
              <Text style={styles.exploreTitle}>{t}</Text>
              <Text style={styles.exploreSub}>{d}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.footer}>{COMPANY.legal} . {COMPANY.address}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  hero: { backgroundColor: Colors.ink, paddingHorizontal: 16, paddingTop: 18, paddingBottom: 22 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoMark: { flexDirection: 'row', alignItems: 'flex-end', height: 20, marginRight: 8 },
  bar: { width: 5, borderRadius: 2, marginRight: 3 },
  logoText: { color: '#fff', fontSize: 20, fontWeight: '900' },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 14, lineHeight: 30 },
  heroSub: { color: '#c4d4c8', fontSize: 14, marginTop: 6, lineHeight: 20 },
  searchBox: { flexDirection: 'row', backgroundColor: '#12241a', borderWidth: 1, borderColor: '#2a4634', borderRadius: 12, marginTop: 16, overflow: 'hidden' },
  searchInput: { flex: 1, color: '#fff', paddingHorizontal: 14, paddingVertical: 13, fontSize: 15 },
  searchBtn: { backgroundColor: Colors.green, paddingHorizontal: 18, justifyContent: 'center' },
  searchBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  heroHint: { color: '#8fae97', fontSize: 12, marginTop: 8 },
  promo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fdeeee', margin: 16, marginBottom: 0, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#f6d3d3' },
  promoText: { flex: 1, marginLeft: 10, fontSize: 13, color: Colors.inkSoft },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 16 },
  quick: { alignItems: 'center', width: '23%' },
  quickIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#e7f4ea', alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 12, fontWeight: '700', color: Colors.inkSoft, marginTop: 6 },
  whyRow: { flexDirection: 'row', paddingVertical: 8 },
  whyTitle: { fontSize: 14, fontWeight: '800', color: Colors.ink },
  whyText: { fontSize: 13, color: Colors.muted, marginTop: 1, lineHeight: 18 },
  exploreGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  explore: { width: '48.5%', backgroundColor: Colors.ink, borderRadius: 14, padding: 14, marginBottom: 10 },
  exploreTitle: { color: '#fff', fontWeight: '800', fontSize: 14 },
  exploreSub: { color: '#a9c3ae', fontSize: 12, marginTop: 3 },
  footer: { textAlign: 'center', color: Colors.muted, fontSize: 11.5, marginTop: 18, lineHeight: 16 },
});
