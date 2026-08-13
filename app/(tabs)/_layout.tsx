import { SymbolView } from 'expo-symbols';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import { COLORS } from '@/constants/Colors';
import { CustomTabBar } from '@/components/ui/PareaBottomNavigation';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
      >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Αρχική',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'house',
                android: 'home',
                web: 'home',
              }}
              tintColor={color}
              size={24}
            />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable style={{ marginRight: 15 }}>
                {({ pressed }) => (
                  <SymbolView
                    name={{ ios: 'info.circle', android: 'info', web: 'info' }}
                    size={25}
                    tintColor={COLORS.textPrimary}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Εξερεύνηση',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'magnifyingglass',
                android: 'search',
                web: 'search',
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create-event"
        options={{
          title: 'Δημιουργία',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'plus.circle.fill',
                android: 'add',
                web: 'add',
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my-events"
        options={{
          title: 'Τα events μου',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'calendar',
                android: 'event',
                web: 'event',
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Προφίλ',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'person',
                android: 'person',
                web: 'person',
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}


