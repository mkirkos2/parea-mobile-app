import { COLORS } from '@/constants/Colors';
import { LAYOUT } from '@/constants/layout';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type DialogType = 'info' | 'success' | 'warning' | 'error' | 'confirm';

interface DialogOptions {
  title: string;
  message: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface DialogContextType {
  showDialog: (options: DialogOptions) => void;
  hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<DialogOptions>({
    title: '',
    message: '',
    type: 'info',
    confirmText: 'Εντάξει',
    cancelText: 'Ακύρωση',
  });
  const [opacity] = useState(new Animated.Value(0));

  const showDialog = (dialogOptions: DialogOptions) => {
    // Ensure confirmText is never empty
    const finalOptions = {
      ...dialogOptions,
      confirmText: dialogOptions.confirmText || 'Εντάξει',
      cancelText: dialogOptions.cancelText || 'Ακύρωση',
    };
    
    setOptions(finalOptions);
    setVisible(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const hideDialog = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  const handleConfirm = () => {
    if (options.onConfirm) {
      options.onConfirm();
    }
    hideDialog();
  };

  const handleCancel = () => {
    if (options.onCancel) {
      options.onCancel();
    }
    hideDialog();
  };

  const getTypeStyles = () => {
    switch (options.type) {
      case 'success':
        return { borderColor: COLORS.success };
      case 'warning':
        return { borderColor: COLORS.warning };
      case 'error':
        return { borderColor: COLORS.error };
      default:
        return { borderColor: COLORS.primary };
    }
  };

  const { borderColor } = getTypeStyles();

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      <Modal
        transparent
        visible={visible}
        onRequestClose={hideDialog}
        animationType="none"
      >
        <Animated.View style={[styles.overlay, { opacity }]}>
          <View style={[styles.dialog, { borderColor }]}>
            <View style={styles.header}>
              <Text style={styles.title}>{options.title}</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.message}>{options.message}</Text>
            </View>
            <View style={styles.actions}>
              {options.type === 'confirm' && (
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>{options.cancelText}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.confirmButton, options.type === 'confirm' && styles.confirmButtonWithCancel]} 
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>
                  {options.confirmText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </DialogContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: LAYOUT.screenPadding,
  },
  dialog: {
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.borderRadius.lg,
    width: '100%',
    maxWidth: 320,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    boxShadow: `0px 4px 8px ${COLORS.shadow}`,
  },
  header: {
    padding: LAYOUT.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...LAYOUT.typography.headlineSmall,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  content: {
    padding: LAYOUT.spacing.lg,
    paddingBottom: LAYOUT.spacing.md,
  },
  message: {
    ...LAYOUT.typography.bodyMedium,
    color: COLORS.textPrimary, // Slightly darker for improved readability
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the actions
    padding: LAYOUT.spacing.md, // Reduced bottom padding
    paddingTop: 0,
  },
  cancelButton: {
    marginRight: LAYOUT.spacing.md,
    paddingVertical: LAYOUT.spacing.sm,
    paddingHorizontal: LAYOUT.spacing.lg,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...LAYOUT.typography.labelLarge,
    color: COLORS.textSecondary,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: LAYOUT.borderRadius.md,
    paddingVertical: LAYOUT.spacing.sm,
    paddingHorizontal: LAYOUT.spacing.lg,
    minWidth: 80,
    alignItems: 'center',
  },
  confirmButtonWithCancel: {
    backgroundColor: COLORS.primary,
  },
  confirmButtonText: {
    ...LAYOUT.typography.labelLarge,
    color: COLORS.white,
    fontWeight: '600',
  },
});