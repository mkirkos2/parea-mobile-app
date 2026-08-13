import { StyleSheet, View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import COLORS from '@/constants/Colors';
import LAYOUT from '@/constants/layout';
import CATEGORIES from '@/constants/categories';
import { Event } from '@/types';
import { useState, useMemo } from 'react';

export default function ExploreScreen() {
  const { events, favorites, toggleFavorite } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [participationMode, setParticipationMode] = useState<string | null>(null);
  const [firstTimeFriendlyOnly, setFirstTimeFriendlyOnly] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);
  
  // Filter events based on all criteria
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
      
      // Participation mode filter
      if (participationMode && event.participationMode !== participationMode) {
        return false;
      }
      
      // First time friendly filter
      if (firstTimeFriendlyOnly && !event.firstTimeFriendly) {
        return false;
      }
      
      // Free events filter
      if (freeOnly && event.cost > 0) {
        return false;
      }
      
      return true;
    });
  }, [events, searchQuery, selectedCategory, participationMode, firstTimeFriendlyOnly, freeOnly]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Εξερεύνηση</Text>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Αναζήτηση events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.textTertiary}
        />
      </View>
      
      {/* Category Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Κατηγορίες:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipsContainer}>
          <Pressable 
            style={[styles.filterChip, !selectedCategory && styles.activeFilterChip]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.filterChipText, !selectedCategory && styles.activeFilterChipText]}>Όλα</Text>
          </Pressable>
          {CATEGORIES.map(category => (
            <Pressable 
              key={category.id}
              style={[styles.filterChip, selectedCategory === category.id && styles.activeFilterChip]}
              onPress={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              <Text style={[styles.filterChipText, selectedCategory === category.id && styles.activeFilterChipText]}>
                {category.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      
      {/* Additional Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Επιπλέον φίλτρα:</Text>
        <View style={styles.filterOptionsContainer}>
          <Pressable 
            style={[styles.filterOption, participationMode === 'open' && styles.activeFilterOption]}
            onPress={() => setParticipationMode(participationMode === 'open' ? null : 'open')}
          >
            <Text style={[styles.filterOptionText, participationMode === 'open' && styles.activeFilterOptionText]}>
              Ανοιχτά
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.filterOption, participationMode === 'approval' && styles.activeFilterOption]}
            onPress={() => setParticipationMode(participationMode === 'approval' ? null : 'approval')}
          >
            <Text style={[styles.filterOptionText, participationMode === 'approval' && styles.activeFilterOptionText]}>
              Με έγκριση
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.filterOption, freeOnly && styles.activeFilterOption]}
            onPress={() => setFreeOnly(!freeOnly)}
          >
            <Text style={[styles.filterOptionText, freeOnly && styles.activeFilterOptionText]}>
              Δωρεάν
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.filterOption, firstTimeFriendlyOnly && styles.activeFilterOption]}
            onPress={() => setFirstTimeFriendlyOnly(!firstTimeFriendlyOnly)}
          >
            <Text style={[styles.filterOptionText, firstTimeFriendlyOnly && styles.activeFilterOptionText]}>
              Ιδανικά για πρώτη φορά
            </Text>
          </Pressable>
        </View>
        {(selectedCategory || participationMode || firstTimeFriendlyOnly || freeOnly) && (
          <Pressable 
            style={styles.clearFiltersButton}
            onPress={() => {
              setSelectedCategory(null);
              setParticipationMode(null);
              setFirstTimeFriendlyOnly(false);
              setFreeOnly(false);
            }}
          >
            <Text style={styles.clearFiltersText}>Καθαρισμός φίλτρων</Text>
          </Pressable>
        )}
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
  searchInput: {
    color: COLORS.textPrimary,
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
  activeFilterChip: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.textPrimary,
  },
  activeFilterChipText: {
    color: COLORS.white,
  },
  filterOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  filterOption: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.md,
    paddingVertical: LAYOUT.spacing.sm,
    paddingHorizontal: LAYOUT.spacing.md,
    marginRight: LAYOUT.spacing.sm,
    marginBottom: LAYOUT.spacing.sm,
  },
  activeFilterOption: {
    backgroundColor: COLORS.primary,
  },
  filterOptionText: {
    color: COLORS.textPrimary,
  },
  activeFilterOptionText: {
    color: COLORS.white,
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
