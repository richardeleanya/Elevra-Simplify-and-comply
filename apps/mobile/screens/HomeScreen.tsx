import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compliance Health Score</Text>
      <Text style={styles.score}>--</Text>
      <View style={styles.nav}>
        <Button title="Calculate Payslip" onPress={() => navigation.navigate('PayrollCalculate')} />
        <Button title="View Payslips" onPress={() => navigation.navigate('PayrollList')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#f9fafb', padding:16 },
  title: { fontSize:20, fontWeight:'bold', marginBottom:16 },
  score: { fontSize:40, fontWeight:'bold', color:'#2563eb', marginBottom:32 },
  nav: { width:'100%', gap:16 }
});