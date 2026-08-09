import { StyleSheet, View, Text, FlatList, Pressable, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import COLORS from '@/constants/Colors';
import LAYOUT from '@/constants/layout';
import { useState, useEffect, useRef } from 'react';
import { filterMessagesByEvent, sortMessagesByTimestamp, isValidMessage } from '@/utils/chat';
import { useDialog } from '@/components/ui/PareaDialog';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { events, participations, messages, addMessage } = useAppContext();
  const { showDialog } = useDialog();
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  // Find the event by ID
  const event = events.find(e => e.id === id);
  
  // Filter and sort messages for this event
  const eventMessages = sortMessagesByTimestamp(filterMessagesByEvent(messages, event?.id || ''));
  
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
    
    // Create a new message
    const message = {
      id: Math.random().toString(36).substring(7),
      eventId: event.id,
      userId: 'currentUserId', // In a real app, this would be the actual user ID
      userName: 'Εσύ', // In a real app, this would be the actual user name
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
        <Pressable style={styles.backButton} onPress={() => router.push({
          pathname: "/event/[id]",
          params: { id: id as string }
        })}>
          <Text style={styles.backButtonText}>Επιστροφή στο event</Text>
        </Pressable>
      </View>
    );
  }
  
  // Check if user can access chat
  const canAccessChat = participations[event.id] === 'approved' || event.host === 'currentUserId';
  
  // If user cannot access chat, show an error message
  if (!canAccessChat) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Δεν έχεις πρόσβαση στη συνομιλία αυτού του event</Text>
        <Pressable style={styles.backButton} onPress={() => router.push({
          pathname: "/event/[id]",
          params: { id: id as string }
        })}>
          <Text style={styles.backButtonText}>Επιστροφή στο event</Text>
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
            item.userId === 'currentUserId' ? styles.ownMessageContainer : styles.otherMessageContainer
          ]}>
            <Text style={styles.userName}>{item.userName}</Text>
            <View style={[
              styles.messageBubble,
              item.userId === 'currentUserId' ? styles.ownMessageBubble : styles.otherMessageBubble
            ]}>
              <Text style={[
                styles.messageText,
                item.userId === 'currentUserId' ? styles.ownMessageText : styles.otherMessageText
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