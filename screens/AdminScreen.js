import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Switch, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../contexts/ThemeContext';
import { useStats } from '../contexts/StatsContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { getSetting, saveSetting } from '../utils/storage';
import { Card } from '../components/Card';
import { globalStyles as styles } from '../constants/styles';
import { INDIASTATESUTS } from '../constants/content';

export default function AdminScreen() {
    const { theme, highContrast, toggleHighContrast } = useTheme();
    const { stats } = useStats();
    const { largeText, reduceMotion, toggleLargeText, toggleReduceMotion, scaleFont } = useAccessibility();
    const [selectedRegion, setSelectedRegion] = useState('All India');

    useEffect(() => {
        getSetting('selectedRegion').then(v => setSelectedRegion(v || 'All India'));
    }, []);

    const handleRegionChange = useCallback(async (region) => {
        setSelectedRegion(region);
        await saveSetting('selectedRegion', region);
        Alert.alert('Region Updated', `Weather alerts will now be filtered for ${region}.`);
    }, []);
    
    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="admin-panel-settings" size={32} color={theme.primary} />
                    <Text style={[styles.sectionTitle, { color: theme.text, fontSize: scaleFont(28) }]}>Admin Settings</Text>
                </View>

                <Card>
                    <View style={styles.cardHeader}><MaterialIcons name="trending-up" size={24} color={theme.primary} /><Text style={[styles.cardTitle, { color: theme.text, fontSize: scaleFont(20) }]}>School Statistics</Text></View>
                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}><Text style={[styles.statBoxValue, { color: theme.primary }]}>{Math.round(stats.completion)}%</Text><Text style={[styles.statBoxLabel, { color: theme.textSecondary }]}>Completion</Text></View>
                        <View style={styles.statBox}><Text style={[styles.statBoxValue, { color: theme.success }]}>{Math.round(stats.avgScore)}%</Text><Text style={[styles.statBoxLabel, { color: theme.textSecondary }]}>Avg. Score</Text></View>
                        <View style={styles.statBox}><Text style={[styles.statBoxValue, { color: theme.warning }]}>{stats.drills}</Text><Text style={[styles.statBoxLabel, { color: theme.textSecondary }]}>Drills</Text></View>
                    </View>
                </Card>

                <Card>
                    <View style={styles.cardHeader}><MaterialIcons name="accessibility" size={24} color={theme.success} /><Text style={[styles.cardTitle, { color: theme.text, fontSize: scaleFont(20) }]}>Accessibility</Text></View>
                    <View style={[styles.settingItem, { borderBottomColor: theme.separator }]}><View style={styles.settingLeft}><MaterialIcons name="motion-photos-off" size={24} color={theme.textSecondary} /><Text style={[styles.settingTitle, { color: theme.text, fontSize: scaleFont(16) }]}>Reduce Motion</Text></View><Switch value={reduceMotion} onValueChange={toggleReduceMotion} /></View>
                    <View style={[styles.settingItem, { borderBottomColor: theme.separator }]}><View style={styles.settingLeft}><MaterialIcons name="contrast" size={24} color={theme.textSecondary} /><Text style={[styles.settingTitle, { color: theme.text, fontSize: scaleFont(16) }]}>High Contrast</Text></View><Switch value={highContrast} onValueChange={toggleHighContrast} /></View>
                    <View style={[styles.settingItem, { borderBottomWidth: 0 }]}><View style={styles.settingLeft}><MaterialIcons name="format-size" size={24} color={theme.textSecondary} /><Text style={[styles.settingTitle, { color: theme.text, fontSize: scaleFont(16) }]}>Large Text</Text></View><Switch value={largeText} onValueChange={toggleLargeText} /></View>
                </Card>
                
                <Card>
                    <View style={styles.cardHeader}><MaterialIcons name="location-on" size={24} color={theme.warning} /><Text style={[styles.cardTitle, { color: theme.text, fontSize: scaleFont(20) }]}>Region for Alerts</Text></View>
                    <View style={styles.pickerContainer}>
                        <Text style={[styles.pickerLabel, { color: theme.text, fontSize: scaleFont(14) }]}>Select region for weather alerts</Text>
                        <View style={[styles.pickerWrapper, { borderColor: theme.separator }]}>
                            <Picker selectedValue={selectedRegion} onValueChange={handleRegionChange} style={[styles.picker, { color: theme.text }]} dropdownIconColor={theme.text}>
                                {INDIASTATESUTS.map(state => <Picker.Item key={state} label={state} value={state} />)}
                            </Picker>
                        </View>
                    </View>
                </Card>
            </View>
        </ScrollView>
    );
}
