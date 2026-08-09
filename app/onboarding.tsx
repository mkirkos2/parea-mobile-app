import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import COLORS from '@/constants/Colors';
import LAYOUT from '@/constants/layout';
import { useState } from 'react';
import { useDialog } from '@/components/ui/PareaDialog';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setIsOnboardingCompleted } = useAppContext();
  const { showDialog } = useDialog();
  const [step, setStep] = useState(1);
  const [isOver18, setIsOver18] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [hasAcceptedRules, setHasAcceptedRules] = useState(false);

  const locations = [
    'Μοναστηράκι',
    'Θησείο',
    'Κεραμεικός',
    'Γκάζι',
    'Κουκάκι',
    'Παγκράτι',
    'Εξάρχεια',
    'Κέντρο Αθήνας',
  ];

  const interests = [
    { id: 'coffee', name: 'Καφές', icon: '☕' },
    { id: 'walk', name: 'Πεζοπορία', icon: '🚶' },
    { id: 'escapeRoom', name: 'Escape Room', icon: '🗝️' },
    { id: 'music', name: 'Μουσική', icon: '🎵' },
    { id: 'boardGames', name: 'Επιτραπέζια', icon: '🎲' },
    { id: 'language', name: 'Γλώσσες', icon: '🗣️' },
    { id: 'art', name: 'Τέχνη', icon: '🎨' },
    { id: 'sports', name: 'Αθλητισμός', icon: '⚽' },
    { id: 'food', name: 'Φαγητό', icon: '🍕' },
    { id: 'volunteering', name: 'Εθελοντισμός', icon: '🤝' },
  ];

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!isOver18) {
        showDialog({
          title: 'Επιβεβαίωση ηλικίας',
          message: 'Πρέπει να επιβεβαιώσεις ότι είσαι άνω των 18 ετών',
          type: 'error',
        });
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!selectedLocation) {
        showDialog({
          title: 'Επιλογή περιοχής',
          message: 'Παρακαλώ επίλεξε την περιοχή σου',
          type: 'error',
        });
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (selectedInterests.length === 0) {
        showDialog({
          title: 'Επιλογή ενδιαφερόντων',
          message: 'Παρακαλώ επίλεξε τουλάχιστον ένα ενδιαφέρον',
          type: 'error',
        });
        return;
      }
      setStep(5);
    } else if (step === 5) {
      if (!hasAcceptedRules) {
        showDialog({
          title: 'Αποδοχή κανόνων',
          message: 'Πρέπει να αποδεχτείς τους βασικούς κανόνες κοινότητας',
          type: 'error',
        });
        return;
      }
      
      // Complete onboarding
      setIsOnboardingCompleted(true);
      router.replace('/(tabs)/home');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter(id => id !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {step === 1 && (
        <View>
          <Text style={styles.title}>Καλωσόρισες στην Παρέα!</Text>
          <Text style={styles.subtitle}>
            Η εφαρμογή που σε βοηθά να γνωρίσεις νέους ανθρώπους μέσα από μικρές, 
            τοπικές και διασκεδαστικές δραστηριότητες.
          </Text>
          <Text style={styles.description}>
            Δεν είναι ένα dating app. Είναι μια πλατφόρμα για να βρεις άτομα με 
            κοινά ενδιαφέροντα και να περάσετε μια ωραία στιγμή μαζί.
          </Text>
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={styles.title}>Επιβεβαίωση ηλικίας</Text>
          <Text style={styles.subtitle}>
            Για να χρησιμοποιήσεις την εφαρμογή, πρέπει να είσαι άνω των 18 ετών.
          </Text>
          
          <Pressable 
            style={[
              styles.checkboxContainer,
              isOver18 && styles.checkedCheckboxContainer
            ]}
            onPress={() => setIsOver18(!isOver18)}
          >
            <View style={[
              styles.checkbox,
              isOver18 && styles.checkedCheckbox
            ]}>
              {isOver18 && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Επιβεβαιώνω ότι είμαι άνω των 18 ετών</Text>
          </Pressable>
        </View>
      )}

      {step === 3 && (
        <View>
          <Text style={styles.title}>Επιλογή περιοχής</Text>
          <Text style={styles.subtitle}>
            Επίλεξε την περιοχή σου για να βλέπεις events κοντά σου.
          </Text>
          
          <View style={styles.optionsContainer}>
            {locations.map((location) => (
              <Pressable
                key={location}
                style={[
                  styles.option,
                  selectedLocation === location && styles.selectedOption,
                ]}
                onPress={() => setSelectedLocation(location)}
              >
                <Text style={[
                  styles.optionText,
                  selectedLocation === location && styles.selectedOptionText,
                ]}>
                  {location}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {step === 4 && (
        <View>
          <Text style={styles.title}>Επιλογή ενδιαφερόντων</Text>
          <Text style={styles.subtitle}>
            Επίλεξε τουλάχιστον ένα ενδιαφέρον για να βλέπεις σχετικά events.
          </Text>
          
          <View style={styles.interestsContainer}>
            {interests.map((interest) => (
              <Pressable
                key={interest.id}
                style={[
                  styles.interest,
                  selectedInterests.includes(interest.id) && styles.selectedInterest,
                ]}
                onPress={() => toggleInterest(interest.id)}
              >
                <Text style={styles.interestIcon}>{interest.icon}</Text>
                <Text style={[
                  styles.interestText,
                  selectedInterests.includes(interest.id) && styles.selectedInterestText,
                ]}>
                  {interest.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {step === 5 && (
        <View>
          <Text style={styles.title}>Κανόνες κοινότητας</Text>
          <Text style={styles.subtitle}>
            Παρακαλώ διάβασε και αποδέχου τους βασικούς κανόνες κοινότητας.
          </Text>
          
          <View style={styles.rulesContainer}>
            <Text style={styles.rule}>• Να είσαι σεβαστικός/ή προς όλους</Text>
            <Text style={styles.rule}>• Να μην κάνεις spam ή ανεπιθύμητη διαφήμιση</Text>
            <Text style={styles.rule}>• Να μην παρενοχλείς άλλους χρήστες</Text>
            <Text style={styles.rule}>• Να μην δημιουργείς παραπλανητικά events</Text>
            <Text style={styles.rule}>• Να ακολουθείς τους κανόνες ασφάλειας</Text>
          </View>
          
          <Pressable 
            style={[
              styles.checkboxContainer,
              hasAcceptedRules && styles.checkedCheckboxContainer
            ]}
            onPress={() => setHasAcceptedRules(!hasAcceptedRules)}
          >
            <View style={[
              styles.checkbox,
              hasAcceptedRules && styles.checkedCheckbox
            ]}>
              {hasAcceptedRules && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Αποδέχομαι τους κανόνες κοινότητας</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Πίσω</Text>
        </Pressable>
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {step === 5 ? 'Ολοκλήρωση' : 'Επόμενο'}
          </Text>
        </Pressable>
      </View>
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
    marginTop: 32,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    color: COLORS.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: LAYOUT.spacing.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: LAYOUT.borderRadius.md,
    marginBottom: 16,
  },
  checkedCheckboxContainer: {
    borderColor: COLORS.primary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 4,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxCheck: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  option: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.lg,
    marginBottom: LAYOUT.spacing.sm,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: COLORS.white,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 32,
  },
  interest: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.lg,
    paddingVertical: LAYOUT.spacing.lg,
    paddingHorizontal: LAYOUT.spacing.xl,
    margin: LAYOUT.spacing.sm,
    alignItems: 'center',
    width: '40%',
  },
  selectedInterest: {
    backgroundColor: COLORS.primary,
  },
  interestIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  interestText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    textAlign: 'center',
  },
  selectedInterestText: {
    color: COLORS.white,
  },
  rulesContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.lg,
    marginBottom: 24,
  },
  rule: {
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.lg,
    flex: 0.45,
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.lg,
    flex: 0.45,
    alignItems: 'center',
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});