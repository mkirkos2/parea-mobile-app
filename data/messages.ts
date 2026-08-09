// Demo Messages Data
import { ChatMessage } from '@/types';

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    eventId: '1',
    userId: 'host1',
    userName: 'Αλέξης',
    text: 'Καλωσορίσατε όλοι στον καφέ γνωριμίας! Αν έχετε οποιαδήποτε ερώτηση, μη διστάσετε να ρωτήσετε.',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    eventId: '1',
    userId: 'user2',
    userName: 'Μαρία',
    text: 'Ευχαριστώ! Πολύ χαρούμενη που είμαι εδώ. Ποιος θέλει να μοιραστεί τι τον ώθησε να έρθει;',
    timestamp: new Date(Date.now() - 3300000),
  },
  {
    id: '3',
    eventId: '1',
    userId: 'user3',
    userName: 'Γιώργος',
    text: 'Ήθελα να γνωρίσω νέους ανθρώπους εκτός δουλειάς. Και εσύ Μαρία;',
    timestamp: new Date(Date.now() - 3000000),
  },
  {
    id: '4',
    eventId: '2',
    userId: 'host2',
    userName: 'Δημήτρης',
    text: 'Θα ξεκινήσουμε σε 10 λεπτά! Έλα να συναντηθούμε στην είσοδο του Συντάγματος.',
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: '5',
    eventId: '2',
    userId: 'user5',
    userName: 'Ελένη',
    text: 'Είμαι ήδη εκεί! Ποιος θα φοράει κόκκινο πουτσάκι για να σε βρω εύκολα;',
    timestamp: new Date(Date.now() - 7000000),
  },
];

export default DEMO_MESSAGES;