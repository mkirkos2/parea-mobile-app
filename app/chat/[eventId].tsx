import { StyleSheet, View, Text, FlatList, Pressable, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import COLORS from '@/constants/Colors';
import LAYOUT from '@/constants/layout';
import { useState, useEffect, useRef } from 'react';
import { filterMessagesByEvent, sortMessagesByTimestamp, isValidMessage } from '@/utils/chat';
import { useDialog } from '@/components/ui/PareaDialog';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { events, participations, messages, addMessage } = useAppContext();
  const { user } = useAuth();
  const { showDialog } = useDialog();
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  // Find the event by ID (ensure proper string comparison)
  const event = events.find(e => String(e.id) === String(id));
  
  // Filter and sort messages for this event
  const eventMessages = sortMessagesByTimestamp(filterMessagesByEvent(messages, event?.id ? String(event.id) : String(id)));
  
  // Handle sending a new message
  const handleSend = () => {
    if (!event) return;
    
    if (!isValidMessage(newMessage)) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Το μήνυμα δεν μπορεί να είναι κενό',
        type: 'error',
      });
      return;
    }
    
    // Check if user is authenticated before sending message
    if (!user?.id) {
      showDialog({
        title: 'Σφάλμα',
        message: 'Πρέπει να είσαι συνδεδεμένος/η για να στείλεις μήνυμα',
        type: 'error',
      });
      return;
    }

    // Create a new message
    const message = {
      id: Math.random().toString(36).substring(7),
      eventId: event.id,
      userId: user.id.toString(), // Use authenticated user ID
      userName: user.name || 'Εσύ', // Use authenticated user name
      text: newMessage,
      timestamp: new Date(),
    };
    
    // Add the message to the context
    addMessage(message);
    
    // Clear the input
    setNewMessage('');
  };
  
  useEffect(() => {
    if (eventMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [eventMessages.length]);

  // If event not found, show an error message
  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Το event δεν βρέθηκε</Text>
        <Pressable style={styles.backButton} onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/(tabs)/home");
          }
        }}>
          <Text style={styles.backButtonText}>Επιστροφή</Text>
        </Pressable>
      </View>
    );
  }
  
// Check if user can access chat
    const canAccessChat = participations[event.id] === 'approved' || (user?.id && event.host === user.id.toString());
  
  // If user cannot access chat, show an error message
  if (!canAccessChat) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Δεν έχεις πρόσβαση στη συνομιλία αυτού του event</Text>
        <Pressable style={styles.backButton} onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/(tabs)/home");
          }
        }}>
          <Text style={styles.backButtonText}>Επιστροφή</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={eventMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            user?.id && item.userId === user.id.toString() ? styles.ownMessageContainer : styles.otherMessageContainer
          ]}>
            <Text style={styles.userName}>{item.userName}</Text>
            <View style={[
              styles.messageBubble,
              user?.id && item.userId === user.id.toString() ? styles.ownMessageBubble : styles.otherMessageBubble
            ]}>
              <Text style={[
                styles.messageText,
                user?.id && item.userId === user.id.toString() ? styles.ownMessageText : styles.otherMessageText
              ]}>
                {item.text}
              </Text>
            </View>
            <Text style={styles.timestamp}>
              {item.timestamp.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Γράψε ένα μήνυμα..."
          multiline
        />
        <Pressable 
          style={styles.sendButton}
          onPress={handleSend}
        >
          <Text style={styles.sendButtonText}>Αποστολή</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messagesContainer: {
    padding: LAYOUT.screenPadding,
  },
  messageContainer: {
    marginBottom: 16,
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: LAYOUT.spacing.md,
    borderRadius: LAYOUT.borderRadius.lg,
  },
  ownMessageBubble: {
    backgroundColor: COLORS.primary,
  },
  otherMessageBubble: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  messageText: {
    fontSize: 16,
  },
  ownMessageText: {
    color: COLORS.white,
  },
  otherMessageText: {
    color: COLORS.textPrimary,
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: LAYOUT.screenPadding,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.md,
    marginRight: LAYOUT.spacing.md,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: LAYOUT.borderRadius.md,
    paddingVertical: LAYOUT.spacing.md,
    paddingHorizontal: LAYOUT.spacing.lg,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: COLORS.white,
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