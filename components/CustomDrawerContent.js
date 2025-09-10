import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LanguageContext';
import { LANG } from '../constants/content';
import { globalStyles } from '../constants/styles';

export default function CustomDrawerContent(props) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { lang, switchLang } = useLang();

  const toggleLanguage = useCallback(() => {
    const newLang = lang === LANG.EN ? LANG.HI : LANG.EN;
    switchLang(newLang);
  }, [lang, switchLang]);

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: theme.drawerBg }} contentContainerStyle={{ paddingTop: 0 }}>
      <View style={[globalStyles.drawerHeader, { backgroundColor: theme.primary }]}>
        <MaterialCommunityIcons name="shield-check" size={40} color="#ffffff" />
        <Text style={globalStyles.drawerHeaderTitle}>Disaster Prep</Text>
        <Text style={globalStyles.drawerHeaderSubtitle}>Stay Safe, Stay Prepared</Text>
      </View>

      <View style={globalStyles.drawerSection}>
        <DrawerItemList {...props} />
      </View>
      
      <View style={[globalStyles.drawerSection, { borderTopWidth: 1, borderTopColor: theme.separator }]}>
        <Text style={[globalStyles.sectionLabel, { color: theme.textTertiary }]}>PREFERENCES</Text>
        <DrawerItem
          label={`Theme: ${isDark ? 'Dark' : 'Light'}`}
          onPress={toggleTheme}
          icon={({ size }) => <MaterialIcons name={isDark ? 'dark-mode' : 'light-mode'} size={size} color={theme.textSecondary} />}
          labelStyle={{ color: theme.text }}
        />
        <DrawerItem
          label={`Language: ${lang === LANG.EN ? 'English' : 'हिंदी'}`}
          onPress={toggleLanguage}
          icon={({ size }) => <MaterialIcons name="translate" size={size} color={theme.textSecondary} />}
          labelStyle={{ color: theme.text }}
        />
      </View>
    </DrawerContentScrollView>
  );
}
