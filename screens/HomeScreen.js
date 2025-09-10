import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '../contexts/ThemeContext';
import { useStats } from '../contexts/StatsContext';
import { useLang } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { Card } from '../components/Card';
import { ActionButton } from '../components/ActionButton';
import { SAFETYTIPS } from '../constants/content';
import { globalStyles as styles } from '../constants/styles';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { stats } = useStats();
  const { lang, strings } = useLang();
  const { scaleFont } = useAccessibility();
  const [safetyTip, setSafetyTip] = useState(SAFETYTIPS[Math.floor(Math.random() * SAFETYTIPS.length)]);

  const getNewTip = useCallback(() => {
    setSafetyTip(SAFETYTIPS[Math.floor(Math.random() * SAFETYTIPS.length)]);
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="shield-check" size={32} color={theme.primary} />
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: scaleFont(28) }]}>{strings.appTitle}</Text>
        </View>

        <Card>
          <View style={styles.cardHeader}>
            <MaterialIcons name="analytics" size={24} color={theme.primary} />
            <Text style={[styles.cardTitle, { color: theme.text, fontSize: scaleFont(20) }]}>{strings.preparednessScore}</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}><Text style={[styles.statValue, { color: theme.primary, fontSize: scaleFont(28) }]}>{Math.round(stats.completion)}%</Text><Text style={[styles.statLabel, { color: theme.textSecondary, fontSize: scaleFont(13) }]}>{strings.completion}</Text></View>
            <View style={styles.statItem}><Text style={[styles.statValue, { color: theme.success, fontSize: scaleFont(28) }]}>{Math.round(stats.avgScore)}%</Text><Text style={[styles.statLabel, { color: theme.textSecondary, fontSize: scaleFont(13) }]}>{strings.avgScore}</Text></View>
            <View style={styles.statItem}><Text style={[styles.statValue, { color: theme.warning, fontSize: scaleFont(28) }]}>{stats.drills}</Text><Text style={[styles.statLabel, { color: theme.textSecondary, fontSize: scaleFont(13) }]}>{strings.drillsDone}</Text></View>
          </View>
        </Card>

        <Card>
          <View style={styles.cardHeader}>
            <MaterialIcons name="rocket-launch" size={24} color={theme.secondary} />
            <Text style={[styles.cardTitle, { color: theme.text, fontSize: scaleFont(20) }]}>{strings.quickActions}</Text>
          </View>
          <View style={styles.actionGrid}>
            <ActionButton title={strings.startDrill} onPress={() => navigation.navigate('Drills')} color={theme.error} iconName="alarm-light" IconComponent={MaterialCommunityIcons} />
            <ActionButton title={strings.takeQuiz} onPress={() => navigation.navigate('Quiz')} color={theme.purple} iconName="quiz" />
            <ActionButton title={strings.directory} onPress={() => navigation.navigate('Directory')} color={theme.error} iconName="emergency" />
            <ActionButton title={strings.alerts} onPress={() => navigation.navigate('Alerts')} color={theme.warning} iconName="warning" />
          </View>
        </Card>

        <Card>
            <View style={styles.cardHeader}>
                <MaterialIcons name="lightbulb" size={24} color={theme.orange} />
                <Text style={[styles.cardTitle, { color: theme.text, fontSize: scaleFont(20) }]}>Safety Tip</Text>
            </View>
            <Text style={[styles.safetyTipText, { color: theme.textSecondary, marginBottom: 16, fontSize: scaleFont(15) }]}>{safetyTip[lang]}</Text>
            <Pressable onPress={getNewTip} style={[styles.secondaryButton, { backgroundColor: `${theme.primary}15` }]}>
                <MaterialIcons name="refresh" size={20} color={theme.primary} />
                <Text style={[styles.secondaryButtonText, { color: theme.primary, fontSize: scaleFont(14) }]}>Get a New Tip</Text>
            </Pressable>
        </Card>
      </View>
    </ScrollView>
  );
}
