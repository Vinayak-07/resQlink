import React from 'react';
import { View, Pressable } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { globalStyles } from '../constants/styles';

export function Card({ children, style, onPress = null }) {
  const { theme } = useTheme();
  const Component = onPress ? Pressable : View;

  return (
    <Component
      onPress={onPress}
      style={[
        globalStyles.card,
        { backgroundColor: theme.cardBackground, shadowColor: theme.cardShadow },
        style,
      ]}
    >
      {children}
    </Component>
  );
}
