import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors, rs, TLDS, Tld } from '../../lib/data';
import { addDomainToCart, useStore } from '../../lib/store';
import { Badge, Card, Chip, SectionTitle } from '../../components/ui';

// Deterministic demo availability: same name always gives the same answer.
function isAvailable(name: string, tld: string): boolean {
  const s = (name + tld).toLowerCase();
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
  const takenPopular = ['google', 'facebook', 'pkhosting', 'apple', 'shop', 'best', 'top', 'free', 'online', 'web'];
  if (takenPopular.includes(name.toLowerCase())) return false;
  return h % 4 !== 0;
}

export default function DomainsScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q ?? '');
  const [searched, setSearched] = useState(params.q ?? '');
  const [selectedTld, setSelectedTld] = useState<string>('.com');
  const cart = useStore((s) => s.cart);
  const inCart = cart.map((c) => c.domain).filter(Boolean) as string[];

  const clean = searched.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

  const results = useMemo(() => {
    if (!clean) return [] as { t: Tld; available: boolean }[];
    const ordered = [...TLDS].sort((a, b) => (a.tld === selectedTld ? -1 : b.tld === selectedTld ? 1 : 0));
    return ordered.map((t) => ({ t, available: isAvailable(clean, t.tld) }));
  }, [clean, selectedTld]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
        <View style={styles.searchBox}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Enter a name, e.g. mybusiness"
            placeholderTextColor="#8a9a8f"
            style={styles.searchInput}
            autoCapitalize="none"
            onSubmitEditing={() => setSearched(query)}
          />
          <Pressable onPress={() => setSearched(query)} style={({ pressed }) => [styles.searchBtn, pressed && { opacity: 0.85 }]}>
            <Text style={styles.searchBtnText}>Check</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }} contentContainerStyle={{ paddingRight: 8 }}>
          {TLDS.filter((t) => t.popular).concat(TLDS.filter((t) => !t.popular).slice(0, 6)).map((t) => (
            <Chip key={t.tld} label={t.tld} active={selectedTld === t.tld} onPress={() => setSelectedTld(t.tld)} />
          ))}
        </ScrollView>

        {clean ? (
          <>
            <SectionTitle title={`Results for "${clean}"`} sub="Demo availability check. Live check runs at checkout." />
            {results.map(({ t, available }) => {
              const domain = clean + t.tld;
              const added = inCart.includes(domain);
              return (
                <Card key={t.tld} style={{ marginBottom: 10 }}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.domainName}>{domain}</Text>
                    {available ? <Badge label="AVAILABLE" color={Colors.green} /> : <Badge label="TAKEN" color={Colors.red} />}
                  </View>
                  <Text style={styles.priceLine}>
                    {rs(t.price)} for {t.years} year{t.years > 1 ? 's' : ''} . renews at {rs(t.renew)}
                  </Text>
                  <Pressable
                    disabled={!available || added}
                    onPress={() => addDomainToCart(domain, t.price, t.years)}
                    style={({ pressed }) => [
                      styles.addBtn,
                      (!available || added) && styles.addBtnDisabled,
                      pressed && available && !added && { opacity: 0.85 },
                    ]}
                  >
                    <Text style={styles.addBtnText}>{added ? 'In Cart' : available ? 'Add to Cart' : 'Not Available'}</Text>
                  </Pressable>
                </Card>
              );
            })}
          </>
        ) : (
          <>
            <SectionTitle title="Popular extensions" sub="Prices from pkhosting.com domain catalogue" />
            {TLDS.map((t) => (
              <Card key={t.tld} style={{ marginBottom: 10 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.domainName}>{t.tld}</Text>
                  {t.popular ? <Badge label="POPULAR" color={Colors.green} /> : null}
                </View>
                <Text style={styles.priceLine}>{rs(t.price)} for {t.years} year{t.years > 1 ? 's' : ''} . renews at {rs(t.renew)}</Text>
              </Card>
            ))}
          </>
        )}
        <Text style={styles.note}>.pk and .com.pk need a minimum 2-year term. Prices in PKR; checkout price takes precedence.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  searchBox: { flexDirection: 'row', backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.line, borderRadius: 12, overflow: 'hidden' },
  searchInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: Colors.ink },
  searchBtn: { backgroundColor: Colors.green, paddingHorizontal: 20, justifyContent: 'center' },
  searchBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  domainName: { fontSize: 16, fontWeight: '800', color: Colors.ink },
  priceLine: { fontSize: 13, color: Colors.muted, marginTop: 4 },
  addBtn: { backgroundColor: Colors.green, borderRadius: 10, paddingVertical: 11, alignItems: 'center', marginTop: 12 },
  addBtnDisabled: { backgroundColor: '#c9d4ca' },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  note: { fontSize: 11.5, color: Colors.muted, marginTop: 8, lineHeight: 16 },
});
