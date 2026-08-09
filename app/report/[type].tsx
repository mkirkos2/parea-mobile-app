import { StyleSheet, View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import COLORS from '@/constants/Colors';
import LAYOUT from '@/constants/layout';
import { useState } from 'react';
import { useDialog } from '@/components/ui/PareaDialog';

export default function ReportScreen() {
  const router = useRouter();
  const { type, id } = useLocalSearchParams();
  const { addReport } = useAppContext();
  const { showDialog } = useDialog();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const reasons = [
    { id: 'harassment', label: 'Παρενόχληση' },
    { id: 'misleadingEvent', label: 'Παραπλανητικό event' },
    { id: 'dangerousBehavior', label: 'Επικίνδυνη συμπεριφορά' },
    { id: 'spam', label: 'Spam' },
    { id: 'impersonation', label: 'Πλαστοπροσωπία' },
    { id: 'other', label: 'Άλλο' },
  ];

  const handleSubmit = () => {
    if (!selectedReason) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Παρακαλώ επίλεξε έναν λόγο αναφοράς',
        type: 'error',
      });
      return;
    }

    // Create a new report
    const newReport = {
      id: Math.random().toString(36).substring(7),
      type: type as 'event' | 'user',
      targetId: id as string,
      reason: selectedReason as any,
      description: description || undefined,
      reporterId: 'currentUserId', // In a real app, this would be the actual user ID
      timestamp: new Date(),
    };

    addReport(newReport);

    showDialog({
      title: 'Επιτυχία',
      message: 'Η αναφορά σου υποβλήθηκε επιτυχώς. Ευχαριστούμε για τη βοήθειά σου στη διατήρηση της ασφάλειας της κοινότητας.',
      type: 'success',
      onConfirm: () => router.push('/(tabs)/home'),
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {type === 'event' ? 'Αναφορά Event' : 'Αναφορά Χρήστη'}
      </Text>
      
      <Text style={styles.subtitle}>
        {type === 'event' 
          ? 'Επίλεξε τον λόγο για τον οποίο θέλεις να αναφέρεις αυτό το event.' 
          : 'Επίλεξε τον λόγο για τον οποίο θέλεις να αναφέρεις αυτόν τον χρήστη.'}
      </Text>
      
      <View style={styles.reasonsContainer}>
        {reasons.map((reason) => (
          <Pressable
            key={reason.id}
            style={[
              styles.reasonOption,
              selectedReason === reason.id && styles.selectedReasonOption,
            ]}
            onPress={() => setSelectedReason(reason.id)}
          >
            <Text
              style={[
                styles.reasonText,
                selectedReason === reason.id && styles.selectedReasonText,
              ]}
            >
              {reason.label}
            </Text>
          </Pressable>
        ))}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Περιγραφή (προαιρετική)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Περιέγραψε λεπτομερώς το πρόβλημα..."
          placeholderTextColor={COLORS.textTertiary}
          multiline
          numberOfLines={4}
        />
      </View>
      
      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Υποβολή Αναφοράς</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: LAYOUT.screenPadding,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  reasonsContainer: {
    marginBottom: 24,
  },
  reasonOption: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.lg,
    marginBottom: LAYOUT.spacing.sm,
  },
  selectedReasonOption: {
    backgroundColor: COLORS.primary,
  },
  reasonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  selectedReasonText: {
    color: COLORS.white,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.md,
    minHeight: 44,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.md,
    minHeight: 44, // Minimum touch target size
  },
  textAreaContainer: {
    minHeight: 120,
  },
  placeholder: {
    color: COLORS.textTertiary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.lg,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});