import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from './app/contexts/ThemeContext';
import { StatsProvider } from './app/contexts/StatsContext';
import { LangProvider } from './app/contexts/LanguageContext';
import { AccessibilityProvider } from './app/contexts/AccessibilityContext';
import AppNavigator from './app/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatsProvider>
            <LangProvider>
              <AccessibilityProvider>
                <AppNavigator />
              </AccessibilityProvider>
            </LangProvider>
          </StatsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
