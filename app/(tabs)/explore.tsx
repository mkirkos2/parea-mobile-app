import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import COLORS from '@/constants/Colors';
import LAYOUT from '@/constants/layout';
import CATEGORIES from '@/constants/categories';
import { Event } from '@/types';

export default function ExploreScreen() {
  const { events, favorites, toggleFavorite } = useAppContext();
  
  // For demo purposes, showing all events
  const filteredEvents = events;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Εξερεύνηση</Text>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchPlaceholder}>Αναζήτηση events...</Text>
      </View>
      
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Φίλτρα:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipsContainer}>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>Όλα</Text>
          </View>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>Ανοιχτά</Text>
          </View>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>Με έγκριση</Text>
          </View>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>Δωρεάν</Text>
          </View>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>Ιδανικά για πρώτη φορά</Text>
          </View>
        </ScrollView>
        <Pressable style={styles.clearFiltersButton}>
          <Text style={styles.clearFiltersText}>Καθαρισμός φίλτρων</Text>
        </Pressable>
      </View>
      
      {/* Events List */}
      {filteredEvents.length > 0 ? (
        filteredEvents.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            isFavorite={favorites.includes(event.id)}
            onToggleFavorite={() => toggleFavorite(event.id)} 
          />
        ))
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>Δεν βρέθηκαν events</Text>
          <Text style={styles.emptyStateSubtext}>Δοκίμασε να αλλάξεις τα φίλτρα σου</Text>
        </View>
      )}
    </ScrollView>
  );
}

const EventCard = ({ event, isFavorite, onToggleFavorite }: { 
  event: Event; 
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) => (
  <View style={styles.eventCard}>
    <View style={styles.eventHeader}>
      <View>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventCategory}>{CATEGORIES.find(c => c.id === event.category)?.name}</Text>
      </View>
      <Pressable onPress={onToggleFavorite}>
        <Text style={styles.favoriteButton}>{isFavorite ? '★' : '♡'}</Text>
      </Pressable>
    </View>
    <Text style={styles.eventDescription} numberOfLines={2}>{event.description}</Text>
    <View style={styles.eventDetails}>
      <Text style={styles.eventDetail}>{new Date(event.date).toLocaleDateString('el-GR')}</Text>
      <Text style={styles.eventDetail}>{event.time}</Text>
      <Text style={styles.eventDetail}>{event.area}</Text>
    </View>
    <Link href={`/event/${event.id}`} asChild>
      <Pressable style={styles.eventButton}>
        <Text style={styles.eventButtonText}>Περισσότερα</Text>
      </Pressable>
    </Link>
  </View>
);

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
    marginBottom: 16,
  },
  searchContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.lg,
    padding: LAYOUT.spacing.md,
    marginBottom: 16,
  },
  searchPlaceholder: {
    color: COLORS.textTertiary,
  },
  filtersContainer: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.full,
    paddingVertical: LAYOUT.spacing.sm,
    paddingHorizontal: LAYOUT.spacing.lg,
    marginRight: LAYOUT.spacing.sm,
  },
  filterChipText: {
    color: COLORS.textPrimary,
  },
  clearFiltersButton: {
    alignSelf: 'flex-start',
  },
  clearFiltersText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  eventCard: {
    backgroundColor: COLORS.white,
    borderRadius: LAYOUT.borderRadius.lg,
    padding: LAYOUT.cardPadding,
    marginBottom: LAYOUT.spacing.md,
    ...LAYOUT.shadows.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  eventCategory: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  favoriteButton: {
    fontSize: 20,
  },
  eventDescription: {
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  eventDetail: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  eventButton: {
    backgroundColor: COLORS.primary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.sm,
    alignItems: 'center',
  },
  eventButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: COLORS.textSecondary,
  },
});
