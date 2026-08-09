import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import COLORS from '@/constants/Colors';
import LAYOUT from '@/constants/layout';
import { useAppContext } from '@/context/AppContext';
import { Event } from '@/types';
import CATEGORIES from '@/constants/categories';

export default function MyEventsScreen() {
  const { events, participations, createdEvents } = useAppContext();
  
  // Upcoming events (approved participations)
  const upcomingEvents = events.filter(event => 
    participations[event.id] === 'approved' && new Date(event.date) >= new Date()
  );
  
  // Pending requests
  const pendingRequests = events.filter(event => 
    participations[event.id] === 'pending'
  );
  
  // Hosting events
  const hostingEvents = [...events, ...createdEvents].filter(event => 
    createdEvents.some(ce => ce.id === event.id)
  );
  
  // Past events (approved participations that are in the past)
  const pastEvents = events.filter(event => 
    participations[event.id] === 'approved' && new Date(event.date) < new Date()
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Τα events μου</Text>
      
      {/* Upcoming Events Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Επόμενα</Text>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>Δεν έχεις εγγραφεί σε κανένα επερχόμενο event</Text>
          </View>
        )}
      </View>
      
      {/* Pending Requests Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Αιτήματα</Text>
        {pendingRequests.length > 0 ? (
          pendingRequests.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>Δεν υπάρχουν εκκρεμή αιτήματα</Text>
          </View>
        )}
      </View>
      
      {/* Hosting Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Διοργανώνω</Text>
        {hostingEvents.length > 0 ? (
          hostingEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>Δεν διοργανώνεις κανένα event</Text>
          </View>
        )}
      </View>
      
      {/* Past Events Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ολοκληρωμένα</Text>
        {pastEvents.length > 0 ? (
          pastEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>Δεν έχεις συμμετάσχει σε κανένα ολοκληρωμένο event</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const EventCard = ({ event }: { event: Event }) => (
  <View style={styles.eventCard}>
    <View style={styles.eventHeader}>
      <View>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventCategory}>{CATEGORIES.find(c => c.id === event.category)?.name}</Text>
      </View>
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
    marginBottom: 24,
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
  emptyStateContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
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
});