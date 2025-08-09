import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';

const API_URL = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';

export default function RtiScreen() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [payrollId, setPayrollId] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [payload, setPayload] = useState('{}');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/payrolls`)
      .then(r => r.json())
      .then(setPayrolls)
      .catch(() => setPayrolls([]));
  }, []);

  const submitRti = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/rti/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payrollId, submissionDate, payload: JSON.parse(payload) }),
      });
      if (!res.ok) throw new Error('Failed to submit RTI');
      Alert.alert('Success', 'RTI submitted');
      fetchHistory();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = () => {
    setLoading(true);
    if (!payrollId) return;
    fetch(`${API_URL}/rti/${payrollId}`)
      .then(r => r.json())
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (payrollId) fetchHistory();
  }, [payrollId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submit RTI</Text>
      <TextInput
        placeholder="PayrollId"
        value={payrollId}
        onChangeText={setPayrollId}
        style={styles.input}
      />
      <TextInput
        placeholder="Submission Date (YYYY-MM-DD)"
        value={submissionDate}
        onChangeText={setSubmissionDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Payload (JSON)"
        value={payload}
        onChangeText={setPayload}
        style={styles.input}
        multiline
      />
      <Button title={loading ? 'Submitting...' : 'Submit RTI'} onPress={submitRti} disabled={loading} />
      <Text style={styles.subtitle}>History</Text>
      {loading ? <ActivityIndicator /> : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text>Date: {item.submissionDate}</Text>
              <Text>Status: {item.status}</Text>
              <Text>Response: {JSON.stringify(item.response)}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:'#f9fafb' },
  title: { fontSize:20, fontWeight:'bold', marginBottom:16 },
  subtitle: { fontWeight:'bold', marginTop:32, marginBottom:8 },
  input: { width:'100%', padding:12, marginVertical:8, backgroundColor:'#fff', borderRadius:8, borderWidth:1, borderColor:'#ccc' },
  row: { marginBottom:12, padding:8, backgroundColor:'#fff', borderRadius:8, borderWidth:1, borderColor:'#ccc' }
});