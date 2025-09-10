import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { 
  View, Text, Pressable, Alert, ScrollView, StyleSheet, Dimensions, Modal, 
  Switch, AccessibilityInfo, Linking, SafeAreaView 
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import { getPreparednessStats, recordDrillResult, recordQuizResult, seedDemoData, saveSetting, getSetting } from './utils/storage';
import { getContent, getDetailedContent, HAZARDS, QUIZZES_BY_TOPIC, SAFETY_TIPS, EMERGENCY_KIT_GAME, LANG, strings } from './data/content';
import { fetchAllLiveAlerts, setupAlertPolling } from './services/alerts';
import { scheduleLocalNotification } from './services/notifications';
import { useStats, StatsProvider } from './contexts/StatsContext';

const { width } = Dimensions.get('window');

const INDIA_STATES_UTS = [
  "All India", "Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", 
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowAlert: true,
  }),
});

const Drawer = createDrawerNavigator();

// --- THEME ---
const lightTheme = {
  background: '#f2f2f7', cardBackground: '#ffffff', text: '#000000',
  textSecondary: '#6d6d6d', textTertiary: '#999999', primary: '#007aff',
  secondary: '#5856d6', success: '#34c759', warning: '#ff9500',
  error: '#ff3b30', info: '#5ac8fa', purple: '#af52de', orange: '#ff9500',
  cardShadow: 'rgba(0,0,0,0.04)', drawerBg: '#ffffff', headerBg: 'rgba(248,248,248,0.94)',
  separator: '#c6c6c8'
};
const darkTheme = {
  background: '#000000', cardBackground: '#1c1c1e', text: '#ffffff',
  textSecondary: '#ebebf5', textTertiary: '#8e8e93', primary: '#0a84ff',
  secondary: '#5e5ce6', success: '#30d158', warning: '#ff9f0a',
  error: '#ff453a', info: '#64d2ff', purple: '#bf5af2', orange: '#ff9f0a',
  cardShadow: 'rgba(255,255,255,0.04)', drawerBg: '#1c1c1e', headerBg: 'rgba(28,28,30,0.94)',
  separator: '#38383a'
};
const highContrastLightTheme = { ...lightTheme, background: '#ffffff', text: '#000000', textSecondary: '#000000', cardBackground: '#ffffff', separator: '#000000', primary: '#0000ff', error: '#d40000' };
const highContrastDarkTheme = { ...darkTheme, background: '#000000', text: '#ffffff', textSecondary: '#ffffff', cardBackground: '#000000', separator: '#ffffff', primary: '#ffff00', success: '#00ff00' };

const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  
  useEffect(() => {
    getSetting('darkTheme').then(v => setIsDark(v || false));
    getSetting('highContrast').then(v => setHighContrast(v || false));
  }, []);
  
  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newTheme = !prev;
      saveSetting('darkTheme', newTheme);
      return newTheme;
    });
  }, []);

  const toggleHighContrast = useCallback((value) => {
    setHighContrast(value);
    saveSetting('highContrast', value);
  }, []);
  
  const theme = highContrast ? (isDark ? highContrastDarkTheme : highContrastLightTheme) : (isDark ? darkTheme : lightTheme);
  
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, highContrast, toggleHighContrast }}>
      {children}
    </ThemeContext.Provider>
  );
}

// --- ACCESSIBILITY ---
const AccessibilityContext = createContext();
const useAccessibility = () => useContext(AccessibilityContext);

function AccessibilityProvider({ children }) {
  const [largeText, setLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    getSetting('largeText').then(v => setLargeText(v || false));
    getSetting('reduceMotion').then(v => setReduceMotion(v || false));
  }, []);

  const toggleLargeText = useCallback((value) => {
    setLargeText(value);
    saveSetting('largeText', value);
  }, []);

  const toggleReduceMotion = useCallback((value) => {
    setReduceMotion(value);
    saveSetting('reduceMotion', value);
  }, []);

  const scaleFont = useCallback((size) => (largeText ? size * 1.2 : size), [largeText]);

  const value = { largeText, reduceMotion, toggleLargeText, toggleReduceMotion, scaleFont };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// --- LANGUAGE ---
const LangContext = createContext();
const useLang = () => useContext(LangContext);

function LangProvider({ children }) {
  const [lang, setLang] = useState(LANG.EN);

  useEffect(() => {
    getSetting('lang').then(v => setLang(v || LANG.EN));
  }, []);

  const switchLang = useCallback((newLang) => {
    setLang(newLang);
    saveSetting('lang', newLang);
  }, []);

  return (
    <LangContext.Provider value={{ lang, switchLang, strings: strings[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

// --- UI COMPONENTS ---
function Card({ children, style = {}, onPress = null }) {
  const { theme } = useTheme();
  const Component = onPress ? Pressable : View;
  return (
    <Component onPress={onPress} style={[styles.card, { backgroundColor: theme.cardBackground, shadowColor: theme.cardShadow }, style]}>
      {children}
    </Component>
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

// --- SCREENS ---
function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { stats } = useStats();
  const { lang, strings } = useLang();
  const { scaleFont } = useAccessibility();
  const [safetyTip, setSafetyTip] = useState(() => SAFETY_TIPS[Math.floor(Math.random() * SAFETY_TIPS.length)]);

  const getNewTip = useCallback(() => {
    setSafetyTip(SAFETY_TIPS[Math.floor(Math.random() * SAFETY_TIPS.length)]);
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
          <View style={styles.cardHeader}><MaterialIcons name="rocket-launch" size={24} color={theme.secondary} /><Text style={[styles.cardTitle, { color: theme.text, fontSize: scaleFont(20) }]}>{strings.quickActions}</Text></View>
          <View style={styles.actionGrid}>
            <ActionButton title={strings.startDrill} onPress={() => navigation.navigate('Drills')} color={theme.error} iconName="alarm-light" IconComponent={MaterialCommunityIcons}/>
            <ActionButton title={strings.takeQuiz} onPress={() => navigation.navigate('Quiz')} color={theme.purple} iconName="quiz"/>
            <ActionButton title="Emergency" onPress={() => navigation.navigate('Directory')} color={theme.error} iconName="emergency"/>
            <ActionButton title="Alerts" onPress={() => navigation.navigate('Alerts')} color={theme.warning} iconName="warning"/>
          </View>
        </Card>

        <Card>
          <View style={styles.cardHeader}><MaterialIcons name="lightbulb" size={24} color={theme.orange} /><Text style={[styles.cardTitle, { color: theme.text, fontSize: scaleFont(20) }]}>Safety Tip</Text></View>
          <Text style={[styles.safetyTipText, { color: theme.textSecondary, marginBottom: 16, fontSize: scaleFont(15) }]}>{safetyTip[lang]}</Text>
          <Pressable onPress={getNewTip} style={[styles.secondaryButton, { backgroundColor: theme.primary + '15' }]}><MaterialIcons name="refresh" size={20} color={theme.primary} /><Text style={[styles.secondaryButtonText, { color: theme.primary, fontSize: scaleFont(14) }]}>Get a New Tip</Text></Pressable>
        </Card>
      </View>
    </ScrollView>
  );
}

function LearnScreen() {
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
          <View style={styles.sectionHeader}><MaterialIcons name="school" size={32} color={theme.primary} /><Text style={[styles.sectionTitle, { color: theme.text, fontSize: scaleFont(28) }]}>{strings.learnModules}</Text></View>
          {content.map((item) => (
            <Card key={item.id} onPress={() => openDetail(item)}>
              <View style={styles.learnCard}>
                <View style={[styles.learnIcon, { backgroundColor: theme.primary + '15' }]}><item.IconComponent name={item.iconName} size={28} color={theme.primary} /></View>
                <View style={styles.learnContent}>
                  <Text style={[styles.learnTitle, { color: theme.text, fontSize: scaleFont(17) }]}>{item.title}</Text>
                  <Text style={[styles.learnSummary, { color: theme.textSecondary, fontSize: scaleFont(14) }]}>{item.body}</Text>
                  <View style={styles.readMoreRow}><Text style={[styles.readMore, { color: theme.primary, fontSize: scaleFont(14) }]}>Tap to learn more</Text><MaterialIcons name="arrow-forward-ios" size={14} color={theme.primary} /></View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
      <Modal visible={showDetail} animationType={reduceMotion ? "fade" : "slide"} presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.separator }]}>
            <Pressable onPress={() => setShowDetail(false)} style={styles.backButton}><MaterialIcons name="arrow-back" size={24} color={theme.primary} /><Text style={[styles.backText, { color: theme.primary }]}>Back</Text></Pressable>
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

function DrillsScreen() {
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
      await recordDrillResult({ hazard: currentDrill.id, score: 100, time: Date.now() });
      await refreshStats();
      const completionMessage = 'Drill Complete! Great job! You\'re now better prepared.';
      Alert.alert('🎉 Drill Complete!', completionMessage);
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
          <View style={styles.sectionHeader}><currentDrill.IconComponent name={currentDrill.iconName} size={32} color={theme.error} /><Text style={[styles.sectionTitle, { color: theme.text, fontSize: scaleFont(28) }]}>{currentDrill.title[lang]}</Text></View>
          <Card>
            <Text style={[styles.cardTitle, { color: theme.text, fontSize: scaleFont(20) }]}>Step {step + 1} of {currentDrill.steps.length}</Text>
            <Text style={[styles.drillInstruction, { color: theme.textSecondary, fontSize: scaleFont(16) }]}>{currentStep.instruction}</Text>
            <Pressable onPress={nextStep} style={[styles.primaryButton, { backgroundColor: theme.success }]}>
              <MaterialIcons name={step + 1 >= currentDrill.steps.length ? "check-circle" : "arrow-forward"} size={20} color="#ffffff" />
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
        <View style={styles.sectionHeader}><MaterialCommunityIcons name="alarm-light" size={32} color={theme.error} /><Text style={[styles.sectionTitle, { color: theme.text, fontSize: scaleFont(28) }]}>{strings.startDrill}</Text></View>
        {HAZARDS.map((hazard) => (
          <Card key={hazard.id} onPress={() => startDrill(hazard)}>
            <View style={styles.drillCard}>
              <View style={[styles.drillIconContainer, { backgroundColor: hazard.color + '15' }]}><hazard.IconComponent name={hazard.iconName} size={28} color={hazard.color} /></View>
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

function QuizScreen() {
  const { theme } = useTheme();
  const { refreshStats } = useStats();
  const { lang } = useLang();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const selectTopic = useCallback((topicId) => {
    const topic = QUIZZES_BY_TOPIC[topicId];
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
      await recordQuizResult({ topic: selectedTopic.title[lang], totalQuestions: questions.length, score: newScore, percentage: (newScore / questions.length) * 100 });
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
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}><MaterialIcons name="quiz" size={32} color={theme.success} /><Text style={[styles.sectionTitle, { color: theme.text }]}>Quiz Complete!</Text></View>
          <Card>
            <View style={styles.scoreHeader}>
              <MaterialIcons name={score === questions.length ? "military-tech" : "school"} size={48} color={theme.success} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>Your Score: {score}/{questions.length}</Text>
            </View>
            <Text style={[styles.scoreText, { color: theme.success }]}>{score === questions.length ? '🏆 Perfect!' : '👍 Good job!'}</Text>
            <Pressable onPress={resetQuiz} style={[styles.primaryButton, { backgroundColor: theme.primary }]}><MaterialIcons name="refresh" size={20} color="#ffffff" /><Text style={styles.primaryButtonText}>Choose Another Topic</Text></Pressable>
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
          {Object.keys(QUIZZES_BY_TOPIC).map((topicId) => {
            const topic = QUIZZES_BY_TOPIC[topicId];
            return (
              <Card key={topicId} onPress={() => selectTopic(topicId)}>
                <View style={styles.drillCard}>
                  <View style={[styles.drillIconContainer, { backgroundColor: theme.primary + '15' }]}><topic.IconComponent name={topic.iconName} size={28} color={theme.primary} /></View>
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
        <View style={styles.sectionHeader}><selectedTopic.IconComponent name={selectedTopic.iconName} size={32} color={theme.purple} /><Text style={[styles.sectionTitle, { color: theme.text }]}>{selectedTopic.title[lang]}</Text></View>
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

function AdminScreen() {
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
    Alert.alert('Region Updated', `Weather alerts will now be filtered for ${region}`);
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}><MaterialIcons name="admin-panel-settings" size={32} color={theme.primary} /><Text style={[styles.sectionTitle, { color: theme.text, fontSize: scaleFont(28) }]}>Admin Settings</Text></View>
        
        <Card>
          <View style={styles.cardHeader}><MaterialIcons name="trending-up" size={24} color={theme.primary} /><Text style={[styles.cardTitle, { color: theme.text, fontSize: scaleFont(20) }]}>School Statistics</Text></View>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}><Text style={[styles.statBoxValue, { color: theme.primary }]}>{Math.round(stats.completion)}%</Text><Text style={[styles.statBoxLabel, { color: theme.textSecondary }]}>Completion</Text></View>
            <View style={styles.statBox}><Text style={[styles.statBoxValue, { color: theme.success }]}>{Math.round(stats.avgScore)}%</Text><Text style={[styles.statBoxLabel, { color: theme.textSecondary }]}>Avg Score</Text></View>
            <View style={styles.statBox}><Text style={[styles.statBoxValue, { color: theme.warning }]}>{stats.drills}</Text><Text style={[styles.statBoxLabel, { color: theme.textSecondary }]}>Drills</Text></View>
          </View>
        </Card>

        <Card>
          <View style={styles.cardHeader}><MaterialIcons name="accessibility" size={24} color={theme.success} /><Text style={[styles.cardTitle, { color: theme.text, fontSize: scaleFont(20) }]}>Accessibility</Text></View>
          <View style={styles.settingItem}><View style={styles.settingLeft}><MaterialIcons name="motion-photos-off" size={24} color={theme.textSecondary} /><View style={styles.settingTextContainer}><Text style={[styles.settingTitle, { color: theme.text, fontSize: scaleFont(16) }]}>Reduce Motion</Text></View></View><Switch value={reduceMotion} onValueChange={toggleReduceMotion} /></View>
          <View style={styles.settingItem}><View style={styles.settingLeft}><MaterialIcons name="contrast" size={24} color={theme.textSecondary} /><View style={styles.settingTextContainer}><Text style={[styles.settingTitle, { color: theme.text, fontSize: scaleFont(16) }]}>High Contrast</Text></View></View><Switch value={highContrast} onValueChange={toggleHighContrast} /></View>
          <View style={styles.settingItem}><View style={styles.settingLeft}><MaterialIcons name="format-size" size={24} color={theme.textSecondary} /><View style={styles.settingTextContainer}><Text style={[styles.settingTitle, { color: theme.text, fontSize: scaleFont(16) }]}>Large Text</Text></View></View><Switch value={largeText} onValueChange={toggleLargeText} /></View>
        </Card>

        <Card>
          <View style={styles.cardHeader}><MaterialIcons name="location-on" size={24} color={theme.warning} /><Text style={[styles.cardTitle, { color: theme.text, fontSize: scaleFont(20) }]}>Region & Alerts</Text></View>
          <View style={styles.pickerContainer}>
            <Text style={[styles.pickerLabel, { color: theme.text, fontSize: scaleFont(14) }]}>Select region for weather alerts:</Text>
            <View style={[styles.pickerWrapper, { borderColor: theme.separator }]}>
              <Picker selectedValue={selectedRegion} onValueChange={handleRegionChange} style={[styles.picker, { color: theme.text }]} dropdownIconColor={theme.text}>
                {INDIA_STATES_UTS.map(state => <Picker.Item key={state} label={state} value={state} />)}
              </Picker>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

function DirectoryScreen() {
  const { theme } = useTheme();
  const { scaleFont } = useAccessibility();

  const emergencyContacts = [
    { name: 'Police', number: '100', icon: 'local-police' },
    { name: 'Fire', number: '101', icon: 'fire-truck', iconComponent: MaterialIcons },
    { name: 'Ambulance', number: '102', icon: 'ambulance', iconComponent: MaterialCommunityIcons },
    { name: 'National Disaster Helpline', number: '1078', icon: 'support' },
    { name: 'Women Helpline', number: '1091', icon: 'woman' },
  ];

  const handlePress = (number) => {
    Linking.openURL(`tel:${number}`).catch(err => Alert.alert("Failed to open dialer", err.toString()));
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
          <Text style={[styles.emergencyButtonText, { fontSize: scaleFont(22) }]}>Call National Emergency Helpline: 112</Text>
        </Pressable>

        {emergencyContacts.map((contact) => {
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

function AlertsScreen() {
  const { theme } = useTheme();
  const { scaleFont } = useAccessibility();
  const [allAlerts, setAllAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All India');

  const loadData = useCallback(async () => {
    if (!loading) setLoading(true); // Show loading indicator on manual refresh
    try {
      const region = await getSetting('selectedRegion');
      const currentRegion = region || 'All India';
      setSelectedRegion(currentRegion);

      const liveAlerts = await fetchAllLiveAlerts();
      setAllAlerts(liveAlerts);

      if (currentRegion === 'All India') {
        setFilteredAlerts(liveAlerts);
      } else {
        const regionFiltered = liveAlerts.filter(alert => 
          alert.area.toLowerCase().includes(currentRegion.toLowerCase())
        );
        setFilteredAlerts(regionFiltered);
      }

    } catch (error) {
      console.error("Failed to fetch or filter alerts:", error);
      setAllAlerts([]);
      setFilteredAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [loading]);
  
  useEffect(() => {
    loadData();
    
    const cleanupPolling = setupAlertPolling((polledAlerts) => {
      setAllAlerts(polledAlerts); // Update the master list on poll
    }, 5);

    return cleanupPolling;
  }, []);

  // This effect re-filters the alerts when the master list is updated by polling
  useEffect(() => {
    if (selectedRegion === 'All India') {
      setFilteredAlerts(allAlerts);
    } else {
      const regionFiltered = allAlerts.filter(alert => 
        alert.area.toLowerCase().includes(selectedRegion.toLowerCase())
      );
      setFilteredAlerts(regionFiltered);
    }
  }, [allAlerts, selectedRegion]);


  const getSeverityColor = (severity) => {
    const s = severity?.toLowerCase();
    if (s === 'high' || s === 'severe') return theme.error;
    if (s === 'moderate') return theme.warning;
    return theme.info;
  };

  const normalizeSeverity = (severity) => {
    const s = severity?.toLowerCase();
    if (s === 'high' || s === 'severe') return 'Severe';
    if (s === 'moderate') return 'Moderate';
    return 'Info';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="warning" size={32} color={theme.warning} />
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: scaleFont(28) }]}>Live Alerts</Text>
          <Pressable onPress={loadData} style={styles.refreshButton} disabled={loading}>
            <MaterialIcons name="refresh" size={28} color={loading ? theme.textTertiary : theme.primary} />
          </Pressable>
        </View>
        <Text style={{color: theme.textSecondary, fontSize: scaleFont(14), textAlign: 'center', marginBottom: 16, marginTop: -16}}>Showing alerts for: {selectedRegion}</Text>
        {loading ? (
          <Text style={{ color: theme.text, textAlign: 'center', fontSize: scaleFont(16) }}>Loading public alerts...</Text>
        ) : filteredAlerts.length === 0 ? (
          <Card><Text style={{ color: theme.text, textAlign: 'center', fontSize: scaleFont(16) }}>No active alerts found for {selectedRegion}.</Text></Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} style={{ borderColor: getSeverityColor(alert.severity), borderLeftWidth: 4 }}>
              <View style={styles.alertHeader}>
                <Text style={[styles.alertTitle, { color: theme.text, fontSize: scaleFont(18) }]}>{alert.title}</Text>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(alert.severity) }]}><Text style={styles.severityText}>{normalizeSeverity(alert.severity)}</Text></View>
              </View>
              <Text style={[styles.alertArea, { color: theme.textSecondary, fontSize: scaleFont(14) }]}>Area: {alert.area}</Text>
              <Text style={[styles.alertDescription, { color: theme.text, fontSize: scaleFont(15) }]}>{alert.summary}</Text>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}


// --- APP CONTAINER & NAVIGATION ---
function CustomDrawerContent(props) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { lang, switchLang } = useLang();
  
  const toggleLanguage = useCallback(() => {
    const newLang = lang === LANG.EN ? LANG.HI : LANG.EN;
    switchLang(newLang);
  }, [lang, switchLang]);

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: theme.drawerBg }} contentContainerStyle={{ paddingTop: 0 }}>
      <View style={[styles.drawerHeader, { backgroundColor: theme.primary }]}><MaterialCommunityIcons name="shield-check" size={40} color="#ffffff" /><Text style={styles.drawerHeaderTitle}>Disaster Prep</Text><Text style={styles.drawerHeaderSubtitle}>Stay Safe, Stay Prepared</Text></View>
      <View style={styles.drawerSection}><DrawerItemList {...props} /></View>
      <View style={[styles.drawerSection, { borderTopWidth: 1, borderTopColor: theme.separator }]}>
        <Text style={[styles.sectionLabel, { color: theme.textTertiary }]}>PREFERENCES</Text>
        <DrawerItem 
          label={`Theme: ${isDark ? 'Dark' : 'Light'}`} 
          onPress={toggleTheme} 
          icon={({size}) => <MaterialIcons name={isDark?"dark-mode":"light-mode"} size={size} color={theme.textSecondary}/>} 
          labelStyle={{color:theme.text}}
        />
        <DrawerItem 
          label={`Language: ${lang === LANG.EN ? 'English' : 'हिंदी'}`} 
          onPress={toggleLanguage} 
          icon={({size}) => <MaterialIcons name="translate" size={size} color={theme.textSecondary}/>} 
          labelStyle={{color:theme.text}}
        />
      </View>
    </DrawerContentScrollView>
  );
}

function MainApp() {
  const { theme } = useTheme();
  const { reduceMotion } = useAccessibility();

  useEffect(() => {
    seedDemoData();
    (async () => {
      if (Device.isDevice) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') await Notifications.requestPermissionsAsync();
      }
    })();
  }, []);

  const screenOptions = {
    headerStyle: { backgroundColor: theme.headerBg },
    headerTintColor: theme.text,
    drawerActiveTintColor: theme.primary,
    drawerInactiveTintColor: theme.textSecondary,
    drawerStyle: { backgroundColor: theme.drawerBg },
    animation: reduceMotion ? 'none' : 'default',
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Drawer.Navigator drawerContent={CustomDrawerContent} screenOptions={screenOptions}>
            <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard', drawerIcon: ({c,s})=><MaterialIcons name="home" size={s} color={c}/>}}/>
            <Drawer.Screen name="Learn" component={LearnScreen} options={{ title: 'Learning Modules', drawerIcon: ({c,s})=><MaterialIcons name="school" size={s} color={c}/>}}/>
            <Drawer.Screen name="Drills" component={DrillsScreen} options={{ title: 'Safety Drills', drawerIcon: ({c,s})=><MaterialCommunityIcons name="alarm-light" size={s} color={c}/>}}/>
            <Drawer.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz & Test', drawerIcon: ({c,s})=><MaterialIcons name="quiz" size={s} color={c}/>}}/>
            <Drawer.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Live Alerts', drawerIcon: ({c,s})=><MaterialIcons name="warning" size={s} color={c}/>}}/>
            <Drawer.Screen name="Directory" component={DirectoryScreen} options={{ title: 'Emergency Directory', drawerIcon: ({c,s})=><MaterialIcons name="contact-phone" size={s} color={c}/>}}/>
            <Drawer.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin Settings', drawerIcon: ({c,s})=><MaterialIcons name="admin-panel-settings" size={s} color={c}/>}}/>
          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StatsProvider>
        <LangProvider>
          <AccessibilityProvider>
            <MainApp />
          </AccessibilityProvider>
        </LangProvider>
      </StatsProvider>
    </ThemeProvider>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { padding: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 },
  sectionTitle: { fontSize: 28, fontWeight: '700' },
  refreshButton: { marginLeft: 'auto', padding: 8 },
  card: { borderRadius: 12, padding: 20, marginBottom: 16, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 1, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  cardTitle: { fontSize: 20, fontWeight: '600' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '700' },
  statLabel: { fontSize: 13, marginTop: 4 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { alignItems: 'center', flex: 1 },
  statBoxValue: { fontSize: 24, fontWeight: '700' },
  statBoxLabel: { fontSize: 12, marginTop: 4 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 8 },
  actionButton: { width: '48%', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  buttonText: { fontWeight: '600', fontSize: 13 },
  learnCard: { flexDirection: 'row', alignItems: 'center' },
  learnIcon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  learnContent: { flex: 1 },
  learnTitle: { fontSize: 17, fontWeight: '600', marginBottom: 4 },
  learnSummary: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  readMoreRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  readMore: { fontSize: 14, fontWeight: '500' },
  modalContainer: { flex: 1 },
  modalHeader: { padding: 16, borderBottomWidth: 0.5, alignItems: 'flex-start' },
  backButton: { paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { fontSize: 16, fontWeight: '500' },
  modalContent: { flex: 1, padding: 20 },
  modalTitle: { fontSize: 28, fontWeight: '700', marginBottom: 24 },
  sectionSubtitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  sectionText: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  stepsList: { marginTop: 8 },
  stepItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  stepNumber: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2 },
  stepNumberText: { color: '#ffffff', fontWeight: '600', fontSize: 12 },
  stepText: { flex: 1, fontSize: 15, lineHeight: 22 },
  drillCard: { flexDirection: 'row', alignItems: 'center' },
  drillIconContainer: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  drillContent: { flex: 1 },
  drillTitle: { fontSize: 17, fontWeight: '600', marginBottom: 4 },
  drillSummary: { fontSize: 14, lineHeight: 20 },
  drillInstruction: { fontSize: 16, lineHeight: 24, marginBottom: 20 },
  primaryButton: { padding: 16, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 16 },
  secondaryButton: { padding: 12, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  secondaryButtonText: { fontWeight: '600', fontSize: 14 },
  questionText: { fontSize: 17, lineHeight: 24, marginBottom: 20 },
  optionButton: { padding: 16, borderRadius: 8, marginBottom: 12, borderWidth: 1 },
  optionText: { fontWeight: '500', fontSize: 15 },
  scoreHeader: { alignItems: 'center', marginBottom: 16 },
  scoreText: { fontSize: 20, textAlign: 'center', marginVertical: 16, fontWeight: '600' },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 16 },
  settingTextContainer: { flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '600' },
  pickerContainer: { marginTop: 8 },
  pickerLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  pickerWrapper: { marginBottom: 8, overflow: 'hidden', borderWidth: 1, borderRadius: 8 },
  picker: { height: 50, width: '100%' },
  drawerHeader: { padding: 24, alignItems: 'center' },
  drawerHeaderTitle: { color: '#ffffff', fontSize: 20, fontWeight: '700', marginTop: 12 },
  drawerHeaderSubtitle: { color: '#ffffff', fontSize: 14, opacity: 0.8, marginTop: 4 },
  drawerSection: { paddingVertical: 12 },
  sectionLabel: { fontSize: 12, fontWeight: '600', marginLeft: 16, marginBottom: 8, letterSpacing: 1 },
  safetyTipText: { flex: 1, fontSize: 15, lineHeight: 22 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 18, fontWeight: '600' },
  contactNumber: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  callButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  emergencyButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, borderRadius: 12, marginBottom: 24, gap: 16 },
  emergencyButtonText: { color: '#ffffff', fontWeight: 'bold', textAlign: 'center' },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  alertTitle: { fontSize: 18, fontWeight: '700', flex: 1 },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 8 },
  severityText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  alertArea: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  alertDescription: { fontSize: 15, lineHeight: 22 },
});
