import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors, COMPANY, rs } from '../../lib/data';
import { useStore } from '../../lib/store';
import { Badge, Card, PrimaryButton, SectionTitle } from '../../components/ui';

export default function AccountScreen() {
  const router = useRouter();
  const services = useStore((s) => s.services);
  const tickets = useStore((s) => s.tickets);
  const orders = useStore((s) => s.orders);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
      <View style={styles.profile}>
        <View style={styles.avatar}><Text style={styles.avatarText}>AR</Text></View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.name}>Demo Customer</Text>
          <Text style={styles.email}>customer@example.com</Text>
          <Text style={styles.since}>PK Hosting client . Lahore, Pakistan</Text>
        </View>
        <Badge label="DEMO" color={Colors.ink} />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <SectionTitle title="My services" sub="Demo data shown for this preview build" />
        {services.map((s) => (
          <Card key={s.id} style={{ marginBottom: 10 }}>
            <View style={styles.rowBetween}>
              <Text style={styles.svcName}>{s.name}</Text>
              <Badge label={s.status.toUpperCase()} color={s.status === 'Active' ? Colors.green : Colors.gold} />
            </View>
            <Text style={styles.svcDetail}>{s.detail}</Text>
            <Text style={styles.svcMeta}>Renews: {s.renews} . {s.price}</Text>
          </Card>
        ))}

        {orders.length > 0 ? (
          <>
            <SectionTitle title="Recent orders" />
            {orders.map((o) => (
              <Card key={o.id} style={{ marginBottom: 10 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.svcName}>{o.id}</Text>
                  <Text style={styles.orderTotal}>{rs(o.total)}</Text>
                </View>
                <Text style={styles.svcDetail}>{o.items.join(', ')}</Text>
                <Text style={styles.svcMeta}>{o.date} . Paid via {o.method}</Text>
              </Card>
            ))}
          </>
        ) : null}

        <SectionTitle title="Support tickets" />
        {tickets.map((t) => (
          <Pressable key={t.id} onPress={() => router.push({ pathname: '/ticket/[id]', params: { id: t.id } })} style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
            <Card style={{ marginBottom: 10 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.svcName}>{t.id}</Text>
                <Badge label={t.status.toUpperCase()} color={t.status === 'Open' ? Colors.green : Colors.inkSoft} />
              </View>
              <Text style={styles.ticketSubject}>{t.subject}</Text>
              <Text style={styles.svcMeta}>{t.department} . Updated {t.updated}</Text>
            </Card>
          </Pressable>
        ))}
        <PrimaryButton label="Open a New Ticket" onPress={() => router.push('/new-ticket')} />

        <SectionTitle title="Contact PK Hosting" />
        <Card>
          <View style={styles.contactRow}>
            <FontAwesome name="phone" size={16} color={Colors.green} />
            <Text style={styles.contactText}>{COMPANY.phoneDisplay}</Text>
          </View>
          <View style={styles.contactRow}>
            <FontAwesome name="envelope" size={16} color={Colors.green} />
            <Text style={styles.contactText}>{COMPANY.email}</Text>
          </View>
          <View style={styles.contactRow}>
            <FontAwesome name="map-marker" size={16} color={Colors.green} />
            <Text style={[styles.contactText, { flex: 1 }]}>{COMPANY.address}</Text>
          </View>
          <View style={styles.contactRow}>
            <FontAwesome name="clock-o" size={16} color={Colors.green} />
            <Text style={[styles.contactText, { flex: 1 }]}>{COMPANY.hours}</Text>
          </View>
        </Card>

        <Pressable onPress={() => router.push('/about')} style={{ marginTop: 18 }}>
          <Text style={styles.aboutLink}>About PK Hosting {'>'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  profile: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.ink, padding: 16 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  name: { color: '#fff', fontSize: 17, fontWeight: '800' },
  email: { color: '#c4d4c8', fontSize: 13, marginTop: 1 },
  since: { color: '#8fae97', fontSize: 12, marginTop: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  svcName: { fontSize: 15, fontWeight: '800', color: Colors.ink, flex: 1, marginRight: 8 },
  svcDetail: { fontSize: 13, color: Colors.inkSoft, marginTop: 3 },
  svcMeta: { fontSize: 12, color: Colors.muted, marginTop: 3 },
  ticketSubject: { fontSize: 14, fontWeight: '600', color: Colors.inkSoft, marginTop: 3 },
  orderTotal: { fontSize: 15, fontWeight: '900', color: Colors.greenDark },
  contactRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 7 },
  contactText: { fontSize: 13.5, color: Colors.inkSoft, marginLeft: 12 },
  aboutLink: { color: Colors.green, fontWeight: '700', fontSize: 14 },
});
