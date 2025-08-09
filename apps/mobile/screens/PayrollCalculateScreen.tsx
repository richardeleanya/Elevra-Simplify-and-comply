import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, Picker, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Constants from 'expo-constants';

const API_URL = Constants?.expoConfig?.extra?.API_URL || 'http://localhost:3000';

type FormValues = {
  periodStart: string;
  periodEnd: string;
  salaryPolicyId: string;
  regularHours: string;
  nightHours: string;
  weekendHours: string;
  bankHolidayHours: string;
};

export default function PayrollCalculateScreen() {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      periodStart: '',
      periodEnd: '',
      salaryPolicyId: '',
      regularHours: '0',
      nightHours: '0',
      weekendHours: '0',
      bankHolidayHours: '0',
    }
  });

  const [policies, setPolicies] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loadingPolicies, setLoadingPolicies] = useState(true);

  useEffect(() => {
    setLoadingPolicies(true);
    fetch(`${API_URL}/salary-policies`)
      .then(r => r.json())
      .then(data => setPolicies(data))
      .catch(() => setPolicies([]))
      .finally(() => setLoadingPolicies(false));
  }, []);

  const onSubmit = async (data: FormValues) => {
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/payrolls/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          regularHours: Number(data.regularHours),
          nightHours: Number(data.nightHours),
          weekendHours: Number(data.weekendHours),
          bankHolidayHours: Number(data.bankHolidayHours)
        })
      });
      if (!res.ok) throw new Error('Calculation failed');
      setResult(await res.json());
    } catch (e: any) {
      Alert.alert('Calculation failed', e.message || 'Unknown error');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Calculate Payslip</Text>
      <Controller
        name="periodStart"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Period Start (YYYY-MM-DD)"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />
      <Controller
        name="periodEnd"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Period End (YYYY-MM-DD)"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />
      {loadingPolicies ? <ActivityIndicator /> : (
        <Controller
          name="salaryPolicyId"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Picker selectedValue={value} onValueChange={onChange} style={styles.input}>
              <Picker.Item label="Select Policy" value="" />
              {policies.map(p => (
                <Picker.Item key={p.id} label={p.name} value={p.id} />
              ))}
            </Picker>
          )}
        />
      )}
      <Controller
        name="regularHours"
        control={control}
        rules={{ required: true, min: 0 }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Regular Hours"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
            style={styles.input}
          />
        )}
      />
      <Controller
        name="nightHours"
        control={control}
        rules={{ required: true, min: 0 }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Night Hours"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
            style={styles.input}
          />
        )}
      />
      <Controller
        name="weekendHours"
        control={control}
        rules={{ required: true, min: 0 }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Weekend Hours"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
            style={styles.input}
          />
        )}
      />
      <Controller
        name="bankHolidayHours"
        control={control}
        rules={{ required: true, min: 0 }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Bank Holiday Hours"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
            style={styles.input}
          />
        )}
      />
      <Button title={isSubmitting ? 'Calculating...' : 'Calculate'} onPress={handleSubmit(onSubmit)} disabled={isSubmitting} />
      {result && (
        <View style={styles.result}>
          <Text>Gross Pay: £{result.grossPay}</Text>
          <Text>Breakdown:</Text>
          {Object.entries(result.breakdown).map(([k, v]) => (
            <Text key={k}>{k}: £{v}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow:1, justifyContent:'center', alignItems:'center', padding:16, backgroundColor:'#f9fafb' },
  title: { fontSize:20, fontWeight:'bold', marginBottom:16 },
  input: { width:'100%', padding:12, marginVertical:8, backgroundColor:'#fff', borderRadius:8, borderWidth:1, borderColor:'#ccc' },
  result: { marginTop:24, backgroundColor:'#e0e7ff', padding:16, borderRadius:8 }
});