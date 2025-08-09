import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const API_URL = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';

export default function ComplianceScreen() {
  const [health, setHealth] = useState<{ score: number, counts: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/compliance/health`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch health');
        return r.json();
      })
      .then(setHealth)
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compliance Health</Text>
      {loading && <ActivityIndicator />}
      {err && <Text style={styles.error}>{err}</Text>}
      {health && (
        <>
          <Text style={styles.score}>Score: {health.score}</Text>
          <View style={styles.row}>
            <Text style={styles.critical}>Critical: {health.counts.CRITICAL}</Text>
            <Text style={styles.warning}>Warning: {health.counts.WARNING}</Text>
            <Text style={styles.info}>Info: {health.counts.INFO}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#f9fafb', padding:16 },
  title: { fontSize:20, fontWeight:'bold', marginBottom:16 },
  score: { fontSize:36, fontWeight:'bold', color:'#2563eb', marginBottom:24 },
  row: { flexDirection:'row', justifyContent:'space-between', width:'80%' },
  critical: { color:'red', marginHorizontal:8 },
  warning: { color:'orange', marginHorizontal:8 },
  info: { color:'blue', marginHorizontal:8 },
  error: { color:'red' }
});