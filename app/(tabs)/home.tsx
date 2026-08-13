import { StyleSheet, View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
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
import { useState, useMemo } from 'react';

export default function HomeScreen() {
  const { events, favorites, toggleFavorite } = useAppContext();
  const { user } = useAuth();
  const { showDialog } = useDialog();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter events based on search and category
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search query filter
      if (searchQuery && 
          !event.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !event.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (selectedCategory && event.category !== selectedCategory) {
        return false;
      }
      
      return true;
    });
  }, [events, searchQuery, selectedCategory]);

  // Filter events for "For You" section (favorited events)
  const forYouEvents = filteredEvents.filter(event => favorites.includes(event.id));

  // Filter events for "Near You" section
  const nearYouEvents = filteredEvents;

  // Filter events for "This Weekend" section
  const weekendEvents = filteredEvents.filter(event => {
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
  const firstTimeEvents = filteredEvents.filter(event => event.firstTimeFriendly);

  return (
    <PareaScreen scrollable bottomSpacing>
      <View style={styles.contentContainer}>
        <PareaHeader 
          title={`Γεια σου, ${user?.name || 'Χρήστη'}!`} 
          subtitle="Τι θα κάνουμε;"
        />
        
        {/* Search Bar */}
        <PareaCard style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Αναζήτηση events..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textTertiary}
          />
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
          <PareaChip 
            label="Όλα" 
            onPress={() => setSelectedCategory(null)}
            selected={!selectedCategory}
          />
          {CATEGORIES.map((category) => (
            <PareaChip 
              key={category.id} 
              label={`${category.icon} ${category.name}`} 
              onPress={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              selected={selectedCategory === category.id}
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
  const router = useRouter();
  const { favorites } = useAppContext();
  
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable onPress={() => router.push('/(tabs)/explore')}>
          <Text style={styles.seeMoreText}>Περισσότερα</Text>
        </Pressable>
      </View>
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
  searchInput: {
    color: COLORS.textPrimary,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: LAYOUT.spacing.md,
  },
  sectionTitle: {
    ...LAYOUT.typography.headlineSmall,
    color: COLORS.textPrimary,
  },
  seeMoreText: {
    color: COLORS.primary,
    ...LAYOUT.typography.labelLarge,
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
