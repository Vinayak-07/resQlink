import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { Card } from '../components/Card';
import { globalStyles as styles } from '../constants/styles';

// List of all games available in the app
const games = [
  {
    id: 'go-bag-packer',
    title: 'Go-Bag Packer',
    description: 'Pack your emergency kit against the clock!',
    icon: 'briefcase-check',
    IconComponent: MaterialCommunityIcons,
    targetScreen: 'GoBagPacker', // Navigates to the new game
  },
  {
    id: 'quiz',
    title: 'Safety Quiz',
    description: 'Test your knowledge on disaster safety.',
    icon: 'quiz',
    IconComponent: MaterialIcons,
    targetScreen: 'Quiz', // Navigates to the original quiz screen
  },
];

export default function GamesScreen({ navigation }) {
  const { theme } = useTheme();
  const { lang } = useLang();
  const { scaleFont } = useAccessibility();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="games" size={32} color={theme.primary} />
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: scaleFont(28) }]}>Activity Zone</Text>
        </View>

        {games.map(game => (
          <Card key={game.id} onPress={() => navigation.navigate(game.targetScreen)}>
            <View style={styles.drillCard}>
              <View style={[styles.drillIconContainer, { backgroundColor: `${theme.primary}15` }]}>
                <game.IconComponent name={game.icon} size={28} color={theme.primary} />
              </View>
              <View style={styles.drillContent}>
                <Text style={[styles.drillTitle, { color: theme.text, fontSize: scaleFont(17) }]}>{game.title}</Text>
                <Text style={[styles.drillSummary, { color: theme.textSecondary, fontSize: scaleFont(14) }]}>{game.description}</Text>
              </View>
              <MaterialIcons name="play-arrow" size={24} color={theme.textTertiary} />
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
