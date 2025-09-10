import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../contexts/ThemeContext';
import { useStats } from '../contexts/StatsContext';
import { useLang } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { Card } from '../components/Card';
import { QUIZZESBYTOPIC } from '../constants/content';
import { recordQuizResult } from '../utils/storage';
import { globalStyles as styles } from '../constants/styles';

export default function QuizScreen() {
    const { theme } = useTheme();
    const { refreshStats } = useStats();
    const { lang } = useLang();
    const { scaleFont } = useAccessibility();
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const selectTopic = useCallback((topicId) => {
        const topic = QUIZZESBYTOPIC[topicId];
        setQuestions(topic.questions);
        setSelectedTopic(topic);
        setCurrentQ(0);
        setScore(0);
        setShowResult(false);
    }, []);

    const handleAnswer = useCallback(async (selectedIdx) => {
        const isCorrect = selectedIdx === questions[currentQ].answerIndex;
        const newScore = score + (isCorrect ? 1 : 0);
        setScore(newScore);

        if (currentQ + 1 >= questions.length) {
            await recordQuizResult({
                topic: selectedTopic.title[lang],
                totalQuestions: questions.length,
                score: newScore,
                percentage: (newScore / questions.length) * 100,
            });
            await refreshStats();
            setShowResult(true);
        } else {
            setCurrentQ(q => q + 1);
        }
    }, [currentQ, questions, score, selectedTopic, lang, refreshStats]);

    const resetQuiz = useCallback(() => {
        setSelectedTopic(null);
    }, []);

    if (showResult) {
        const percentage = (score / questions.length) * 100;
        return (
            <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}><MaterialIcons name="quiz" size={32} color={theme.success} /><Text style={[styles.sectionTitle, { color: theme.text }]}>Quiz Complete!</Text></View>
                    <Card>
                        <View style={styles.scoreHeader}>
                            <MaterialIcons name={percentage === 100 ? 'military-tech' : 'school'} size={48} color={theme.success} />
                            <Text style={[styles.cardTitle, { color: theme.text }]}>Your Score: {score}/{questions.length}</Text>
                        </View>
                        <Text style={[styles.scoreText, { color: theme.success }]}>{percentage === 100 ? 'Perfect!' : 'Good job!'}</Text>
                        <Pressable onPress={resetQuiz} style={[styles.primaryButton, { backgroundColor: theme.primary }]}>
                            <MaterialIcons name="refresh" size={20} color="#ffffff" />
                            <Text style={styles.primaryButtonText}>Choose Another Topic</Text>
                        </Pressable>
                    </Card>
                </View>
            </ScrollView>
        );
    }

    if (!selectedTopic) {
        return (
            <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}><MaterialIcons name="quiz" size={32} color={theme.purple} /><Text style={[styles.sectionTitle, { color: theme.text }]}>Choose a Quiz Topic</Text></View>
                    {Object.keys(QUIZZESBYTOPIC).map(topicId => {
                        const topic = QUIZZESBYTOPIC[topicId];
                        return (
                            <Card key={topicId} onPress={() => selectTopic(topicId)}>
                                <View style={styles.drillCard}>
                                    <View style={[styles.drillIconContainer, { backgroundColor: `${theme.primary}15` }]}><topic.IconComponent name={topic.iconName} size={28} color={theme.primary} /></View>
                                    <View style={styles.drillContent}>
                                        <Text style={[styles.drillTitle, { color: theme.text }]}>{topic.title[lang]}</Text>
                                        <Text style={[styles.drillSummary, { color: theme.textSecondary }]}>A {topic.questions.length}-question quiz on {topic.title.en}.</Text>
                                    </View>
                                    <MaterialIcons name="arrow-forward-ios" size={24} color={theme.textTertiary} />
                                </View>
                            </Card>
                        );
                    })}
                </View>
            </ScrollView>
        );
    }
    
    const question = questions[currentQ];
    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <selectedTopic.IconComponent name={selectedTopic.iconName} size={32} color={theme.purple} />
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>{selectedTopic.title[lang]}</Text>
                </View>
                <Card>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>Question {currentQ + 1}/{questions.length}</Text>
                    <Text style={[styles.questionText, { color: theme.text }]}>{question.q[lang]}</Text>
                    {question.options[lang].map((option, idx) => (
                        <Pressable key={idx} onPress={() => handleAnswer(idx)} style={[styles.optionButton, { backgroundColor: `${theme.primary}10`, borderColor: theme.primary }]}>
                            <Text style={[styles.optionText, { color: theme.primary }]}>{option}</Text>
                        </Pressable>
                    ))}
                </Card>
            </View>
        </ScrollView>
    );
}
