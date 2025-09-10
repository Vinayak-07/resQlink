import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { EMERGENCYKITGAME } from '../constants/content';
import { globalStyles } from '../constants/styles';

// Basic component to represent a draggable item
const DraggableItem = ({ item }) => {
    const { theme } = useTheme();
    return (
        <View style={[localStyles.item, { backgroundColor: theme.cardBackground, borderColor: theme.separator }]}>
            <MaterialCommunityIcons name={item.icon} size={24} color={theme.primary} />
            <Text style={{ color: theme.text, flex: 1, marginLeft: 12 }}>{item.name['en']}</Text>
        </View>
    );
};

export default function GoBagPackerScreen({ navigation }) {
    const { theme } = useTheme();
    const [unpackedItems, setUnpackedItems] = useState([]);
    const [packedItems, setPackedItems] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30); // 30-second timer

    // Initialize game on load
    useEffect(() => {
        // Shuffle items for variety
        setUnpackedItems(EMERGENCYKITGAME.items.sort(() => Math.random() - 0.5));
    }, []);

    // Timer logic
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            // Game over logic here
        }
    }, [timeLeft]);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
            <View style={globalStyles.section}>
                <View style={globalStyles.sectionHeader}>
                    <MaterialCommunityIcons name="briefcase-check" size={32} color={theme.primary} />
                    <Text style={[globalStyles.sectionTitle, { color: theme.text }]}>Go-Bag Packer</Text>
                </View>
                <View style={localStyles.timerContainer}>
                    <Text style={[localStyles.timerText, { color: theme.error }]}>Time Left: {timeLeft}s</Text>
                </View>

                {/* This is a simplified view. True drag-and-drop requires more setup. */}
                <Text style={[globalStyles.cardTitle, { color: theme.text, marginBottom: 10 }]}>Items to Pack:</Text>
                <View style={localStyles.itemArea}>
                    {unpackedItems.map(item => <DraggableItem key={item.name.en} item={item} />)}
                </View>

                <View style={[localStyles.backpack, { borderColor: theme.primary, backgroundColor: `${theme.primary}10` }]}>
                    <MaterialCommunityIcons name="backpack" size={60} color={theme.primary} style={{ opacity: 0.5 }} />
                    <Text style={{ color: theme.primary, marginTop: 10, fontWeight: 'bold' }}>DRAG ITEMS HERE</Text>
                </View>

            </View>
        </ScrollView>
    );
}

const localStyles = StyleSheet.create({
    timerContainer: { alignItems: 'center', marginVertical: 10 },
    timerText: { fontSize: 24, fontWeight: 'bold' },
    itemArea: {
        marginBottom: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    item: {
        width: '48%',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    backpack: {
        height: 200,
        borderWidth: 2,
        borderRadius: 20,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});

