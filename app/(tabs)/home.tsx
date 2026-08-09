import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { COLORS } from '@/constants/Colors';
import { LAYOUT } from '@/constants/layout';
import CATEGORIES from '@/constants/categories';
import { Event } from '@/types';
import { PareaScreen } from '@/components/ui/PareaScreen';
import { PareaHeader } from '@/components/ui/PareaHeader';
import { PareaCard } from '@/components/ui/PareaCard';
import { PareaButton } from '@/components/ui/PareaButton';
import { PareaChip } from '@/components/ui/PareaChip';
import { useDialog } from '@/components/ui/PareaDialog';

export default function HomeScreen() {
  const { events, favorites, toggleFavorite } = useAppContext();
  const { showDialog } = useDialog();

  // Filter events for "For You" section (favorited events)
  const forYouEvents = events.filter(event => favorites.includes(event.id));

  // Filter events for "Near You" section (all events for now)
  const nearYouEvents = events;

  // Filter events for "This Weekend" section
  const weekendEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    return eventDate.toDateString() === tomorrow.toDateString() || 
           eventDate.toDateString() === dayAfterTomorrow.toDateString();
  });

  // Filter events for "First Time Friendly" section
  const firstTimeEvents = events.filter(event => event.firstTimeFriendly);

  return (
    <PareaScreen scrollable bottomSpacing>
      <View style={styles.contentContainer}>
        <PareaHeader 
          title="Γεια σου, Βασίλη!" 
          subtitle="Τι θα κάνουμε;"
        />
        
        {/* Search Bar */}
        <PareaCard style={styles.searchContainer}>
          <Text style={styles.searchPlaceholder}>Αναζήτηση events...</Text>
        </PareaCard>
        
        {/* Hero Card */}
        <PareaCard style={styles.heroCard} elevated>
          <Text style={styles.heroTitle}>Δεν χρειάζεται να έρθεις με παρέα.</Text>
          <Text style={styles.heroSubtitle}>Στα περισσότερα events, όλοι έρχονται μόνοι.</Text>
          <PareaButton 
            title="Μάθε περισσότερα" 
            variant="secondary" 
            size="small" 
            style={styles.heroButton}
            onPress={() => showDialog({
              title: 'Πληροφορίες',
              message: 'Η Parea είναι μια εφαρμογή που σε βοηθά να συναντήσεις νέα άτομα μέσω events!',
              type: 'info',
            })}
          />
        </PareaCard>
        
        {/* Category Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryChipsContainer}
          contentContainerStyle={styles.categoryChipsContent}
        >
          {CATEGORIES.map((category) => (
            <PareaChip 
              key={category.id} 
              label={`${category.icon} ${category.name}`} 
            />
          ))}
        </ScrollView>
        
        {/* For You Section */}
        <Section title="Για εσένα" events={forYouEvents} onToggleFavorite={toggleFavorite} />
        
        {/* Near You Section */}
        <Section title="Κοντά σου" events={nearYouEvents} onToggleFavorite={toggleFavorite} />
        
        {/* This Weekend Section */}
        <Section title="Αυτό το Σαββατοκύριακο" events={weekendEvents} onToggleFavorite={toggleFavorite} />
        
        {/* First Time Friendly Section */}
        <Section title="Ιδανικά για πρώτη φορά" events={firstTimeEvents} onToggleFavorite={toggleFavorite} />
      </View>
    </PareaScreen>
  );
}

const Section = ({ title, events, onToggleFavorite }: { 
  title: string; 
  events: Event[]; 
  onToggleFavorite: (id: string) => void;
}) => {
  const { favorites } = useAppContext();
  
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {events.length > 0 ? (
        events.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            isFavorite={favorites.includes(event.id)}
            onToggleFavorite={() => onToggleFavorite(event.id)} 
          />
        ))
      ) : (
        <PareaCard style={styles.emptyStateCard}>
          <Text style={styles.emptyStateText}>Δεν υπάρχουν events αυτή τη στιγμή</Text>
        </PareaCard>
      )}
    </View>
  );
};

const EventCard = ({ event, isFavorite, onToggleFavorite }: { 
  event: Event; 
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) => (
  <PareaCard style={styles.eventCard} elevated>
    <View style={styles.eventHeader}>
      <View>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventCategory}>{CATEGORIES.find(c => c.id === event.category)?.name}</Text>
      </View>
      <Pressable onPress={onToggleFavorite}>
        <Text style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}>
          {isFavorite ? '★' : '☆'}
        </Text>
      </Pressable>
    </View>
    <Text style={styles.eventDescription} numberOfLines={2}>{event.description}</Text>
    <View style={styles.eventDetails}>
      <Text style={styles.eventDetail}>{new Date(event.date).toLocaleDateString('el-GR')}</Text>
      <Text style={styles.eventDetail}>{event.time}</Text>
      <Text style={styles.eventDetail}>{event.area}</Text>
    </View>
    <Link href={`/event/${event.id}`} asChild>
      <Pressable>
        <PareaButton 
          title="Περισσότερα" 
          variant="primary" 
          size="small" 
          style={styles.eventButton}
          onPress={() => {}}
        />
      </Pressable>
    </Link>
  </PareaCard>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: LAYOUT.screenPadding,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 8,
    marginBottom: 16,
  },
  searchContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.lg,
    padding: LAYOUT.spacing.md,
    marginBottom: 16,
    height: 52,
    justifyContent: 'center',
  },
  searchPlaceholder: {
    color: COLORS.textTertiary,
  },
  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: LAYOUT.borderRadius.lg,
    padding: LAYOUT.spacing.lg,
    marginBottom: 24,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: COLORS.white,
    ...LAYOUT.typography.bodyMedium,
    marginBottom: LAYOUT.spacing.lg,
  },
  heroButton: {
    alignSelf: 'flex-start',
  },
  categoryChipsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  categoryChipsContent: {
    paddingRight: LAYOUT.screenPadding,
  },
  sectionContainer: {
    marginBottom: LAYOUT.spacing.xl,
  },
  sectionTitle: {
    ...LAYOUT.typography.headlineSmall,
    color: COLORS.textPrimary,
    marginBottom: LAYOUT.spacing.md,
  },
  emptyStateCard: {
    padding: LAYOUT.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: COLORS.textTertiary,
    ...LAYOUT.typography.bodyMedium,
    textAlign: 'center',
  },
  eventCard: {
    marginBottom: LAYOUT.spacing.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: LAYOUT.spacing.sm,
  },
  eventTitle: {
    ...LAYOUT.typography.headlineSmall,
    color: COLORS.textPrimary,
  },
  eventCategory: {
    ...LAYOUT.typography.bodySmall,
    color: COLORS.textSecondary,
    marginTop: LAYOUT.spacing.xs,
  },
  favoriteButton: {
    fontSize: LAYOUT.icon.xl,
    color: COLORS.textTertiary,
  },
  favoriteButtonActive: {
    color: COLORS.warning,
  },
  eventDescription: {
    color: COLORS.textSecondary,
    ...LAYOUT.typography.bodyMedium,
    marginBottom: LAYOUT.spacing.md,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: LAYOUT.spacing.lg,
  },
  eventDetail: {
    ...LAYOUT.typography.labelSmall,
    color: COLORS.textTertiary,
  },
  eventButton: {
    width: '100%',
  },
});
