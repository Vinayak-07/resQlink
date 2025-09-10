import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  DRILL_RESULTS: 'DRILL_RESULTS',
  QUIZ_RESULTS: 'QUIZ_RESULTS',
  SETTINGS: 'SETTINGS',
  CONTENT_PROGRESS: 'CONTENT_PROGRESS'
};

export async function seedDemoData() {
  try {
    const hasData = await AsyncStorage.getItem(KEYS.DRILL_RESULTS);
    if (!hasData) {
      await AsyncStorage.setItem(KEYS.DRILL_RESULTS, JSON.stringify([]));
      await AsyncStorage.setItem(KEYS.QUIZ_RESULTS, JSON.stringify([]));
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify({}));
      await AsyncStorage.setItem(KEYS.CONTENT_PROGRESS, JSON.stringify({}));
    }
  } catch (error) {
    console.log('Storage seed error:', error);
  }
}

export async function recordDrillResult(result) {
  try {
    const raw = (await AsyncStorage.getItem(KEYS.DRILL_RESULTS)) || '[]';
    const results = JSON.parse(raw);
    results.push({ 
      ...result, 
      timestamp: Date.now(),
      id: 'drill_' + Date.now()
    });
    await AsyncStorage.setItem(KEYS.DRILL_RESULTS, JSON.stringify(results));
  } catch (error) {
    console.log('Drill result save error:', error);
  }
}
export async function recordQuizResult(result) {
  try {
    const raw = (await AsyncStorage.getItem(KEYS.QUIZ_RESULTS)) || '[]';
    const results = JSON.parse(raw);
    results.push({ 
      ...result, 
      timestamp: Date.now(),
      id: 'quiz_' + Date.now()
    });
    await AsyncStorage.setItem(KEYS.QUIZ_RESULTS, JSON.stringify(results));
  } catch (error) {
    console.log('Quiz result save error:', error);
  }
}


export async function getPreparednessStats() {
  try {
    const drillsRaw = (await AsyncStorage.getItem(KEYS.DRILL_RESULTS)) || '[]';
    const quizzesRaw = (await AsyncStorage.getItem(KEYS.QUIZ_RESULTS)) || '[]';
    
    const drills = JSON.parse(drillsRaw);
    const quizzes = JSON.parse(quizzesRaw);
    
    if (drills.length === 0 && quizzes.length === 0) {
      return { completion: 0, avgScore: 0, drills: 0 };
    }
    
    // Calculate completion based on unique hazards practiced
    const uniqueHazards = Array.from(new Set(drills.map(d => d.hazard))).length;
    const completion = Math.min(100, (uniqueHazards / 3) * 100);
    
    // Calculate average quiz score
    const avgQuizScore = quizzes.length > 0 
      ? quizzes.reduce((sum, q) => sum + (q.score || 0), 0) / quizzes.length 
      : 0;
    
    // Overall average considering both drills (assume 100% score) and quizzes
    const avgScore = drills.length > 0 && quizzes.length > 0
      ? ((drills.length * 100) + (quizzes.length * avgQuizScore)) / (drills.length + quizzes.length)
      : drills.length > 0 ? 100 : avgQuizScore;
    
    return { 
      completion, 
      avgScore, 
      drills: drills.length,
      quizzes: quizzes.length
    };
  } catch (error) {
    console.log('Stats calculation error:', error);
    return { completion: 0, avgScore: 0, drills: 0 };
  }
}

export async function saveSetting(key, value) {
  try {
    const raw = (await AsyncStorage.getItem(KEYS.SETTINGS)) || '{}';
    const settings = JSON.parse(raw);
    settings[key] = value;
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.log('Setting save error:', error);
  }
}

export async function getSetting(key) {
  try {
    const raw = (await AsyncStorage.getItem(KEYS.SETTINGS)) || '{}';
    const settings = JSON.parse(raw);
    return settings[key];
  } catch (error) {
    console.log('Setting get error:', error);
    return null;
  }
}

export async function markContentComplete(contentId) {
  try {
    const raw = (await AsyncStorage.getItem(KEYS.CONTENT_PROGRESS)) || '{}';
    const progress = JSON.parse(raw);
    progress[contentId] = { completed: true, timestamp: Date.now() };
    await AsyncStorage.setItem(KEYS.CONTENT_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.log('Content progress error:', error);
  }
}

export async function getContentProgress() {
  try {
    const raw = (await AsyncStorage.getItem(KEYS.CONTENT_PROGRESS)) || '{}';
    return JSON.parse(raw);
  } catch (error) {
    console.log('Content progress get error:', error);
    return {};
  }
}
