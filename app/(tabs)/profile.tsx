import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import COLORS from '@/constants/Colors';
import LAYOUT from '@/constants/layout';
import { useAppContext } from '@/context/AppContext';
import { useDialog } from '@/components/ui/PareaDialog';

export default function ProfileScreen() {
  const { resetDemoData, setIsOnboardingCompleted } = useAppContext();
  const { showDialog } = useDialog();
  
  const handleResetOnboarding = () => {
    showDialog({
      title: 'Επαναφορά Onboarding',
      message: 'Θέλεις να επαναφέρεις το onboarding;',
      type: 'confirm',
      confirmText: 'Επαναφορά',
      cancelText: 'Ακύρωση',
      onConfirm: async () => {
        setIsOnboardingCompleted(false);
        showDialog({
          title: 'Επιτυχία',
          message: 'Το onboarding επαναφέρθηκε επιτυχώς',
          type: 'success',
        });
      },
      onCancel: () => {}, // Do nothing on cancel
    });
  };
  
  const handleClearDemoData = () => {
    showDialog({
      title: 'Καθαρισμός Δεδομένων',
      message: 'Θέλεις να καθαρίσεις τα demo δεδομένα;',
      type: 'confirm',
      confirmText: 'Καθαρισμός',
      cancelText: 'Ακύρωση',
      onConfirm: async () => {
        await resetDemoData();
        showDialog({
          title: 'Επιτυχία',
          message: 'Τα δεδομένα καθαρίστηκαν επιτυχώς',
          type: 'success',
        });
      },
      onCancel: () => {}, // Do nothing on cancel
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Προφίλ</Text>
      
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>Β</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Βασίλης</Text>
          <Text style={styles.profileLocation}>Αθήνα</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedBadgeText}>Verified</Text>
          </View>
        </View>
      </View>
      
      {/* Interests Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ενδιαφέροντα</Text>
        <View style={styles.interestsContainer}>
          <View style={styles.interestChip}>
            <Text style={styles.interestChipText}>Καφές</Text>
          </View>
          <View style={styles.interestChip}>
            <Text style={styles.interestChipText}>Πεζοπορία</Text>
          </View>
          <View style={styles.interestChip}>
            <Text style={styles.interestChipText}>Μουσική</Text>
          </View>
        </View>
      </View>
      
      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Στατιστικά</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Παρέες</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>Αξιολόγηση</Text>
          </View>
        </View>
      </View>
      
      {/* Community Safety Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ασφάλεια Κοινότητας</Text>
        <Pressable style={styles.menuItem}>
          <Text style={styles.menuItemText}>Οδηγοί Ασφάλειας</Text>
        </Pressable>
        <Pressable style={styles.menuItem}>
          <Text style={styles.menuItemText}>Ρυθμίσεις Απορρήτου</Text>
        </Pressable>
      </View>
      
      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ρυθμίσεις</Text>
        <Pressable style={styles.menuItem}>
          <Text style={styles.menuItemText}>Ειδοποιήσεις</Text>
        </Pressable>
        <Pressable style={styles.menuItem}>
          <Text style={styles.menuItemText}>Γλώσσα</Text>
        </Pressable>
      </View>
      
      {/* Developer Options Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Επιλογές Developer</Text>
        <Pressable 
          style={styles.menuItem}
          onPress={handleResetOnboarding}
        >
          <Text style={styles.menuItemText}>Επαναφορά onboarding</Text>
        </Pressable>
        <Pressable 
          style={styles.menuItem}
          onPress={handleClearDemoData}
        >
          <Text style={styles.menuItemText}>Καθαρισμός demo δεδομένων</Text>
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
    marginTop: 16,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  profileLocation: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  verifiedBadge: {
    backgroundColor: COLORS.success,
    borderRadius: LAYOUT.borderRadius.sm,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  verifiedBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestChip: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.full,
    paddingVertical: LAYOUT.spacing.sm,
    paddingHorizontal: LAYOUT.spacing.lg,
    marginRight: LAYOUT.spacing.sm,
    marginBottom: LAYOUT.spacing.sm,
  },
  interestChipText: {
    color: COLORS.textPrimary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.lg,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  menuItem: {
    paddingVertical: LAYOUT.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
});