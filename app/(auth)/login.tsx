import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useDialog } from '@/components/ui/PareaDialog';
import COLORS from '@/constants/Colors';
import LAYOUT from '@/constants/layout';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showDialog } = useDialog();
  const router = useRouter();

  const handleLogin = async () => {
    // Basic validation
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

    setIsLoading(true);
    
    try {
      await login(email.trim(), password);
      // Navigation is handled by the tab layout redirect
    } catch (error: any) {
      console.error('Login error:', error);
      
      let message = 'Προέκυψε σφάλμα κατά τη σύνδεση. Δοκιμάστε ξανά.';
      
      if (error.status === 401) {
        message = 'Τα στοιχεία σύνδεσης δεν είναι σωστά';
      } else if (error.status === 422) {
        // Handle validation errors
        if (error.validationErrors) {
          const firstField = Object.keys(error.validationErrors)[0];
          if (firstField && error.validationErrors[firstField][0]) {
            message = error.validationErrors[firstField][0];
          }
        }
      } else if (error.status === 429) {
        message = 'Πολλές προσπάθειες σύνδεσης. Δοκιμάστε ξανά αργότερα.';
      } else if (error.status === 0) {
        message = 'Δεν υπάρχει σύνδεση στο διαδίκτυο. Ελέγξτε τη σύνδεσή σας.';
      }
      
      showDialog({
        title: 'Σφάλμα σύνδεσης',
        message,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Καλωσόρισες ξανά!</Text>
        <Text style={styles.subtitle}>Συνδέσου στον λογαριασμό σου</Text>
        
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
              returnKeyType="done"
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
        </View>
        
        <Pressable
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Σύνδεση...' : 'Σύνδεση'}
          </Text>
        </Pressable>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Δεν έχεις λογαριασμό;</Text>
          <Pressable 
            style={styles.registerLink}
            onPress={handleGoToRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerLinkText}>Εγγραφή</Text>
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
  loginButton: {
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
  loginButtonText: {
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
  registerLink: {
    marginLeft: 8,
  },
  registerLinkText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});