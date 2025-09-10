import React from 'react';
import { ScrollView, View, Text, Pressable, Linking, Alert } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '../contexts/ThemeContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { Card } from '../components/Card';
import { globalStyles as styles } from '../constants/styles';

const emergencyContacts = [
    { name: 'Police', number: '100', icon: 'local-police', iconComponent: MaterialIcons },
    { name: 'Fire', number: '101', icon: 'fire-truck', iconComponent: MaterialCommunityIcons },
    { name: 'Ambulance', number: '102', icon: 'ambulance', iconComponent: MaterialCommunityIcons },
    { name: 'National Disaster Helpline', number: '1078', icon: 'support', iconComponent: MaterialIcons },
    { name: 'Women Helpline', number: '1091', icon: 'woman', iconComponent: MaterialCommunityIcons },
];

export default function DirectoryScreen() {
    const { theme } = useTheme();
    const { scaleFont } = useAccessibility();

    const handlePress = (number) => {
        Linking.openURL(`tel:${number}`).catch(err => Alert.alert('Failed to open dialer', err.toString()));
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="contact-phone" size={32} color={theme.primary} />
                    <Text style={[styles.sectionTitle, { color: theme.text, fontSize: scaleFont(28) }]}>Emergency Directory</Text>
                </View>

                <Pressable style={[styles.emergencyButton, { backgroundColor: theme.error }]} onPress={() => handlePress('112')}>
                    <MaterialIcons name="call" size={32} color="#ffffff" />
                    <Text style={[styles.emergencyButtonText, { fontSize: scaleFont(22) }]}>Call National Emergency Helpline (112)</Text>
                </Pressable>

                {emergencyContacts.map(contact => {
                    const IconComponent = contact.iconComponent || MaterialIcons;
                    return (
                        <Card key={contact.name}>
                            <View style={styles.contactRow}>
                                <IconComponent name={contact.icon} size={28} color={theme.primary} />
                                <View style={styles.contactInfo}>
                                    <Text style={[styles.contactName, { color: theme.text, fontSize: scaleFont(18) }]}>{contact.name}</Text>
                                    <Text style={[styles.contactNumber, { color: theme.primary, fontSize: scaleFont(16) }]}>{contact.number}</Text>
                                </View>
                                <Pressable onPress={() => handlePress(contact.number)} style={[styles.callButton, { backgroundColor: theme.success }]}>
                                    <MaterialIcons name="phone" size={24} color="#ffffff" />
                                </Pressable>
                            </View>
                        </Card>
                    );
                })}
            </View>
        </ScrollView>
    );
}
