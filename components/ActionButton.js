import React from 'react';
import { Pressable, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { globalStyles } from '../constants/styles';

export function ActionButton({ title, onPress, color, iconName, IconComponent = MaterialIcons }) {
  return (
    <Pressable
      onPress={onPress}
      style={[globalStyles.actionButton, { backgroundColor: color }]}
    >
      <IconComponent name={iconName} size={24} color="#ffffff" />
      <Text style={[globalStyles.buttonText, { color: '#ffffff' }]}>{title}</Text>
    </Pressable>
  );
}
