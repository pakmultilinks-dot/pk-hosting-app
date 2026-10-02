import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../lib/data';
import { replyToTicket, showToast, useStore } from '../../lib/store';
import { Badge, Card, PrimaryButton } from '../../components/ui';

export default function TicketDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ticket = useStore((s) => s.tickets.find((t) => t.id === id));
  const [reply, setReply] = useState('');

  if (!ticket) {
    return (
      <View style={styles.center}>
        <Text style={styles.missing}>Ticket not found.</Text>
      </View>
    );
  }

  const send = () => {
    if (reply.trim().length < 2) return;
    replyToTicket(ticket.id, reply.trim());
    setReply('');
    showToast('Reply sent');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: ticket.id }} />
      <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
        <Card>
          <View style={styles.head}>
            <Text style={styles.subject}>{ticket.subject}</Text>
            <Badge label={ticket.status.toUpperCase()} color={ticket.status === 'Open' ? Colors.green : Colors.inkSoft} />
          </View>
          <Text style={styles.meta}>{ticket.department} . Updated {ticket.updated}</Text>
        </Card>

        <View style={{ marginTop: 14 }}>
          {ticket.messages.map((m, i) => (
            <View key={i} style={[styles.bubbleRow, m.from === 'you' ? styles.right : styles.left]}>
              <View style={[styles.bubble, m.from === 'you' ? styles.bubbleYou : styles.bubbleSupport]}>
                <Text style={styles.from}>{m.from === 'you' ? 'You' : 'PK Hosting Support'} . {m.at}</Text>
                <Text style={styles.msg}>{m.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.h}>Reply</Text>
        <TextInput
          value={reply}
          onChangeText={setReply}
          placeholder="Write your reply..."
          placeholderTextColor="#8a9a8f"
          style={[styles.input, { minHeight: 84, textAlignVertical: 'top' }]}
          multiline
        />
        <PrimaryButton label="Send Reply" onPress={send} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missing: { fontSize: 16, color: Colors.muted },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  subject: { fontSize: 16, fontWeight: '800', color: Colors.ink, flex: 1, marginRight: 8 },
  meta: { fontSize: 12.5, color: Colors.muted, marginTop: 4 },
  bubbleRow: { flexDirection: 'row', marginBottom: 10 },
  left: { justifyContent: 'flex-start' },
  right: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '85%', borderRadius: 14, padding: 12 },
  bubbleYou: { backgroundColor: '#e7f4ea', borderWidth: 1, borderColor: '#cfe6d4' },
  bubbleSupport: { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.line },
  from: { fontSize: 11, fontWeight: '700', color: Colors.muted, marginBottom: 4 },
  msg: { fontSize: 14, color: Colors.inkSoft, lineHeight: 20 },
  h: { fontSize: 15, fontWeight: '800', color: Colors.ink, marginTop: 16, marginBottom: 10 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.line, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.ink, marginBottom: 12 },
});
