import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../lib/data';

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <View style={{ marginTop: 22, marginBottom: 10 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {sub ? <Text style={styles.sectionSub}>{sub}</Text> : null}
    </View>
  );
}

export function PrimaryButton({
  label, onPress, disabled, tone = 'green',
}: { label: string; onPress?: () => void; disabled?: boolean; tone?: 'green' | 'dark' | 'red' }) {
  const bg = disabled ? '#b9c6bc' : tone === 'dark' ? Colors.ink : tone === 'red' ? Colors.red : Colors.green;
  return (
    <Pressable onPress={disabled ? undefined : onPress} style={({ pressed }) => [styles.btn, { backgroundColor: bg, opacity: pressed ? 0.85 : 1 }]}>
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>
  );
}

export function OutlineButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btnOutline, { opacity: pressed ? 0.7 : 1 }]}>
      <Text style={styles.btnOutlineText}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function Badge({ label, color = Colors.red }: { label: string; color?: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

export function Check({ label }: { label: string }) {
  return (
    <View style={styles.checkRow}>
      <Text style={styles.checkMark}>{'\u2713'}</Text>
      <Text style={styles.checkText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: 16,
  },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: Colors.ink },
  sectionSub: { fontSize: 13, color: Colors.muted, marginTop: 2 },
  btn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  btnOutline: {
    borderRadius: 12, paddingVertical: 13, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.green, backgroundColor: '#fff',
  },
  btnOutlineText: { color: Colors.green, fontSize: 15, fontWeight: '700' },
  chip: {
    borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1,
    borderColor: Colors.line, backgroundColor: '#fff', marginRight: 8,
  },
  chipActive: { backgroundColor: Colors.green, borderColor: Colors.green },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.inkSoft },
  chipTextActive: { color: '#fff' },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 5 },
  checkMark: { color: Colors.greenBright, fontWeight: '900', marginRight: 8, fontSize: 14 },
  checkText: { flex: 1, fontSize: 13.5, color: Colors.inkSoft },
});
