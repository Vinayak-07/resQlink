import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable, Alert, AccessibilityInfo } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '../contexts/ThemeContext';
import { useStats } from '../contexts/StatsContext';
import { useLang } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { Card } from '../components/Card';
import { HAZARDS } from '../constants/content';
import { recordDrillResult } from '../utils/storage';
import { globalStyles as styles } from '../constants/styles';

export default function DrillsScreen() {
    const { theme } = useTheme();
    const { refreshStats } = useStats();
    const { lang, strings } = useLang();
    const { scaleFont } = useAccessibility();
    const [currentDrill, setCurrentDrill] = useState(null);
    const [step, setStep] = useState(0);

    const startDrill = useCallback((hazard) => {
        setCurrentDrill(hazard);
        setStep(0);
        AccessibilityInfo.announceForAccessibility(`Starting ${hazard.title[lang]} drill.`);
    }, [lang]);

    const nextStep = useCallback(async () => {
        if (!currentDrill) return;

        if (step + 1 >= currentDrill.steps.length) {
            await recordDrillResult({ hazard: currentDrill.id, score: 100 });
            await refreshStats();
            const completionMessage = 'Drill Complete! Great job! You are now better prepared.';
            Alert.alert('Drill Complete!', completionMessage);
            AccessibilityInfo.announceForAccessibility(completionMessage);
            setCurrentDrill(null);
        } else {
            setStep(s => s + 1);
            AccessibilityInfo.announceForAccessibility(`Step ${step + 2}. ${currentDrill.steps[step + 1][lang].instruction}`);
        }
    }, [currentDrill, step, lang, refreshStats]);

    if (currentDrill) {
        const currentStep = currentDrill.steps[step][lang];
        return (
            <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <currentDrill.IconComponent name={currentDrill.iconName} size={32} color={theme.error} />
                        <Text style={[styles.sectionTitle, { color: theme.text, fontSize: scaleFont(28) }]}>{currentDrill.title[lang]}</Text>
                    </View>
                    <Card>
                        <Text style={[styles.cardTitle, { color: theme.text, fontSize: scaleFont(20) }]}>Step {step + 1} of {currentDrill.steps.length}</Text>
                        <Text style={[styles.drillInstruction, { color: theme.textSecondary, fontSize: scaleFont(16) }]}>{currentStep.instruction}</Text>
                        <Pressable onPress={nextStep} style={[styles.primaryButton, { backgroundColor: theme.success }]}>
                            <MaterialIcons name={step + 1 >= currentDrill.steps.length ? 'check-circle' : 'arrow-forward'} size={20} color="#ffffff" />
                            <Text style={[styles.primaryButtonText, { fontSize: scaleFont(16) }]}>{step + 1 >= currentDrill.steps.length ? 'Complete' : 'Next Step'}</Text>
                        </Pressable>
                    </Card>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name="alarm-light" size={32} color={theme.error} />
                    <Text style={[styles.sectionTitle, { color: theme.text, fontSize: scaleFont(28) }]}>{strings.startDrill}</Text>
                </View>
                {HAZARDS.map(hazard => (
                    <Card key={hazard.id} onPress={() => startDrill(hazard)}>
                        <View style={styles.drillCard}>
                            <View style={[styles.drillIconContainer, { backgroundColor: `${hazard.color}15` }]}>
                                <hazard.IconComponent name={hazard.iconName} size={28} color={hazard.color} />
                            </View>
                            <View style={styles.drillContent}>
                                <Text style={[styles.drillTitle, { color: theme.text, fontSize: scaleFont(17) }]}>{hazard.title[lang]}</Text>
                                <Text style={[styles.drillSummary, { color: theme.textSecondary, fontSize: scaleFont(14) }]}>{hazard.summary[lang]}</Text>
                            </View>
                            <MaterialIcons name="play-arrow" size={24} color={theme.textTertiary} />
                        </View>
                    </Card>
                ))}
            </View>
        </ScrollView>
    );
}
