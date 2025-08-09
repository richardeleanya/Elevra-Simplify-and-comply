import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const API_URL = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';

export default function PayrollListScreen() {
  const [payslips, setPayslips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/payrolls?userId=user-1`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch payslips');
        return r.json();
      })
      .then(setPayslips)
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payslips</Text>
      {loading && <ActivityIndicator />}
      {err && <Text style={styles.error}>{err}</Text>}
      {!loading && !err && (
        <FlatList
          data={payslips}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text>Date: {item.payDate ? new Date(item.payDate).toLocaleDateString() : ''}</Text>
              <Text>Gross: £{item.grossPay}</Text>
              <Text>Net: £{item.netPay}</Text>
              <Text>
                {item.breakdown
                  ? Object.entries(item.breakdown)
                      .filter(([k, v]) => !!v)
                      .map(([k, v]) => `${k}: £${v}`)
                      .join(', ')
                  : ''}
              </Text>
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
  row: { marginBottom:16, padding:12, backgroundColor:'#fff', borderRadius:8, borderWidth:1, borderColor:'#ccc' },
  error: { color:'red' }
});