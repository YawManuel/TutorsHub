import { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Icon from '../../components/Icon';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../services/errors';
import { colors } from '../../theme/tokens';
import { fonts } from '../../theme/typography';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      // On success the navigator swaps to the authed stack automatically.
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not log in'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton onPress={() => navigation.goBack()} />
        <Image
          source={require('../../../assets/images/logo-full.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.sub}>Log in to continue learning</Text>

        <View style={styles.fields}>
          <View>
            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <View style={styles.inputWrap}>
              <Icon name="mail" size={22} color="#9AA8A1" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@email.com"
                placeholderTextColor="#A6B2AB"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
          </View>
          <View>
            <Text style={styles.fieldLabel}>PASSWORD</Text>
            <View style={styles.inputWrap}>
              <Icon name="lock" size={22} color="#9AA8A1" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                placeholderTextColor="#A6B2AB"
                secureTextEntry={!showPass}
                style={styles.input}
                onSubmitEditing={onSubmit}
              />
              <Pressable onPress={() => setShowPass((s) => !s)}>
                <Icon name={showPass ? 'visibility' : 'visibility_off'} size={21} color="#9AA8A1" />
              </Pressable>
            </View>
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton
          label={busy ? 'Logging in…' : 'Log in'}
          onPress={onSubmit}
          style={{ marginTop: 22, opacity: busy ? 0.7 : 1 }}
        />

        <Text style={styles.signupRow}>
          Don't have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Role')}>
            Sign up
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.appBg },
  content: { paddingHorizontal: 22, paddingBottom: 30 },
  logo: { height: 30, width: 150, alignSelf: 'center', marginTop: 16 },
  title: { fontFamily: fonts.jakartaBold, fontSize: 26, color: colors.ink, marginTop: 18, textAlign: 'center' },
  sub: { fontFamily: fonts.nunitoSemibold, fontSize: 14, color: '#6B7B74', marginTop: 5, textAlign: 'center' },
  fields: { marginTop: 24, gap: 13 },
  fieldLabel: { fontFamily: fonts.nunitoBold, fontSize: 12, letterSpacing: 0.3, color: colors.muted, marginBottom: 7 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    height: 56,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.dividerAlt,
    borderRadius: 16,
    paddingHorizontal: 15,
  },
  input: { flex: 1, fontFamily: fonts.nunitoSemibold, fontSize: 15, color: colors.ink },
  error: { fontFamily: fonts.nunitoSemibold, fontSize: 13, color: colors.error, marginTop: 14, textAlign: 'center' },
  signupRow: { textAlign: 'center', fontFamily: fonts.nunitoSemibold, fontSize: 13, color: '#7A8A82', marginTop: 18 },
  link: { fontFamily: fonts.nunitoExtrabold, color: colors.brand },
});
