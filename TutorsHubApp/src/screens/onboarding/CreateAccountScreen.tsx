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
  Alert,
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

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;

type FieldProps = {
  label: string;
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secure?: boolean;
  keyboardType?: 'default' | 'email-address';
  trailing?: React.ReactNode;
};

function Field({ label, icon, placeholder, value, onChangeText, secure, keyboardType, trailing }: FieldProps) {
  return (
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrap}>
        <Icon name={icon} size={22} color="#9AA8A1" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A6B2AB"
          secureTextEntry={secure}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
          style={styles.input}
        />
        {trailing}
      </View>
    </View>
  );
}

export default function CreateAccountScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();
  const role = route.params?.role ?? 'student';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const finish = async () => {
    if (busy) return;
    setError(null);
    if (!agreed) {
      setError('Please accept the Terms of Service and Privacy Policy to continue.');
      return;
    }
    setBusy(true);
    try {
      await signUp({
        fullName: name.trim(),
        email: email.trim(),
        password,
        role,
        acceptTerms: true,
      });
      // On success the navigator swaps to the authed (Main) stack automatically.
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not create your account'));
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = () => {
    // Google sign-in needs client IDs configured (expo-auth-session) — the
    // backend endpoint POST /auth/google is ready to verify the ID token.
    Alert.alert('Coming soon', 'Google sign-in setup is pending configuration.');
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
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.sub}>One last step to start learning</Text>

        <View style={styles.fields}>
          <Field
            label="FULL NAME"
            icon="person"
            placeholder="e.g. Kojo Mensah"
            value={name}
            onChangeText={setName}
          />
          <Field
            label="EMAIL ADDRESS"
            icon="mail"
            placeholder="you@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Field
            label="PASSWORD"
            icon="lock"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secure={!showPass}
            trailing={
              <Pressable onPress={() => setShowPass((s) => !s)}>
                <Icon name={showPass ? 'visibility' : 'visibility_off'} size={21} color="#9AA8A1" />
              </Pressable>
            }
          />
        </View>

        <Pressable style={styles.terms} onPress={() => setAgreed((a) => !a)}>
          <View style={[styles.checkbox, agreed ? styles.checkboxOn : styles.checkboxOff]}>
            {agreed ? <Icon name="check" size={16} color={colors.white} /> : null}
          </View>
          <Text style={styles.termsText}>
            I agree to TutorsHub's <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>.
          </Text>
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton
          label={busy ? 'Creating account…' : 'Create account'}
          onPress={finish}
          style={{ marginTop: error ? 14 : 22, opacity: busy ? 0.7 : 1 }}
        />

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.or}>or</Text>
          <View style={styles.line} />
        </View>

        <Pressable style={styles.google} onPress={onGoogle}>
          <Icon name="g_translate" size={21} color={colors.error} />
          <Text style={styles.googleText}>Continue with Google</Text>
        </Pressable>

        <Text style={styles.loginRow}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Log in
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
  terms: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 18 },
  checkbox: { width: 22, height: 22, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: colors.brand },
  checkboxOff: { borderWidth: 1.5, borderColor: colors.dividerAlt, backgroundColor: colors.card },
  termsText: { flex: 1, fontFamily: fonts.nunitoSemibold, fontSize: 12, color: '#7A8A82', lineHeight: 18 },
  error: { fontFamily: fonts.nunitoSemibold, fontSize: 13, color: colors.error, marginTop: 16, textAlign: 'center' },
  link: { fontFamily: fonts.nunitoExtrabold, color: colors.brand },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#EAE4D6' },
  or: { fontFamily: fonts.nunitoSemibold, fontSize: 12, color: colors.mutedSoft },
  google: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.dividerAlt,
    borderRadius: 16,
    marginTop: 16,
  },
  googleText: { fontFamily: fonts.nunitoBold, fontSize: 15, color: colors.ink },
  loginRow: { textAlign: 'center', fontFamily: fonts.nunitoSemibold, fontSize: 13, color: '#7A8A82', marginTop: 18 },
});
