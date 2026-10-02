import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../lib/data';
import { addTicket, showToast } from '../lib/store';
import { Chip, PrimaryButton } from '../components/ui';

const DEPARTMENTS = ['Technical Support', 'Billing', 'Sales', 'Domain Support'];

export default function NewTicket() {
  const router = useRouter();
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (subject.trim().length < 4) {
      setError('Please add a short subject (at least 4 characters).');
      return;
    }
    if (message.trim().length < 10) {
      setError('Please describe your issue in a little more detail.');
      return;
    }
    const t = addTicket(subject.trim(), dept, message.trim());
    showToast('Ticket opened');
    router.replace({ pathname: '/ticket/[id]', params: { id: t.id } });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
        <Text style={styles.h}>Department</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
          {DEPARTMENTS.map((d) => (
            <Chip key={d} label={d} active={dept === d} onPress={() => setDept(d)} />
          ))}
        </ScrollView>

        <Text style={styles.h}>Subject</Text>
        <TextInput value={subject} onChangeText={setSubject} placeholder="e.g. My website is down" placeholderTextColor="#8a9a8f" style={styles.input} />

        <Text style={styles.h}>Message</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Describe what is happening and what you already tried..."
          placeholderTextColor="#8a9a8f"
          style={[styles.input, { minHeight: 120, textAlignVertical: 'top' }]}
          multiline
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={{ marginTop: 14 }}>
          <PrimaryButton label="Open Ticket" onPress={submit} />
        </View>
        <Text style={styles.note}>Tickets are answered daily. Live chat and phone run Mon to Fri, 9am to 6pm PKT.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  h: { fontSize: 15, fontWeight: '800', color: Colors.ink, marginTop: 16, marginBottom: 10 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.line, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: Colors.ink },
  error: { color: Colors.red, fontSize: 13.5, fontWeight: '600', marginTop: 12 },
  note: { fontSize: 12, color: Colors.muted, marginTop: 14, textAlign: 'center', lineHeight: 17 },
});
