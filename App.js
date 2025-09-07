import React, { useEffect, useState, createContext, useContext } from 'react';
import { View, Text, Pressable, Alert, ScrollView, StyleSheet, Dimensions, Modal, Switch, AccessibilityInfo, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import { getPreparednessStats, recordDrillResult, recordQuizResult, seedDemoData, saveSetting, getSetting } from './utils/storage';
import { getContent, getDetailedContent } from './data/content';
import { fetchIMDWarnings, fetchCAPAlerts, fetchAllLiveAlerts, setupAlertPolling } from './services/alerts';
import { scheduleLocalNotification } from './services/notifications';
import { HAZARDS, QUIZZES, LANG, strings, QUIZZES_BY_TOPIC, SAFETY_TIPS, EMERGENCY_KIT_GAME } from './data/content';

const { width } = Dimensions.get('window');

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowAlert: true,
  }),
});

const Drawer = createDrawerNavigator();

// Stats Context
const StatsContext = createContext();

function StatsProvider({ children }) {
  const [stats, setStats] = useState({ completion: 0, avgScore: 0, drills: 0 });

  const refreshStats = async () => {
    try {
      const newStats = await getPreparednessStats();
      setStats(newStats);
    } catch (error) {
      console.log('Stats refresh error:', error);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  return (
    <StatsContext.Provider value={{ stats, refreshStats }}>
      {children}
    </StatsContext.Provider>
  );
}

const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within StatsProvider');
  }
  return context;
};

// Apple-like Theme System
const lightTheme = {
  background: '#f2f2f7',
  cardBackground: '#ffffff',
  text: '#000000',
  textSecondary: '#6d6d6d',
  textTertiary: '#999999',
  primary: '#007aff',
  secondary: '#5856d6',
  success: '#34c759',
  warning: '#ff9500',
  error: '#ff3b30',
  info: '#5ac8fa',
  purple: '#af52de',
  pink: '#ff2d92',
  teal: '#5ac8fa',
  orange: '#ff9500',
  cardShadow: 'rgba(0,0,0,0.04)',
  drawerBg: '#ffffff',
  headerBg: 'rgba(248,248,248,0.94)',
  modalBg: 'rgba(0,0,0,0.4)',
  separator: '#c6c6c8'
};

const darkTheme = {
  background: '#000000',
  cardBackground: '#1c1c1e',
  text: '#ffffff',
  textSecondary: '#ebebf5',
  textTertiary: '#8e8e93',
  primary: '#0a84ff',
  secondary: '#5e5ce6',
  success: '#30d158',
  warning: '#ff9f0a',
  error: '#ff453a',
  info: '#64d2ff',
  purple: '#bf5af2',
  pink: '#ff375f',
  teal: '#6ac4dc',
  orange: '#ff9f0a',
  cardShadow: 'rgba(255,255,255,0.04)',
  drawerBg: '#1c1c1e',
  headerBg: 'rgba(28,28,30,0.94)',
  modalBg: 'rgba(0,0,0,0.7)',
  separator: '#38383a'
};

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    getSetting('darkTheme').then(saved => {
      if (saved !== null) setIsDark(saved);
    });
  }, []);
  
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    saveSetting('darkTheme', newTheme);
  };
  
  const theme = isDark ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const useTheme = () => useContext(ThemeContext);

function Card({ children, style = {}, onPress = null }) {
  const { theme } = useTheme();
  
  const CardComponent = onPress ? Pressable : View;
  
  return (
    <CardComponent 
      onPress={onPress}
      style={[
        styles.card, 
        { 
          backgroundColor: theme.cardBackground,
          shadowColor: theme.cardShadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 1,
          shadowRadius: 4,
          elevation: 2
        }, 
        style
      ]}
    >
      {children}
    </CardComponent>
  );
}

function ActionButton({ title, onPress, color, iconName, IconComponent = MaterialIcons }) {
  return (
    <Pressable onPress={onPress} style={[styles.actionButton, { backgroundColor: color }]}>
      <IconComponent name={iconName} size={24} color="#ffffff" />
      <Text style={[styles.buttonText, { color: '#ffffff' }]}>{title}</Text>
    </Pressable>
  );
}

// Helper functions for alerts
function getSeverityIcon(severity) {
  switch (severity?.toLowerCase()) {
    case 'high': case 'severe': return 'error';
    case 'moderate': case 'medium': return 'warning';
    case 'low': case 'minor': return 'info';
    default: return 'notifications';
  }
}

function getSeverityColor(severity, theme) {
  switch (severity?.toLowerCase()) {
    case 'high': case 'severe': return theme.error;
    case 'moderate': case 'medium': return theme.warning;
    case 'low': case 'minor': return theme.info;
    default: return theme.primary;
  }
}

function formatTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString();
}

// Custom Drawer Content
function CustomDrawerContent(props) {
  const { theme, isDark, toggleTheme } = useTheme();
  const [lang, setLang] = useState(LANG.EN);
  
  useEffect(() => {
    getSetting('lang').then(v => setLang(v || LANG.EN));
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === LANG.EN ? LANG.HI : LANG.EN;
    setLang(newLang);
    saveSetting('lang', newLang);
  };

  return (
    <DrawerContentScrollView 
      {...props} 
      style={{ backgroundColor: theme.drawerBg }}
      contentContainerStyle={{ paddingTop: 0 }}
    >
      {/* Header Section */}
      <View style={[styles.drawerHeader, { backgroundColor: theme.primary }]}>
        <MaterialCommunityIcons name="shield-check" size={40} color="#ffffff" />
        <Text style={styles.drawerHeaderTitle}>Disaster Prep</Text>
        <Text style={styles.drawerHeaderSubtitle}>Stay Safe, Stay Prepared</Text>
      </View>

      {/* Main Navigation */}
      <View style={styles.drawerSection}>
        <DrawerItemList {...props} />
      </View>

      {/* Utility Section */}
      <View style={[styles.drawerSection, { borderTopWidth: 1, borderTopColor: theme.separator }]}>
        <Text style={[styles.sectionLabel, { color: theme.textTertiary }]}>PREFERENCES</Text>
        
        <DrawerItem
          label={`Theme: ${isDark ? 'Dark' : 'Light'}`}
          onPress={toggleTheme}
          icon={({ color, size }) => (
            <MaterialIcons 
              name={isDark ? "dark-mode" : "light-mode"} 
              size={size} 
              color={color} 
            />
          )}
          labelStyle={{ color: theme.text }}
          activeTintColor={theme.primary}
        />
        
        <DrawerItem
          label={`Language: ${lang === LANG.EN ? 'English' : 'हिंदी'}`}
          onPress={toggleLanguage}
          icon={({ color, size }) => (
            <MaterialIcons name="translate" size={size} color={color} />
          )}
          labelStyle={{ color: theme.text }}
          activeTintColor={theme.primary}
        />
        
        <DrawerItem
          label="Test Notification"
          onPress={() => scheduleLocalNotification(strings[lang])}
          icon={({ color, size }) => (
            <MaterialIcons name="notifications" size={size} color={color} />
          )}
          labelStyle={{ color: theme.text }}
          activeTintColor={theme.primary}
        />
      </View>

      {/* Footer */}
      <View style={[styles.drawerFooter, { borderTopWidth: 1, borderTopColor: theme.separator }]}>
        <Text style={[styles.footerText, { color: theme.textTertiary }]}>
          School Disaster Preparedness v1.0{'\n'}
          Government of Punjab
        </Text>
      </View>
    </DrawerContentScrollView>
  );
}

function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { stats } = useStats();
  const [lang, setLang] = useState(LANG.EN);
  const [safetyTip, setSafetyTip] = useState(null);

  useEffect(() => {
    getSetting('lang').then(v => setLang(v || LANG.EN));
    // Set an initial random tip
    setSafetyTip(SAFETY_TIPS[Math.floor(Math.random() * SAFETY_TIPS.length)]);
  }, []);

  const getNewTip = () => {
    setSafetyTip(SAFETY_TIPS[Math.floor(Math.random() * SAFETY_TIPS.length)]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="shield-check" size={32} color={theme.primary} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{strings[lang].appTitle}</Text>
        </View>
        
        <Card>
          <View style={styles.cardHeader}>
            <MaterialIcons name="analytics" size={24} color={theme.primary} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>{strings[lang].preparednessScore}</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>{Math.round(stats.completion)}%</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{strings[lang].completion}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.success }]}>{Math.round(stats.avgScore)}%</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{strings[lang].avgScore}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.warning }]}>{stats.drills}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{strings[lang].drillsDone}</Text>
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.cardHeader}>
            <MaterialIcons name="rocket-launch" size={24} color={theme.secondary} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>{strings[lang].quickActions}</Text>
          </View>
          <View style={styles.actionGrid}>
            <ActionButton 
              title={strings[lang].startDrill} 
              onPress={() => navigation.navigate('Drills')}
              color={theme.error}
              iconName="alarm-light"
              IconComponent={MaterialCommunityIcons}
            />
            <ActionButton 
              title={strings[lang].takeQuiz} 
              onPress={() => navigation.navigate('Quiz')}
              color={theme.purple}
              iconName="quiz"
              IconComponent={MaterialIcons}
            />
            <ActionButton 
              title="Emergency"
              onPress={() => navigation.navigate('Directory')}
              color={theme.error}
              iconName="emergency"
              IconComponent={MaterialIcons}
            />
            <ActionButton 
              title="Alerts"
              onPress={() => navigation.navigate('Alerts')}
              color={theme.warning}
              iconName="warning"
              IconComponent={MaterialIcons}
            />
          </View>
        </Card>

        {/* Safety Tip of the Day */}
        {safetyTip && (
          <Card>
            <View style={styles.cardHeader}>
              <MaterialIcons name="lightbulb" size={24} color={theme.orange} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>Safety Tip</Text>
            </View>
            <Text style={[styles.safetyTipText, { color: theme.textSecondary, marginBottom: 16 }]}>{safetyTip[lang]}</Text>
            <Pressable onPress={getNewTip} style={[styles.secondaryButton, { backgroundColor: theme.primary + '15' }]}>
              <MaterialIcons name="refresh" size={20} color={theme.primary} />
              <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Get a New Tip</Text>
            </Pressable>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

function LearnScreen() {
  const { theme } = useTheme();
  const [lang, setLang] = useState(LANG.EN);
  const [content, setContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  
  useEffect(() => { 
    getSetting('lang').then(v => {
      const L = v || LANG.EN;
      setLang(L);
      setContent(getContent(L));
    });
  }, []);
  
  const openDetail = (item) => {
    setSelectedContent(getDetailedContent(item.id, lang));
    setShowDetail(true);
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="school" size={32} color={theme.primary} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{strings[lang].learnModules}</Text>
        </View>
        
        {content.map((item, idx) => (
          <Card key={item.id} onPress={() => openDetail(item)}>
            <View style={styles.learnCard}>
              <View style={[styles.learnIcon, { backgroundColor: theme.primary + '15' }]}>
                <item.IconComponent name={item.iconName} size={28} color={theme.primary} />
              </View>
              <View style={styles.learnContent}>
                <Text style={[styles.learnTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.learnSummary, { color: theme.textSecondary }]}>{item.body}</Text>
                <View style={styles.readMoreRow}>
                  <Text style={[styles.readMore, { color: theme.primary }]}>Tap to learn more</Text>
                  <MaterialIcons name="arrow-forward-ios" size={14} color={theme.primary} />
                </View>
              </View>
            </View>
          </Card>
        ))}
        
        <Modal
          visible={showDetail}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.separator }]}>
              <Pressable onPress={() => setShowDetail(false)} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
                <Text style={[styles.backText, { color: theme.primary }]}>Back</Text>
              </Pressable>
            </View>
            
            {selectedContent && (
              <ScrollView style={styles.modalContent}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedContent.title}</Text>
                
                {selectedContent.sections.map((section, idx) => (
                  <Card key={idx}>
                    <Text style={[styles.sectionSubtitle, { color: theme.text }]}>{section.subtitle}</Text>
                    <Text style={[styles.sectionText, { color: theme.textSecondary }]}>{section.content}</Text>
                    {section.steps && (
                      <View style={styles.stepsList}>
                        {section.steps.map((step, stepIdx) => (
                          <View key={stepIdx} style={styles.stepItem}>
                            <View style={[styles.stepNumber, { backgroundColor: theme.primary }]}>
                              <Text style={styles.stepNumberText}>{stepIdx + 1}</Text>
                            </View>
                            <Text style={[styles.stepText, { color: theme.text }]}>{step}</Text>
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
      </View>
    </ScrollView>
  );
}

function DrillsScreen() {
  const { theme } = useTheme();
  const { refreshStats } = useStats();
  const [lang, setLang] = useState(LANG.EN);
  const [currentDrill, setCurrentDrill] = useState(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    getSetting('lang').then(v => setLang(v || LANG.EN));
  }, []);

  const startDrill = (hazard) => {
    setCurrentDrill(hazard);
    setStep(0);
  };

  const nextStep = async () => {
    if (step + 1 >= currentDrill.steps.length) {
      // Save drill result
      await recordDrillResult({ hazard: currentDrill.id, score: 100, time: Date.now() });
      
      // Refresh stats immediately
      await refreshStats();
      
      Alert.alert('🎉 Drill Complete!', 'Great job! You\'re now better prepared.');
      setCurrentDrill(null);
      return;
    }
    setStep(step + 1);
  };

  if (currentDrill) {
    const currentStep = currentDrill.steps[step][lang];
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <currentDrill.IconComponent name={currentDrill.iconName} size={32} color={theme.error} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{currentDrill.title[lang]}</Text>
          </View>
          <Card>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Step {step + 1} of {currentDrill.steps.length}</Text>
            <Text style={[styles.drillInstruction, { color: theme.textSecondary }]}>{currentStep.instruction}</Text>
            <Pressable onPress={nextStep} style={[styles.primaryButton, { backgroundColor: theme.success }]}>
              <MaterialIcons 
                name={step + 1 >= currentDrill.steps.length ? "check-circle" : "arrow-forward"} 
                size={20} 
                color="#ffffff" 
              />
              <Text style={styles.primaryButtonText}>
                {step + 1 >= currentDrill.steps.length ? 'Complete' : 'Next Step'}
              </Text>
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
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{strings[lang].startDrill}</Text>
        </View>
        {HAZARDS.map((hazard, idx) => (
          <Card key={hazard.id} onPress={() => startDrill(hazard)}>
            <View style={styles.drillCard}>
              <View style={[styles.drillIconContainer, { backgroundColor: hazard.color + '15' }]}>
                <hazard.IconComponent name={hazard.iconName} size={28} color={hazard.color} />
              </View>
              <View style={styles.drillContent}>
                <Text style={[styles.drillTitle, { color: theme.text }]}>{hazard.title[lang]}</Text>
                <Text style={[styles.drillSummary, { color: theme.textSecondary }]}>{hazard.summary[lang]}</Text>
              </View>
              <MaterialIcons name="play-arrow" size={24} color={theme.textTertiary} />
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

function QuizScreen() {
  const { theme } = useTheme();
  const { refreshStats } = useStats();
  const [lang, setLang] = useState(LANG.EN);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    getSetting('lang').then(v => setLang(v || LANG.EN));
  }, []);

  const selectTopic = (topicId) => {
    const topic = QUIZZES_BY_TOPIC[topicId];
    setQuestions(topic.questions);
    setSelectedTopic(topic);
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
  };

  const handleAnswer = async (selectedIdx) => {
    const isCorrect = selectedIdx === questions[currentQ].answerIndex;
    const newScore = score + (isCorrect ? 1 : 0);
    setScore(newScore);

    if (currentQ + 1 >= questions.length) {
      // Save quiz result
      const finalScore = newScore;
      await recordQuizResult({ 
        topic: selectedTopic.title[lang],
        totalQuestions: questions.length, 
        score: finalScore,
        percentage: (finalScore / questions.length) * 100 
      });
      
      // Refresh stats immediately
      await refreshStats();
      
      setShowResult(true);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const resetQuiz = () => {
    setSelectedTopic(null);
    setQuestions([]);
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="quiz" size={32} color={theme.success} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Quiz Complete!</Text>
          </View>
          <Card>
            <View style={styles.scoreHeader}>
              <MaterialIcons 
                name={score === questions.length ? "military-tech" : score >= questions.length / 2 ? "thumb-up" : "school"} 
                size={48} 
                color={theme.success} 
              />
              <Text style={[styles.cardTitle, { color: theme.text }]}>Your Score: {score}/{questions.length}</Text>
            </View>
            <Text style={[styles.scoreText, { color: theme.success }]}>
              {score === questions.length ? '🏆 Perfect!' : score >= questions.length / 2 ? '👍 Good job!' : '📚 Keep learning!'}
            </Text>
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
          <View style={styles.sectionHeader}>
            <MaterialIcons name="quiz" size={32} color={theme.purple} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Choose a Quiz Topic</Text>
          </View>
          {Object.keys(QUIZZES_BY_TOPIC).map((topicId) => {
            const topic = QUIZZES_BY_TOPIC[topicId];
            return (
              <Card key={topicId} onPress={() => selectTopic(topicId)}>
                <View style={styles.drillCard}>
                  <View style={[styles.drillIconContainer, { backgroundColor: theme.primary + '15' }]}>
                    <topic.IconComponent name={topic.iconName} size={28} color={theme.primary} />
                  </View>
                  <View style={styles.drillContent}>
                    <Text style={[styles.drillTitle, { color: theme.text }]}>{topic.title[lang]}</Text>
                    <Text style={[styles.drillSummary, { color: theme.textSecondary }]}>
                      A {topic.questions.length}-question quiz on {topic.title.en}.
                    </Text>
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
            <Pressable key={idx} onPress={() => handleAnswer(idx)} style={[styles.optionButton, { backgroundColor: theme.primary + '10', borderColor: theme.primary }]}>
              <Text style={[styles.optionText, { color: theme.primary }]}>{option}</Text>
            </Pressable>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
}

function AlertsScreen() {
  const { theme } = useTheme();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true);
      try {
        const liveAlerts = await fetchAllLiveAlerts('Punjab');
        setAlerts(liveAlerts || []); // Ensure it's always an array
        setLastUpdated(new Date());
      } catch (error) {
        console.log('Failed to load alerts:', error);
        setAlerts([]); // Empty array instead of demo alerts
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    loadAlerts();

    // Set up auto-refresh every 5 minutes
    const cleanup = setupAlertPolling((newAlerts) => {
      setAlerts(newAlerts || []); // Ensure it's always an array
      setLastUpdated(new Date());
    }, 5);

    return cleanup;
  }, []);

  const refreshAlerts = async () => {
    setLoading(true);
    const liveAlerts = await fetchAllLiveAlerts('Punjab');
    setAlerts(liveAlerts || []); // Ensure it's always an array
    setLastUpdated(new Date());
    setLoading(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="warning" size={32} color={theme.warning} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Live Alerts</Text>
        </View>

        {/* Status Card */}
        <Card>
          <View style={styles.statusRow}>
            <View style={styles.statusLeft}>
              <MaterialIcons 
                name={loading ? "sync" : "check-circle"} 
                size={20} 
                color={loading ? theme.warning : theme.success} 
              />
              <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                {loading ? 'Checking for alerts...' : `Last checked ${lastUpdated ? formatTime(lastUpdated) : 'now'}`}
              </Text>
            </View>
            <Pressable onPress={refreshAlerts} style={[styles.refreshButton, { backgroundColor: theme.primary + '15' }]}>
              <MaterialIcons name="refresh" size={20} color={theme.primary} />
            </Pressable>
          </View>
        </Card>

        {/* Active Alerts */}
        {alerts.length > 0 && alerts.map((alert, idx) => (
          <Card key={alert.id || idx}>
            <View style={styles.alertHeader}>
              <MaterialIcons 
                name={getSeverityIcon(alert.severity)} 
                size={24} 
                color={getSeverityColor(alert.severity, theme)} 
              />
              <Text style={[styles.alertTitle, { color: getSeverityColor(alert.severity, theme) }]}>
                {alert.title}
              </Text>
            </View>
            <Text style={[styles.alertBody, { color: theme.textSecondary }]}>{alert.summary}</Text>
            {alert.source && (
              <Text style={[styles.alertSource, { color: theme.textTertiary }]}>
                Source: {alert.source}
              </Text>
            )}
          </Card>
        ))}

        {/* No Alerts - All Clear Message */}
        {alerts.length === 0 && !loading && (
          <Card>
            <View style={styles.noAlertsContainer}>
              <MaterialIcons name="check-circle" size={64} color={theme.success} />
              <Text style={[styles.noAlertsTitle, { color: theme.text }]}>All Clear! 🌟</Text>
              <Text style={[styles.noAlertsText, { color: theme.textSecondary }]}>
                No active disaster alerts in your area right now. Your region is safe and secure.
              </Text>
              <View style={[styles.safetyTip, { backgroundColor: theme.success + '10' }]}>
                <MaterialIcons name="lightbulb" size={20} color={theme.success} />
                <Text style={[styles.safetyTipText, { color: theme.textSecondary }]}>
                  Stay prepared! Complete drills and learning modules to be ready for any situation.
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Loading State */}
        {loading && alerts.length === 0 && (
          <Card>
            <View style={styles.loadingContainer}>
              <MaterialIcons name="sync" size={48} color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.text }]}>Checking for alerts...</Text>
              <Text style={[styles.loadingSubtext, { color: theme.textSecondary }]}>
                Fetching latest information from IMD and NDMA
              </Text>
            </View>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

function DirectoryScreen() {
  const { theme } = useTheme();
  const contacts = [
    { name: 'NDMA Control Room', phone: '+91-11-26701728', IconComponent: MaterialIcons, iconName: 'government', color: theme.primary },
    { name: 'Fire & Emergency', phone: '101', IconComponent: MaterialCommunityIcons, iconName: 'fire-truck', color: theme.error },
    { name: 'Ambulance', phone: '108', IconComponent: MaterialIcons, iconName: 'local-hospital', color: theme.success },
    { name: 'Police', phone: '100', IconComponent: MaterialIcons, iconName: 'local-police', color: theme.info }
  ];

  const copyToClipboard = async (phone, name) => {
    try {
      await Clipboard.setStringAsync(phone);
      Alert.alert(
        '📋 Copied to Clipboard', 
        `${name} phone number ${phone} has been copied to your clipboard.`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to copy phone number');
    }
  };

  const makeEmergencyCall = () => {
    const phoneNumber = 'tel:112';
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Error', 'Cannot make phone calls from this device');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => {
        Alert.alert('Error', 'Failed to initiate call');
      });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="contact-phone" size={32} color={theme.error} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Emergency Directory</Text>
        </View>
        
        {contacts.map((contact, idx) => (
          <Card key={idx}>
            <View style={styles.contactRow}>
              <View style={[styles.contactIconContainer, { backgroundColor: contact.color + '15' }]}>
                <contact.IconComponent name={contact.iconName} size={28} color={contact.color} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactName, { color: theme.text }]}>{contact.name}</Text>
                <Text style={[styles.contactPhone, { color: contact.color }]}>{contact.phone}</Text>
              </View>
              <Pressable 
                onPress={() => copyToClipboard(contact.phone, contact.name)}
                style={[styles.copyButton, { backgroundColor: contact.color + '10' }]}
              >
                <MaterialIcons name="content-copy" size={24} color={contact.color} />
              </Pressable>
            </View>
          </Card>
        ))}
        
        <Card>
          <View style={styles.helpSection}>
            <MaterialIcons name="info" size={24} color={theme.info} />
            <Text style={[styles.helpText, { color: theme.textSecondary }]}>
              Tap the copy icon next to any number to copy it to your clipboard, then paste it in your phone's dialer app.
            </Text>
          </View>
        </Card>

        {/* BIG RED EMERGENCY CALL BUTTON */}
        <View style={styles.emergencyCallContainer}>
          <Pressable 
            onPress={makeEmergencyCall}
            style={[styles.emergencyCallButton, {
              shadowColor: theme.error,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8
            }]}
            accessibilityRole="button"
            accessibilityLabel="Emergency Call 112"
          >
            <MaterialIcons name="call" size={32} color="#ffffff" />
            <Text style={styles.emergencyCallText}>EMERGENCY CALL 112</Text>
          </Pressable>
          <Text style={[styles.emergencyCallSubtext, { color: theme.textTertiary }]}>
            Tap to call the universal emergency number
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function GameScreen() {
  const { theme } = useTheme();
  const [lang, setLang] = useState(LANG.EN);
  const [shuffledItems, setShuffledItems] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [packedItems, setPackedItems] = useState([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    getSetting('lang').then(v => setLang(v || LANG.EN));
    startGame();
  }, []);

  const startGame = () => {
    setShuffledItems([...EMERGENCY_KIT_GAME.items].sort(() => Math.random() - 0.5));
    setCurrentItemIndex(0);
    setScore(0);
    setPackedItems([]);
    setShowResult(false);
  };

  const handleChoice = (choseToPack) => {
    const item = shuffledItems[currentItemIndex];
    const correctChoice = (choseToPack && item.isEssential) || (!choseToPack && !item.isEssential);

    if (correctChoice) {
      setScore(prev => prev + 1);
    }
    
    if (choseToPack) {
      setPackedItems(prev => [...prev, item]);
    }

    if (currentItemIndex + 1 >= shuffledItems.length) {
      setShowResult(true);
    } else {
      setCurrentItemIndex(prev => prev + 1);
    }
  };

  if (showResult) {
    const correctPacked = packedItems.filter(i => i.isEssential);
    const incorrectPacked = packedItems.filter(i => !i.isEssential);

    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="gamepad-variant" size={32} color={theme.success} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Game Over!</Text>
          </View>
          <Card>
            <View style={styles.scoreHeader}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Your Score: {score}/{shuffledItems.length}</Text>
            </View>
            <Text style={[styles.scoreText, { color: theme.success, fontSize: 18 }]}>
              You packed {correctPacked.length} essential items correctly!
            </Text>

            {correctPacked.length > 0 && (
              <View style={styles.gameResultSection}>
                <Text style={[styles.gameResultTitle, { color: theme.success }]}>Correctly Packed:</Text>
                {correctPacked.map((item, idx) => (
                  <View key={idx} style={styles.gameResultItem}>
                    <MaterialCommunityIcons name={item.icon} size={20} color={theme.success} />
                    <Text style={[styles.gameResultItemText, { color: theme.text }]}>{item.name[lang]}</Text>
                  </View>
                ))}
              </View>
            )}

            {incorrectPacked.length > 0 && (
              <View style={styles.gameResultSection}>
                <Text style={[styles.gameResultTitle, { color: theme.error }]}>Mistakes:</Text>
                {incorrectPacked.map((item, idx) => (
                  <View key={idx} style={styles.gameResultItem}>
                    <MaterialCommunityIcons name={item.icon} size={20} color={theme.error} />
                    <Text style={[styles.gameResultItemText, { color: theme.text }]}>{item.name[lang]} (Not essential)</Text>
                  </View>
                ))}
              </View>
            )}

            <Pressable onPress={startGame} style={[styles.primaryButton, { backgroundColor: theme.primary, marginTop: 16 }]}>
              <MaterialIcons name="refresh" size={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Play Again</Text>
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    );
  }

  if (shuffledItems.length === 0) return null;

  const currentItem = shuffledItems[currentItemIndex];
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="gamepad-variant" size={32} color={theme.secondary} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{EMERGENCY_KIT_GAME.title[lang]}</Text>
        </View>
        <Card>
          <Text style={[styles.cardTitle, { color: theme.text, textAlign: 'center', marginBottom: 24 }]}>
            Item {currentItemIndex + 1} of {shuffledItems.length}
          </Text>
          <View style={styles.gameItemContainer}>
            <MaterialCommunityIcons name={currentItem.icon} size={80} color={theme.primary} />
            <Text style={[styles.gameItemName, { color: theme.text }]}>{currentItem.name[lang]}</Text>
            <Text style={[styles.gameQuestion, { color: theme.textSecondary }]}>Should this go in your emergency kit?</Text>
          </View>
          <View style={styles.gameActions}>
            <Pressable onPress={() => handleChoice(true)} style={[styles.gameButton, { backgroundColor: theme.success }]}>
              <MaterialIcons name="check" size={24} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Pack It</Text>
            </Pressable>
            <Pressable onPress={() => handleChoice(false)} style={[styles.gameButton, { backgroundColor: theme.error }]}>
              <MaterialIcons name="close" size={24} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Leave It</Text>
            </Pressable>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

function AdminScreen() {
  const { theme } = useTheme();
  const { stats } = useStats();
  const [lang, setLang] = useState(LANG.EN);
  
  // Accessibility Settings
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [voiceAnnouncements, setVoiceAnnouncements] = useState(true);
  
  // Region Settings
  const [selectedRegion, setSelectedRegion] = useState('Punjab');
  
  const regions = [
    { label: 'Punjab', value: 'Punjab' },
    { label: 'Delhi', value: 'Delhi' },
    { label: 'Maharashtra', value: 'Maharashtra' },
    { label: 'Karnataka', value: 'Karnataka' },
    { label: 'Tamil Nadu', value: 'Tamil Nadu' },
    { label: 'West Bengal', value: 'West Bengal' },
    { label: 'Gujarat', value: 'Gujarat' },
    { label: 'Rajasthan', value: 'Rajasthan' },
    { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
    { label: 'Bihar', value: 'Bihar' }
  ];

  useEffect(() => {
    // Load settings
    getSetting('lang').then(v => setLang(v || LANG.EN));
    getSetting('screenReaderEnabled').then(v => setScreenReaderEnabled(v || false));
    getSetting('reduceMotion').then(v => setReduceMotion(v || false));
    getSetting('highContrast').then(v => setHighContrast(v || false));
    getSetting('largeText').then(v => setLargeText(v || false));
    getSetting('voiceAnnouncements').then(v => setVoiceAnnouncements(v !== false));
    getSetting('selectedRegion').then(v => setSelectedRegion(v || 'Punjab'));
    
    // Check system accessibility settings
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled);
  }, []);

  const toggleScreenReader = async (value) => {
    setScreenReaderEnabled(value);
    await saveSetting('screenReaderEnabled', value);
    if (value) {
      Alert.alert('Screen Reader Enabled', 'Screen reader support is now active for improved accessibility.');
    }
  };

  const toggleReduceMotion = async (value) => {
    setReduceMotion(value);
    await saveSetting('reduceMotion', value);
  };

  const toggleHighContrast = async (value) => {
    setHighContrast(value);
    await saveSetting('highContrast', value);
  };

  const toggleLargeText = async (value) => {
    setLargeText(value);
    await saveSetting('largeText', value);
  };

  const toggleVoiceAnnouncements = async (value) => {
    setVoiceAnnouncements(value);
    await saveSetting('voiceAnnouncements', value);
  };

  const handleRegionChange = async (region) => {
    setSelectedRegion(region);
    await saveSetting('selectedRegion', region);
    Alert.alert('Region Updated', `Weather alerts will now show for ${region}`);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="admin-panel-settings" size={32} color={theme.primary} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Admin Settings</Text>
        </View>
        
        {/* Stats Overview */}
        <Card>
          <View style={styles.cardHeader}>
            <MaterialIcons name="trending-up" size={24} color={theme.primary} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>School Statistics</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={[styles.statBoxValue, { color: theme.primary }]}>{Math.round(stats.completion)}%</Text>
              <Text style={[styles.statBoxLabel, { color: theme.textSecondary }]}>Completion</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statBoxValue, { color: theme.success }]}>{Math.round(stats.avgScore)}%</Text>
              <Text style={[styles.statBoxLabel, { color: theme.textSecondary }]}>Avg Score</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statBoxValue, { color: theme.warning }]}>{stats.drills}</Text>
              <Text style={[styles.statBoxLabel, { color: theme.textSecondary }]}>Drills</Text>
            </View>
          </View>
        </Card>

        {/* Accessibility Settings */}
        <Card>
          <View style={styles.cardHeader}>
            <MaterialIcons name="accessibility" size={24} color={theme.success} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Accessibility Settings</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="visibility" size={24} color={theme.textSecondary} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>Screen Reader Support</Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Enhanced support for VoiceOver and TalkBack
                </Text>
              </View>
            </View>
            <Switch
              value={screenReaderEnabled}
              onValueChange={toggleScreenReader}
              trackColor={{ false: theme.separator, true: theme.success + '60' }}
              thumbColor={screenReaderEnabled ? theme.success : theme.textTertiary}
              accessibilityRole="switch"
              accessibilityLabel="Toggle screen reader support"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="motion-photos-off" size={24} color={theme.textSecondary} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>Reduce Motion</Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Minimize animations and transitions
                </Text>
              </View>
            </View>
            <Switch
              value={reduceMotion}
              onValueChange={toggleReduceMotion}
              trackColor={{ false: theme.separator, true: theme.info + '60' }}
              thumbColor={reduceMotion ? theme.info : theme.textTertiary}
              accessibilityRole="switch"
              accessibilityLabel="Toggle reduce motion"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="contrast" size={24} color={theme.textSecondary} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>High Contrast</Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Increase contrast for better visibility
                </Text>
              </View>
            </View>
            <Switch
              value={highContrast}
              onValueChange={toggleHighContrast}
              trackColor={{ false: theme.separator, true: theme.warning + '60' }}
              thumbColor={highContrast ? theme.warning : theme.textTertiary}
              accessibilityRole="switch"
              accessibilityLabel="Toggle high contrast mode"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="format-size" size={24} color={theme.textSecondary} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>Large Text</Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Increase text size for better readability
                </Text>
              </View>
            </View>
            <Switch
              value={largeText}
              onValueChange={toggleLargeText}
              trackColor={{ false: theme.separator, true: theme.purple + '60' }}
              thumbColor={largeText ? theme.purple : theme.textTertiary}
              accessibilityRole="switch"
              accessibilityLabel="Toggle large text"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="record-voice-over" size={24} color={theme.textSecondary} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>Voice Announcements</Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Audio feedback for important actions
                </Text>
              </View>
            </View>
            <Switch
              value={voiceAnnouncements}
              onValueChange={toggleVoiceAnnouncements}
              trackColor={{ false: theme.separator, true: theme.secondary + '60' }}
              thumbColor={voiceAnnouncements ? theme.secondary : theme.textTertiary}
              accessibilityRole="switch"
              accessibilityLabel="Toggle voice announcements"
            />
          </View>
        </Card>

        {/* Region Settings */}
        <Card>
          <View style={styles.cardHeader}>
            <MaterialIcons name="location-on" size={24} color={theme.warning} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Region & Alerts</Text>
          </View>
          
          <View style={styles.pickerContainer}>
            <Text style={[styles.pickerLabel, { color: theme.text }]}>
              Select your region for weather alerts:
            </Text>
            <View style={[styles.pickerWrapper, { 
              backgroundColor: theme.cardBackground, 
              borderColor: theme.separator,
              borderWidth: 2,
              borderRadius: 8
            }]}>
              <Picker
                selectedValue={selectedRegion}
                onValueChange={handleRegionChange}
                style={[styles.picker, { 
                  color: theme.text,
                  backgroundColor: theme.cardBackground 
                }]}
                dropdownIconColor={theme.text}
                mode="dropdown"
                accessibilityLabel="Select region for weather alerts"
              >
                {regions.map((region) => (
                  <Picker.Item
                    key={region.value}
                    label={region.label}
                    value={region.value}
                    color={theme.text}
                    style={{ backgroundColor: theme.cardBackground }}
                  />
                ))}
              </Picker>
            </View>
            <Text style={[styles.pickerHint, { color: theme.textTertiary }]}>
              Alerts will be filtered for {selectedRegion} region
            </Text>
          </View>
        </Card>

        {/* System Info */}
        <Card>
          <View style={styles.cardHeader}>
            <MaterialIcons name="info" size={24} color={theme.info} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>System Information</Text>
          </View>
          <View style={styles.systemInfo}>
            <Text style={[styles.systemInfoText, { color: theme.textSecondary }]}>
              App Version: 1.0.0{'\n'}
              Platform: {Device.osName} {Device.osVersion}{'\n'}
              Device: {Device.deviceName || 'Unknown Device'}{'\n'}
              Region: {selectedRegion}{'\n'}
              Language: {lang === LANG.EN ? 'English' : 'हिंदी'}
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StatsProvider>
        <MainApp />
      </StatsProvider>
    </ThemeProvider>
  );
}

function MainApp() {
  const { theme } = useTheme();

  useEffect(() => {
    seedDemoData();
    
    (async () => {
      if (Device.isDevice) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          await Notifications.requestPermissionsAsync();
        }
      }
    })();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Drawer.Navigator
            drawerContent={CustomDrawerContent}
            screenOptions={{
              headerStyle: { backgroundColor: theme.headerBg },
              headerTintColor: theme.text,
              headerTitleStyle: { fontWeight: '600' },
              drawerActiveTintColor: theme.primary,
              drawerInactiveTintColor: theme.textSecondary,
              drawerStyle: { backgroundColor: theme.drawerBg }
            }}
          >
            <Drawer.Screen 
              name="Home" 
              component={HomeScreen}
              options={{
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="home" size={size} color={color} />
                ),
                title: 'Dashboard'
              }}
            />
            <Drawer.Screen 
              name="Learn" 
              component={LearnScreen}
              options={{
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="school" size={size} color={color} />
                ),
                title: 'Learning Modules'
              }}
            />
            <Drawer.Screen 
              name="Drills" 
              component={DrillsScreen}
              options={{
                drawerIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="alarm-light" size={size} color={color} />
                ),
                title: 'Safety Drills'
              }}
            />
            <Drawer.Screen 
              name="Quiz" 
              component={QuizScreen}
              options={{
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="quiz" size={size} color={color} />
                ),
                title: 'Quiz & Test'
              }}
            />
            <Drawer.Screen 
              name="Games" 
              component={GameScreen}
              options={{
                drawerIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="gamepad-variant" size={size} color={color} />
                ),
                title: 'Safety Games'
              }}
            />
            <Drawer.Screen 
              name="Alerts" 
              component={AlertsScreen}
              options={{
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="warning" size={size} color={color} />
                ),
                title: 'Live Alerts'
              }}
            />
            <Drawer.Screen 
              name="Directory" 
              component={DirectoryScreen}
              options={{
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="contact-phone" size={size} color={color} />
                ),
                title: 'Emergency Contacts'
              }}
            />
            <Drawer.Screen 
              name="Admin" 
              component={AdminScreen}
              options={{
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="admin-panel-settings" size={size} color={color} />
                ),
                title: 'Admin Settings'
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  section: {
    padding: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700'
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600'
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700'
  },
  statLabel: {
    fontSize: 13,
    marginTop: 4
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statBox: {
    alignItems: 'center',
    flex: 1
  },
  statBoxValue: {
    fontSize: 24,
    fontWeight: '700'
  },
  statBoxLabel: {
    fontSize: 12,
    marginTop: 4
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8
  },
  actionButton: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 13
  },
  learnCard: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  learnIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  learnContent: {
    flex: 1
  },
  learnTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4
  },
  learnSummary: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  readMore: {
    fontSize: 14,
    fontWeight: '500'
  },
  modalContainer: {
    flex: 1
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 0.5,
    alignItems: 'flex-start'
  },
  backButton: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  backText: {
    fontSize: 16,
    fontWeight: '500'
  },
  modalContent: {
    flex: 1,
    padding: 20
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16
  },
  stepsList: {
    marginTop: 8
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2
  },
  stepNumberText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22
  },
  drillCard: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  drillIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  drillContent: {
    flex: 1
  },
  drillTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4
  },
  drillSummary: {
    fontSize: 14,
    lineHeight: 20
  },
  drillInstruction: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20
  },
  primaryButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16
  },
  secondaryButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8
  },
  secondaryButtonText: {
    fontWeight: '600',
    fontSize: 14
  },
  questionText: {
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 20
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1
  },
  optionText: {
    fontWeight: '500',
    fontSize: 15
  },
  scoreHeader: {
    alignItems: 'center',
    marginBottom: 16
  },
  scoreText: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 16,
    fontWeight: '600'
  },
  // Game Styles
  gameItemContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  gameItemName: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  gameQuestion: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  gameActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '45%',
  },
  gameResultSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  gameResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  gameResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  gameResultItemText: {
    fontSize: 15,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  alertBody: {
    fontSize: 14,
    lineHeight: 20
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  contactInfo: {
    flex: 1
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  contactPhone: {
    fontSize: 18,
    fontWeight: '700'
  },
  copyButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  helpSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic'
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500'
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  alertSource: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic'
  },
  noAlertsContainer: {
    alignItems: 'center',
    paddingVertical: 24
  },
  noAlertsTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16
  },
  noAlertsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22
  },
  safetyTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8
  },
  safetyTipText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12
  },
  loadingSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4
  },
  // Admin/Settings Styles
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)'
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16
  },
  settingTextContainer: {
    flex: 1
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18
  },
  pickerContainer: {
    marginTop: 8
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12
  },
  pickerWrapper: {
    marginBottom: 8,
    overflow: 'hidden'
  },
  picker: {
    height: 50,
    width: '100%'
  },
  pickerHint: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4
  },
  systemInfo: {
    marginTop: 8
  },
  systemInfoText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'monospace'
  },
  // Emergency Call Button Styles
  emergencyCallContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24
  },
  emergencyCallButton: {
    backgroundColor: '#ff3b30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 50,
    minWidth: 280,
    gap: 12
  },
  emergencyCallText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1
  },
  emergencyCallSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic'
  },
  // Drawer Styles
  drawerHeader: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 0
  },
  drawerHeaderTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12
  },
  drawerHeaderSubtitle: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4
  },
  drawerSection: {
    paddingVertical: 16
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
    letterSpacing: 1
  },
  drawerFooter: {
    padding: 16,
    marginTop: 20
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18
  }
});
