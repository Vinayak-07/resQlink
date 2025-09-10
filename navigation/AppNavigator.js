import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import LearnScreen from '../screens/LearnScreen';
import DrillsScreen from '../screens/DrillsScreen';
import AlertsScreen from '../screens/AlertsScreen';
import DirectoryScreen from '../screens/DirectoryScreen';
import AdminScreen from '../screens/AdminScreen';

// Import Components & Hooks
import CustomDrawerContent from '../components/CustomDrawerContent';
import { useTheme } from '../contexts/ThemeContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { seedDemoData } from '../utils/storage';

const Drawer = createDrawerNavigator();

// Simple placeholder for the Games/Activity screen
function GamesScreen() {
  const { theme } = useTheme();
  return (
    <View style={[styles.placeholderContainer, { backgroundColor: theme.background }]}>
      <MaterialIcons name="construction" size={48} color={theme.textTertiary} />
      <Text style={[styles.placeholderTitle, { color: theme.text }]}>Activity Zone</Text>
      <Text style={[styles.placeholderSubtitle, { color: theme.textSecondary }]}>
        New games and activities are coming soon!
      </Text>
    </View>
  );
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function AppNavigator() {
  const { theme } = useTheme();
  const { reduceMotion } = useAccessibility();

  React.useEffect(() => {
    seedDemoData();
    async function requestPermissions() {
      if (Device.isDevice) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          await Notifications.requestPermissionsAsync();
        }
      }
    }
    requestPermissions();
  }, []);

  const screenOptions = {
    headerStyle: { backgroundColor: theme.headerBg },
    headerTintColor: theme.text,
    drawerActiveTintColor: theme.primary,
    drawerInactiveTintColor: theme.textSecondary,
    drawerStyle: { backgroundColor: theme.drawerBg },
    animation: reduceMotion ? 'none' : 'default',
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={screenOptions}
      >
        {/* --- Screens Visible in Drawer --- */}
        <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard', drawerIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} /> }} />
        <Drawer.Screen name="Learn" component={LearnScreen} options={{ title: 'Learning Modules', drawerIcon: ({ color, size }) => <MaterialIcons name="school" size={size} color={color} /> }} />
        <Drawer.Screen name="Drills" component={DrillsScreen} options={{ title: 'Safety Drills', drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="alarm-light" size={size} color={color} /> }} />
        <Drawer.Screen name="Games" component={GamesScreen} options={{ title: 'Activity Zone', drawerIcon: ({ color, size }) => <MaterialIcons name="games" size={size} color={color} /> }} />
        <Drawer.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Live Alerts', drawerIcon: ({ color, size }) => <MaterialIcons name="warning" size={size} color={color} /> }} />
        <Drawer.Screen name="Directory" component={DirectoryScreen} options={{ title: 'Emergency Directory', drawerIcon: ({ color, size }) => <MaterialIcons name="contact-phone" size={size} color={color} /> }} />
        <Drawer.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin Settings', drawerIcon: ({ color, size }) => <MaterialIcons name="admin-panel-settings" size={size} color={color} /> }} />
        
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
  },
  placeholderSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
});
