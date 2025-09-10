import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, Modal, Pressable, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { Card } from '../components/Card';
import { getContent, getDetailedContent } from '../constants/content';
import { globalStyles as styles } from '../constants/styles';

export default function LearnScreen() {
  const { theme } = useTheme();
  const { lang, strings } = useLang();
  const { scaleFont, reduceMotion } = useAccessibility();
  const [selectedContent, setSelectedContent] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  
  const content = getContent(lang);

  const openDetail = useCallback((item) => {
    setSelectedContent(getDetailedContent(item.id, lang));
    setShowDetail(true);
  }, [lang]);

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="school" size={32} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text, fontSize: scaleFont(28) }]}>{strings.learnModules}</Text>
          </View>
          {content.map(item => (
            <Card key={item.id} onPress={() => openDetail(item)}>
              <View style={styles.learnCard}>
                <View style={[styles.learnIcon, { backgroundColor: `${theme.primary}15` }]}>
                  <item.IconComponent name={item.iconName} size={28} color={theme.primary} />
                </View>
                <View style={styles.learnContent}>
                  <Text style={[styles.learnTitle, { color: theme.text, fontSize: scaleFont(17) }]}>{item.title}</Text>
                  <Text style={[styles.learnSummary, { color: theme.textSecondary, fontSize: scaleFont(14) }]}>{item.body}</Text>
                  <View style={styles.readMoreRow}>
                      <Text style={[styles.readMore, { color: theme.primary, fontSize: scaleFont(14) }]}>Tap to learn more</Text>
                      <MaterialIcons name="arrow-forward-ios" size={14} color={theme.primary} />
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showDetail} animationType={reduceMotion ? 'fade' : 'slide'} presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.separator }]}>
                <Pressable onPress={() => setShowDetail(false)} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
                    <Text style={[styles.backText, { color: theme.primary }]}>Back</Text>
                </Pressable>
            </View>
            {selectedContent && (
                <ScrollView style={styles.modalContent}>
                    <Text style={[styles.modalTitle, { color: theme.text, fontSize: scaleFont(28) }]}>{selectedContent.title}</Text>
                    {selectedContent.sections.map((section, idx) => (
                        <Card key={idx}>
                            <Text style={[styles.sectionSubtitle, { color: theme.text, fontSize: scaleFont(18) }]}>{section.subtitle}</Text>
                            <Text style={[styles.sectionText, { color: theme.textSecondary, fontSize: scaleFont(15) }]}>{section.content}</Text>
                            {section.steps && (
                                <View style={styles.stepsList}>
                                    {section.steps.map((step, stepIdx) => (
                                        <View key={stepIdx} style={styles.stepItem}>
                                            <View style={[styles.stepNumber, { backgroundColor: theme.primary }]}><Text style={styles.stepNumberText}>{stepIdx + 1}</Text></View>
                                            <Text style={[styles.stepText, { color: theme.text, fontSize: scaleFont(15) }]}>{step}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </Card>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
      </Modal>
    </>
  );
}
