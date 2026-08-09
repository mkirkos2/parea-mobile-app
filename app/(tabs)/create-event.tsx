import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Switch, Modal, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import COLORS from '@/constants/Colors';
import LAYOUT from '@/constants/layout';
import { EventFormData } from '@/types';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import CATEGORIES from '@/constants/categories';
import { SafeBottomActions } from '@/components/ui/SafeBottomActions';
import { useDialog } from '@/components/ui/PareaDialog';

export default function CreateEventScreen() {
  const router = useRouter();
  const { addEvent, addCreatedEvent } = useAppContext();
  const { showDialog } = useDialog();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    category: 'coffee',
    date: new Date(),
    time: '',
    duration: 60,
    area: '',
    meetingPoint: '',
    capacity: 10,
    cost: 0,
    requirements: [],
    participationMode: 'open',
    firstTimeFriendly: false,
    mostlySolo: true,
  });
  const [requirementsText, setRequirementsText] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      // Don't allow past dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date >= today) {
        setSelectedDate(date);
        setFormData(prev => ({
          ...prev,
          date: date
        }));
      }
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      // For today's date, don't allow past times
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const selectedDateWithoutTime = new Date(selectedDate);
      selectedDateWithoutTime.setHours(0, 0, 0, 0);
      
      if (selectedDateWithoutTime > today || 
          (selectedDateWithoutTime.getTime() === today.getTime() && time >= now)) {
        setSelectedTime(time);
        const timeString = time.toTimeString().substring(0, 5); // HH:MM format
        setFormData(prev => ({
          ...prev,
          time: timeString
        }));
      }
    }
  };

  const formatDateForDisplay = (date: Date) => {
    if (!date) return '';
    return date.toLocaleDateString('el-GR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryName = (categoryId: string) => {
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.title.trim()) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Παρακαλώ συμπλήρωσε τον τίτλο του event',
        type: 'error',
      });
      return;
    }
    
    if (!formData.description.trim()) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Παρακαλώ συμπλήρωσε την περιγραφή του event',
        type: 'error',
      });
      return;
    }
    
    if (!formData.category) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Παρακαλώ επίλεξε κατηγορία για το event',
        type: 'error',
      });
      return;
    }
    
    if (!formData.date) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Παρακαλώ επίλεξε ημερομηνία για το event',
        type: 'error',
      });
      return;
    }
    
    if (!formData.time) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Παρακαλώ επίλεξε ώρα για το event',
        type: 'error',
      });
      return;
    }
    
    if (!formData.area.trim()) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Παρακαλώ συμπλήρωσε την περιοχή',
        type: 'error',
      });
      return;
    }
    
    if (!formData.meetingPoint.trim()) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Παρακαλώ συμπλήρωσε το σημείο συνάντησης',
        type: 'error',
      });
      return;
    }
    
    if (formData.capacity <= 0) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Οι μέγιστες θέσεις πρέπει να είναι θετικός αριθμός',
        type: 'error',
      });
      return;
    }
    
    if (formData.cost < 0) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Το κόστος δεν μπορεί να είναι αρνητικό',
        type: 'error',
      });
      return;
    }
    
    if (formData.duration <= 0) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Η διάρκεια πρέπει να είναι θετικός αριθμός',
        type: 'error',
      });
      return;
    }

    // Process requirements
    const requirementsArray = requirementsText
      .split('\n')
      .map(req => req.trim())
      .filter(req => req.length > 0);

    // Create new event with a random ID
    const newEvent = {
      id: Math.random().toString(36).substring(7),
      ...formData,
      requirements: requirementsArray,
      attendees: [],
      host: 'currentUserId', // In a real app, this would be the actual user ID
      createdAt: new Date(),
    };

    addEvent(newEvent);
    addCreatedEvent(newEvent);
    
    showDialog({
      title: 'Επιτυχία',
      message: 'Το event δημιουργήθηκε επιτυχώς!',
      type: 'success',
      onConfirm: () => router.push({
        pathname: "/event/[id]",
        params: { id: newEvent.id }
      }),
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Δημιουργία Event</Text>
      <Text style={styles.subtitle}>Συμπλήρωσε τα στοιχεία του event σου</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Τίτλος *</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(text) => handleInputChange('title', text)}
          placeholder="Εισήγαγε τον τίτλο του event"
          placeholderTextColor={COLORS.textTertiary}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Περιγραφή *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => handleInputChange('description', text)}
          placeholder="Περιέγραψε το event σου λεπτομερώς"
          placeholderTextColor={COLORS.textTertiary}
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Κατηγορία *</Text>
        <TouchableOpacity 
          style={styles.selectContainer}
          onPress={() => setShowCategoryModal(true)}
          accessibilityLabel="Επίλεξε κατηγορία για το event"
        >
          <Text style={styles.selectText}>
            {formData.category ? getCategoryName(formData.category) : 'Επίλεξε κατηγορία'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.formRow}>
        <View style={styles.formGroupHalf}>
          <Text style={styles.label}>Ημερομηνία *</Text>
          <TouchableOpacity 
            style={styles.selectContainer}
            onPress={() => setShowDatePicker(true)}
            accessibilityLabel="Επίλεξε ημερομηνία για το event"
          >
            <Text style={styles.selectText}>
              {formData.date ? formatDateForDisplay(formData.date) : 'Επίλεξε ημερομηνία'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.formGroupHalf}>
          <Text style={styles.label}>Ώρα *</Text>
          <TouchableOpacity 
            style={styles.selectContainer}
            onPress={() => setShowTimePicker(true)}
            accessibilityLabel="Επίλεξε ώρα για το event"
          >
            <Text style={styles.selectText}>
              {formData.time || 'Επίλεξε ώρα'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Διάρκεια (λεπτά) *</Text>
        <TextInput
          style={styles.input}
          value={formData.duration.toString()}
          onChangeText={(text) => handleInputChange('duration', parseInt(text) || 0)}
          placeholder="Εισήγαγε τη διάρκεια"
          placeholderTextColor={COLORS.textTertiary}
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Περιοχή *</Text>
        <TextInput
          style={styles.input}
          value={formData.area}
          onChangeText={(text) => handleInputChange('area', text)}
          placeholder="Εισήγαγε την περιοχή"
          placeholderTextColor={COLORS.textTertiary}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Σημείο συνάντησης *</Text>
        <TextInput
          style={styles.input}
          value={formData.meetingPoint}
          onChangeText={(text) => handleInputChange('meetingPoint', text)}
          placeholder="Εισήγαγε το σημείο συνάντησης"
          placeholderTextColor={COLORS.textTertiary}
        />
      </View>
      
      <View style={styles.formRow}>
        <View style={styles.formGroupHalf}>
          <Text style={styles.label}>Μέγιστες θέσεις *</Text>
          <TextInput
            style={styles.input}
            value={formData.capacity.toString()}
            onChangeText={(text) => handleInputChange('capacity', parseInt(text) || 0)}
            placeholder="Εισήγαγε αριθμό θέσεων"
            placeholderTextColor={COLORS.textTertiary}
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.formGroupHalf}>
          <Text style={styles.label}>Κόστος (€) *</Text>
          <TextInput
            style={styles.input}
            value={formData.cost.toString()}
            onChangeText={(text) => handleInputChange('cost', parseFloat(text) || 0)}
            placeholder="Εισήγαγε κόστος"
            placeholderTextColor={COLORS.textTertiary}
            keyboardType="numeric"
          />
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Απαιτήσεις</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={requirementsText}
          onChangeText={setRequirementsText}
          placeholder="Περιέγραψε τυχόν απαιτήσεις (π.χ. άνετα παπούτσια)"
          placeholderTextColor={COLORS.textTertiary}
          multiline
          numberOfLines={3}
        />
      </View>
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Ανοιχτό event (χωρίς έγκριση)</Text>
        <Switch
          value={formData.participationMode === 'open'}
          onValueChange={(value) => handleInputChange('participationMode', value ? 'open' : 'approval')}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={formData.participationMode === 'open' ? COLORS.white : COLORS.white}
        />
      </View>
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Ιδανικό για πρώτη συμμετοχή</Text>
        <Switch
          value={formData.firstTimeFriendly}
          onValueChange={(value) => handleInputChange('firstTimeFriendly', value)}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={formData.firstTimeFriendly ? COLORS.white : COLORS.white}
        />
      </View>
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Οι περισσότεροι αναμένεται να έρθουν μόνοι</Text>
        <Switch
          value={formData.mostlySolo}
          onValueChange={(value) => handleInputChange('mostlySolo', value)}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={formData.mostlySolo ? COLORS.white : COLORS.white}
        />
      </View>
      
      <SafeBottomActions>
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Δημιουργία Event</Text>
        </Pressable>
      </SafeBottomActions>
      
      {/* Category Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCategoryModal}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Επίλεξε Κατηγορία</Text>
            <ScrollView>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryOption}
                  onPress={() => {
                    handleInputChange('category', category.id);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Ακύρωση</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
      
      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
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
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formGroupHalf: {
    flex: 0.48,
    marginBottom: 16,
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
    padding: LAYOUT.spacing.sm,
    minHeight: 40,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.sm,
    minHeight: 40,
    justifyContent: 'center',
  },
  selectText: {
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 16,
    paddingRight: 16, // Add padding to prevent text from touching switch
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.lg,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: LAYOUT.borderRadius.lg,
    padding: LAYOUT.spacing.lg,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryOption: {
    padding: LAYOUT.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  modalCloseButton: {
    marginTop: 16,
    padding: LAYOUT.spacing.md,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});