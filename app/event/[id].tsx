import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import COLORS from '@/constants/Colors';
import LAYOUT from '@/constants/layout';
import CATEGORIES from '@/constants/categories';
import { Event } from '@/types';
import { useDialog } from '@/components/ui/PareaDialog';

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { events, favorites, toggleFavorite, participations, joinEvent, cancelParticipation } = useAppContext();
  const { user } = useAuth();
  const { showDialog } = useDialog();
  
  // Find the event by ID
  const event = events.find(e => e.id === id) as Event;
  
  // If event not found, show an error message
  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Το event δεν βρέθηκε</Text>
        <Pressable style={styles.backButton} onPress={() => router.push('/(tabs)/home')}>
          <Text style={styles.backButtonText}>Επιστροφή στην αρχική</Text>
        </Pressable>
      </View>
    );
  }
  
  // Check if user has joined/participated in the event
  const participationStatus = participations[event.id];
  
  // Handle join/cancel participation
  const handleParticipation = () => {
    if (participationStatus) {
      // Cancel participation
      cancelParticipation(event.id);
      showDialog({
        title: 'Επιτυχία',
        message: 'Η συμμετοχή σου ακυρώθηκε',
        type: 'success',
      });
    } else {
      // Join event
      joinEvent(event.id);
      
      if (event.participationMode === 'open') {
        showDialog({
          title: 'Επιτυχία',
          message: 'Έχεις εγγραφεί στο event!',
          type: 'success',
        });
      } else {
        showDialog({
          title: 'Αίτημα υποβλήθηκε',
          message: 'Το αίτημα σου για συμμετοχή βρίσκεται υπό έγκριση',
          type: 'info',
        });
      }
    }
  };

  // Handle chat access
  const handleChatAccess = () => {
    // Check if user can access chat
    const canAccessChat = participationStatus === 'approved' || (user?.id && event.host === user.id.toString());
    
    if (canAccessChat) {
      router.push(`/chat/${event.id}`);
    } else {
      showDialog({
        title: 'Απαγορεύεται η πρόσβαση',
        message: 'Μπορείς να συμμετέχεις στη συνομιλία μόνο αν εγκριθεί η συμμετοχή σου ή αν είσαι ο διοργανωτής.',
        type: 'error',
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      
      <View style={styles.categoryContainer}>
        <Text style={styles.category}>
          {CATEGORIES.find(c => c.id === event.category)?.name}
        </Text>
      </View>
      
      <Text style={styles.description}>{event.description}</Text>
      
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Ημερομηνία</Text>
          <Text style={styles.detailValue}>{new Date(event.date).toLocaleDateString('el-GR')}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Ώρα</Text>
          <Text style={styles.detailValue}>{event.time}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Διάρκεια</Text>
          <Text style={styles.detailValue}>{event.duration} λεπτά</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Περιοχή</Text>
          <Text style={styles.detailValue}>{event.area}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Σημείο συνάντησης</Text>
          <Text style={styles.detailValue}>{event.meetingPoint}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Συμμετέχοντες</Text>
          <Text style={styles.detailValue}>{event.attendees.length}/{event.capacity}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Κόστος</Text>
          <Text style={styles.detailValue}>{event.cost === 0 ? 'Δωρεάν' : `${event.cost}€`}</Text>
        </View>
      </View>
      
      {event.requirements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Απαιτήσεις</Text>
          {event.requirements.map((req, index) => (
            <Text key={index} style={styles.requirement}>{req}</Text>
          ))}
        </View>
      )}
      
      <View style={styles.hostSection}>
        <Text style={styles.hostLabel}>Διοργανωτής</Text>
        <View style={styles.hostInfo}>
          <View style={styles.hostAvatar}>
            <Text style={styles.hostAvatarText}>{event.host.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.hostName}>
              {user?.id && event.host === user.id.toString() 
                ? user.name || 'Εσύ' 
                : event.host.startsWith('host') 
                ? 'Διοργανωτής' 
                : event.host}
            </Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>Verified</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerText}>Οι περισσότεροι έρχονται μόνοι</Text>
      </View>
      
      {event.firstTimeFriendly && (
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerText}>Ιδανικό για πρώτη φορά</Text>
        </View>
      )}
      
      <View style={styles.actionsContainer}>
        <Pressable 
          style={[
            styles.actionButton, 
            favorites.includes(event.id) ? styles.favoritedButton : styles.favoriteButton
          ]}
          onPress={() => toggleFavorite(event.id)}
        >
          <Text style={styles.actionButtonText}>
            {favorites.includes(event.id) ? '★ Αγαπημένο' : '☆ Αγαπημένο'}
          </Text>
        </Pressable>
        
        <Pressable 
          style={styles.actionButton}
          onPress={() => router.push({
            pathname: "/report/[type]",
            params: { type: 'event' }
          })}
        >
          <Text style={styles.actionButtonText}>Αναφορά</Text>
        </Pressable>
        
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Κοινοποίηση</Text>
        </Pressable>
      </View>
      
      <Pressable 
        style={[
          styles.joinButton, 
          participationStatus ? styles.cancelButton : 
          event.attendees.length >= event.capacity ? styles.fullButton : 
          event.participationMode === 'open' ? styles.openButton : 
          styles.approvalButton
        ]}
        onPress={handleParticipation}
        disabled={event.attendees.length >= event.capacity && !participationStatus}
      >
        <Text style={styles.joinButtonText}>
          {participationStatus === 'approved' ? 'Ακύρωση συμμετοχής' :
           participationStatus === 'pending' ? 'Αίτημα υπό έγκριση' :
           event.attendees.length >= event.capacity ? 'Πλήρες event' :
           event.participationMode === 'open' ? 'Κράτησε θέση' : 
           'Στείλε αίτημα'}
        </Text>
      </Pressable>
      
      <Pressable 
        style={styles.chatButton}
        onPress={handleChatAccess}
      >
        <Text style={styles.chatButtonText}>Συνομιλία Event</Text>
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
  categoryContainer: {
    marginBottom: 16,
  },
  category: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    borderRadius: LAYOUT.borderRadius.full,
    paddingHorizontal: LAYOUT.spacing.lg,
    paddingVertical: LAYOUT.spacing.sm,
    alignSelf: 'flex-start',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  detailItem: {
    width: '48%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textTertiary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  requirement: {
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  hostSection: {
    marginBottom: 24,
  },
  hostLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hostAvatarText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  hostName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  verifiedBadge: {
    backgroundColor: COLORS.success,
    borderRadius: LAYOUT.borderRadius.sm,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  verifiedBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoBanner: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.md,
    marginBottom: 16,
  },
  infoBannerText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 0.3,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.md,
    alignItems: 'center',
  },
  favoriteButton: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  favoritedButton: {
    backgroundColor: COLORS.warning,
  },
  actionButtonText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  joinButton: {
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.lg,
    alignItems: 'center',
    marginBottom: 16,
  },
  openButton: {
    backgroundColor: COLORS.primary,
  },
  approvalButton: {
    backgroundColor: COLORS.secondary,
  },
  cancelButton: {
    backgroundColor: COLORS.error,
  },
  fullButton: {
    backgroundColor: COLORS.gray400,
  },
  joinButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatButton: {
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.lg,
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: COLORS.secondary,
  },
  chatButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 32,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.lg,
    alignItems: 'center',
    margin: 32,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});