import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useDialog } from '@/components/ui/PareaDialog';
import COLORS from '@/constants/Colors';
import LAYOUT from '@/constants/layout';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { showDialog } = useDialog();
  const router = useRouter();

  const handleRegister = async () => {
    // Basic validation
    if (!name.trim()) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Παρακαλώ εισάγετε το όνομά σας',
        type: 'error',
      });
      return;
    }

    if (!email.trim()) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Παρακαλώ εισάγετε το email σας',
        type: 'error',
      });
      return;
    }

    if (!password) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Παρακαλώ εισάγετε τον κωδικό σας',
        type: 'error',
      });
      return;
    }

    if (password.length < 8) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες',
        type: 'error',
      });
      return;
    }

    if (password !== passwordConfirmation) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Οι κωδικοί δεν ταιριάζουν',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await register(name.trim(), email.trim(), password, passwordConfirmation);
      // Navigation is handled by the tab layout redirect
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let message = 'Προέκυψε σφάλμα κατά την εγγραφή. Δοκιμάστε ξανά.';
      
      if (error.status === 422) {
        // Handle validation errors
        if (error.validationErrors) {
          const firstField = Object.keys(error.validationErrors)[0];
          if (firstField && error.validationErrors[firstField][0]) {
            message = error.validationErrors[firstField][0];
          }
        }
      } else if (error.status === 429) {
        message = 'Πολλές προσπάθειες εγγραφής. Δοκιμάστε ξανά αργότερα.';
      } else if (error.status === 0) {
        message = 'Δεν υπάρχει σύνδεση στο διαδίκτυο. Ελέγξτε τη σύνδεσή σας.';
      }
      
      showDialog({
        title: 'Σφάλμα εγγραφής',
        message,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Δημιούργησε λογαριασμό</Text>
        <Text style={styles.subtitle}>Γίνε μέλος της κοινότητας Παρέα</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Όνομα</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
            placeholder="Εισάγετε το όνομά σας"
            placeholderTextColor={COLORS.textSecondary}
            editable={!isLoading}
            returnKeyType="next"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="Εισάγετε το email σας"
            placeholderTextColor={COLORS.textSecondary}
            editable={!isLoading}
            returnKeyType="next"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Κωδικός</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              placeholder="Εισάγετε τον κωδικό σας"
              placeholderTextColor={COLORS.textSecondary}
              editable={!isLoading}
              returnKeyType="next"
            />
            {Platform.OS !== 'web' && (
              <Pressable 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Text style={styles.eyeIconText}>
                  {showPassword ? '🙈' : '👁️'}
                </Text>
              </Pressable>
            )}
          </View>
          <Text style={styles.hint}>Τουλάχιστον 8 χαρακτήρες</Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Επιβεβαίωση κωδικού</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
              secureTextEntry={!showPasswordConfirmation}
              autoCapitalize="none"
              autoComplete="password"
              placeholder="Επιβεβαιώστε τον κωδικό σας"
              placeholderTextColor={COLORS.textSecondary}
              editable={!isLoading}
              returnKeyType="done"
            />
            {Platform.OS !== 'web' && (
              <Pressable 
                style={styles.eyeIcon}
                onPress={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                disabled={isLoading}
              >
                <Text style={styles.eyeIconText}>
                  {showPasswordConfirmation ? '🙈' : '👁️'}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
        
        <Pressable
          style={[styles.registerButton, isLoading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.registerButtonText}>
            {isLoading ? 'Εγγραφή...' : 'Εγγραφή'}
          </Text>
        </Pressable>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Έχεις ήδη λογαριασμό;</Text>
          <Pressable 
            style={styles.loginLink}
            onPress={handleGoToLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginLinkText}>Σύνδεση</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: LAYOUT.screenPadding,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.lg,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  eyeIconText: {
    fontSize: 20,
  },
  hint: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.lg,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  loginLink: {
    marginLeft: 8,
  },
  loginLinkText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});