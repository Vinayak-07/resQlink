import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export const LANG = { EN: 'en', HI: 'hi' };

export const strings = {
  en: {
    appTitle: 'School Disaster Prep',
    home: 'Home',
    learn: 'Learn',
    drills: 'Drills',
    alerts: 'Alerts',
    directory: 'Help',
    admin: 'Stats',
    quickActions: 'Quick Actions',
    startDrill: 'Start Drill',
    learnModules: 'Learning Modules',
    takeQuiz: 'Take Quiz',
    preparednessScore: 'Preparedness Score',
    completion: 'Completion',
    avgScore: 'Average Score',
    drillsDone: 'Drills Done',
    start: 'Start',
    next: 'Next',
  },
  hi: {
    appTitle: 'स्कूल आपदा तैयारी',
    home: 'होम',
    learn: 'सीखें',
    drills: 'ड्रिल',
    alerts: 'अलर्ट',
    directory: 'सहायता',
    admin: 'आंकड़े',
    quickActions: 'त्वरित क्रियाएँ',
    startDrill: 'ड्रिल शुरू करें',
    learnModules: 'सीखने के मॉड्यूल',
    takeQuiz: 'प्रश्नोत्तरी दें',
    preparednessScore: 'तैयारी स्कोर',
    completion: 'पूर्णता',
    avgScore: 'औसत स्कोर',
    drillsDone: 'ड्रिल पूरी',
    start: 'शुरू करें',
    next: 'आगे',
  }
};

export const HAZARDS = [
  {
    id: 'earthquake',
    IconComponent: MaterialCommunityIcons,
    iconName: 'earth',
    color: '#ff6b35',
    title: { en: 'Earthquake Drill', hi: 'भूकंप ड्रिल' },
    summary: {
      en: 'Drop, Cover, Hold and safe evacuation to assembly area',
      hi: 'झुको, ढको, पकड़े रहें और सुरक्षित निकासी'
    },
    steps: [
      { en: { instruction: 'Drop to hands and knees under sturdy desk' }, hi: { instruction: 'मेज़ के नीचे झुकें' } },
      { en: { instruction: 'Cover head and neck; hold table leg' }, hi: { instruction: 'सिर-गर्दन ढकें; मेज़ का पाँव पकड़ें' } },
      { en: { instruction: 'After shaking stops, evacuate via posted route' }, hi: { instruction: 'कम्पन रुकने पर मार्ग से बाहर निकलें' } },
      { en: { instruction: 'Assemble at safe area; attendance check' }, hi: { instruction: 'सुरक्षित क्षेत्र; उपस्थिति जाँच' } }
    ]
  },
  {
    id: 'fire',
    IconComponent: MaterialCommunityIcons,
    iconName: 'fire',
    color: '#ff3b30',
    title: { en: 'Fire Drill', hi: 'आग ड्रिल' },
    summary: {
      en: 'Orderly exit, avoid elevators, crawl low under smoke',
      hi: 'क्रमबद्ध निकासी, लिफ्ट नहीं, धुएँ में नीचे झुकें'
    },
    steps: [
      { en: { instruction: 'Raise alarm; use PA; don\'t panic' }, hi: { instruction: 'अलार्म; पीए सिस्टम; घबराएँ नहीं' } },
      { en: { instruction: 'Evacuate via stairs; avoid elevators' }, hi: { instruction: 'सीढ़ियों से बाहर; लिफ्ट नहीं' } },
      { en: { instruction: 'Crawl low under smoke if present' }, hi: { instruction: 'धुएँ में नीचे झुककर चलें' } },
      { en: { instruction: 'Account for all students at assembly point' }, hi: { instruction: 'सभी छात्रों की उपस्थिति लें' } }
    ]
  },
  {
    id: 'flood',
    IconComponent: MaterialCommunityIcons,
    iconName: 'waves',
    color: '#007aff',
    title: { en: 'Flood Drill', hi: 'बाढ़ ड्रिल' },
    summary: {
      en: 'Move to higher floors, turn off electricity, avoid water',
      hi: 'ऊपरी मंज़िल; बिजली बंद; पानी से बचें'
    },
    steps: [
      { en: { instruction: 'Monitor warnings; follow CAP/IMD guidance' }, hi: { instruction: 'चेतावनियाँ देखें; CAP/IMD निर्देश मानें' } },
      { en: { instruction: 'Move to higher floors; avoid waterlogged areas' }, hi: { instruction: 'ऊपरी मंज़िल जाएँ; पानी से बचें' } },
      { en: { instruction: 'Switch off electricity if safe' }, hi: { instruction: 'बिजली सुरक्षित हो तो बंद करें' } },
      { en: { instruction: 'Await all-clear; then planned evacuation' }, hi: { instruction: 'ऑल-क्लियर तक प्रतीक्षा; फिर निकासी' } }
    ]
  }
];

export const QUIZZES = [
  {
    q: { en: 'During an earthquake, what is the safest immediate action?', hi: 'भूकंप के दौरान सुरक्षित पहला कदम क्या है?' },
    options: { en: ['Run outside', 'Drop, Cover, Hold', 'Use elevator'], hi: ['बाहर भागें', 'झुको, ढको, पकड़े रहें', 'लिफ्ट लें'] },
    answerIndex: 1
  },
  {
    q: { en: 'If hallway is smoky, how to move?', hi: 'धुएँ में कैसे चलें?' },
    options: { en: ['Stand upright', 'Crawl low', 'Run fast'], hi: ['सीधा चलें', 'नीचे झुककर चलें', 'तेज़ दौड़ें'] },
    answerIndex: 1
  },
  {
    q: { en: 'During flood, you should:', hi: 'बाढ़ के दौरान आपको चाहिए:' },
    options: { en: ['Stay in basement', 'Move to higher ground', 'Drive through water'], hi: ['तहखाने में रहें', 'ऊंची जगह जाएं', 'पानी में गाड़ी चलाएं'] },
    answerIndex: 1
  }
];

export const QUIZZES_BY_TOPIC = {
  'eq-basics': {
    title: { en: 'Earthquake Safety', hi: 'भूकंप सुरक्षा' },
    IconComponent: MaterialCommunityIcons,
    iconName: 'earth',
    questions: [
      {
        q: { en: 'What is the first step in the "Drop, Cover, Hold" protocol?', hi: '"झुको, ढको, पकड़े रहो" में पहला कदम क्या है?' },
        options: { en: ['Run outside', 'Drop to hands and knees', 'Scream for help'], hi: ['बाहर भागें', 'हाथों और घुटनों के बल झुकें', 'मदद के लिए चिल्लाएं'] },
        answerIndex: 1
      },
      {
        q: { en: 'Where should you take COVER during an earthquake?', hi: 'भूकंप के दौरान आपको कहाँ शरण लेनी चाहिए?' },
        options: { en: ['In a doorway', 'Under a sturdy desk or table', 'Next to a window'], hi: ['एक दरवाजे में', 'एक मजबूत डेस्क या मेज के नीचे', 'एक खिड़की के बगल में'] },
        answerIndex: 1
      },
      {
        q: { en: 'What should you do immediately after the shaking stops?', hi: 'कंपन रुकने के तुरंत बाद आपको क्या करना चाहिए?' },
        options: { en: ['Call your parents', 'Check for injuries and evacuate', 'Go back to your classroom'], hi: ['अपने माता-पिता को बुलाओ', 'चोटों की जांच करें और बाहर निकलें', 'अपनी कक्षा में वापस जाओ'] },
        answerIndex: 1
      },
      {
        q: { en: 'Which of these should you AVOID during an evacuation after an earthquake?', hi: 'भूकंप के बाद निकासी के दौरान आपको इनमें से किससे बचना चाहिए?' },
        options: { en: ['Stairs', 'Designated routes', 'Elevators'], hi: ['सीढ़ियाँ', 'निर्धारित मार्ग', 'लिफ्ट'] },
        answerIndex: 2
      },
      {
        q: { en: 'What is the final step after evacuating to the assembly point?', hi: 'सभा स्थल पर निकासी के बाद अंतिम चरण क्या है?' },
        options: { en: ['Play games', 'Go home', 'Attendance check'], hi: ['खेल खेलें', 'घर जाओ', 'उपस्थिति जांच'] },
        answerIndex: 2
      },
      {
        q: { en: 'What should you HOLD ON to during an earthquake?', hi: 'भूकंप के दौरान आपको क्या पकड़ना चाहिए?' },
        options: { en: ['Your head', 'Your shelter (e.g., table leg)', 'Your friend'], hi: ['आपका सिर', 'आपका आश्रय (जैसे, मेज का पाया)', 'आपका दोस्त'] },
        answerIndex: 1
      },
      {
        q: { en: 'Why is earthquake preparedness crucial in India?', hi: 'भारत में भूकंप की तैयारी क्यों महत्वपूर्ण है?' },
        options: { en: ['It rains a lot', 'India sits on several fault lines', 'It is a large country'], hi: ['यहाँ बहुत बारिश होती है', 'भारत कई फॉल्ट लाइनों पर स्थित है', 'यह एक बड़ा देश है'] },
        answerIndex: 1
      },
      {
        q: { en: 'Before evacuating, what is the first thing to check for?', hi: 'निकासी से पहले, सबसे पहले क्या जांचना चाहिए?' },
        options: { en: ['Your belongings', 'Injuries and hazards', 'The time'], hi: ['आपका सामान', 'चोटें और खतरे', 'समय'] },
        answerIndex: 1
      },
      {
        q: { en: 'What should schools do to prepare for earthquakes?', hi: 'भूकंप की तैयारी के लिए स्कूलों को क्या करना चाहिए?' },
        options: { en: ['Close the school', 'Conduct regular drills', 'Ignore the risk'], hi: ['स्कूल बंद कर दें', 'नियमित अभ्यास करें', 'जोखिम को अनदेखा करें'] },
        answerIndex: 1
      },
      {
        q: { en: 'When is it safe to leave your cover position?', hi: 'अपनी कवर स्थिति को छोड़ना कब सुरक्षित है?' },
        options: { en: ['After 1 minute', 'When the shaking stops completely', 'When the alarm stops'], hi: ['1 मिनट के बाद', 'जब कंपन पूरी तरह से बंद हो जाए', 'जब अलार्म बंद हो जाए'] },
        answerIndex: 1
      }
    ]
  },
  'fire-safety': {
    title: { en: 'Fire Safety', hi: 'अग्नि सुरक्षा' },
    IconComponent: MaterialCommunityIcons,
    iconName: 'fire',
    questions: [
      {
        q: { en: 'If you discover a fire, what is the first thing you should do?', hi: 'यदि आपको आग का पता चलता है, तो आपको सबसे पहले क्या करना चाहिए?' },
        options: { en: ['Take a photo', 'Alert others by shouting "FIRE!"', 'Try to put it out yourself'], hi: ['एक तस्वीर ले लो', '"आग!" चिल्लाकर दूसरों को सचेत करें', 'इसे खुद बुझाने की कोशिश करें'] },
        answerIndex: 1
      },
      {
        q: { en: 'What number should you call for fire emergencies in India?', hi: 'भारत में आग लगने पर आपको किस नंबर पर कॉल करना चाहिए?' },
        options: { en: ['100', '101', '108'], hi: ['100', '101', '108'] },
        answerIndex: 1
      },
      {
        q: { en: 'How should you move if a hallway is filled with smoke?', hi: 'यदि कोई दालान धुएं से भरा है तो आपको कैसे चलना चाहिए?' },
        options: { en: ['Run as fast as you can', 'Stay low and crawl', 'Walk upright'], hi: ['जितनी तेजी से हो सके दौड़ें', 'नीचे झुककर रेंगें', 'सीधे चलें'] },
        answerIndex: 1
      },
      {
        q: { en: 'Why should you feel a door before opening it during a fire?', hi: 'आग के दौरान दरवाजा खोलने से पहले आपको उसे क्यों महसूस करना चाहिए?' },
        options: { en: ['To see if it is locked', 'To check if it is hot', 'To knock first'], hi: ['यह देखने के लिए कि क्या यह बंद है', 'यह जांचने के लिए कि क्या यह गर्म है', 'पहले दस्तक देने के लिए'] },
        answerIndex: 1
      },
      {
        q: { en: 'What should you never use during a fire evacuation?', hi: 'आग से निकासी के दौरान आपको कभी भी क्या उपयोग नहीं करना चाहिए?' },
        options: { en: ['Stairs', 'Exits', 'Elevators'], hi: ['सीढ़ियाँ', 'निकास', 'लिफ्ट'] },
        answerIndex: 2
      },
      {
        q: { en: 'What can you do to slow a fire\'s spread while evacuating?', hi: 'निकासी के दौरान आग के फैलाव को धीमा करने के लिए आप क्या कर सकते हैं?' },
        options: { en: ['Open windows', 'Close doors behind you', 'Turn on fans'], hi: ['खिड़कियां खोलो', 'अपने पीछे के दरवाजे बंद करो', 'पंखे चालू करो'] },
        answerIndex: 1
      },
      {
        q: { en: 'Where should you go after evacuating the building?', hi: 'इमारत से निकलने के बाद आपको कहाँ जाना चाहिए?' },
        options: { en: ['Home', 'A friend\'s house', 'The designated assembly point'], hi: ['घर', 'एक दोस्त का घर', 'निर्दिष्ट सभा स्थल'] },
        answerIndex: 2
      },
      {
        q: { en: 'If you are trapped in a room, what should you do?', hi: 'यदि आप एक कमरे में फंस गए हैं, तो आपको क्या करना चाहिए?' },
        options: { en: ['Hide under the bed', 'Seal gaps under doors and signal for help', 'Break the window'], hi: ['बिस्तर के नीचे छिप जाओ', 'दरवाजों के नीचे की दरारों को सील करें और मदद के लिए संकेत दें', 'खिड़की तोड़ दो'] },
        answerIndex: 1
      },
      {
        q: { en: 'What does "Activate the nearest fire alarm pull station" mean?', hi: '"निकटतम फायर अलार्म पुल स्टेशन को सक्रिय करें" का क्या अर्थ है?' },
        options: { en: ['Pull the handle on the red box on the wall', 'Call the fire department', 'Shout loudly'], hi: ['दीवार पर लाल बॉक्स पर हैंडल खींचो', 'दमकल विभाग को बुलाओ', 'जोर से चिल्लाओ'] },
        answerIndex: 0
      },
      {
        q: { en: 'What is the first line of defense against school fires?', hi: 'स्कूल की आग के खिलाफ रक्षा की पहली पंक्ति क्या है?' },
        options: { en: ['Fire drills', 'Fire extinguishers', 'Fire prevention'], hi: ['आग अभ्यास', 'आग बुझाने वाले यंत्र', 'आग की रोकथाम'] },
        answerIndex: 2
      }
    ]
  },
  'flood-prep': {
    title: { en: 'Flood Preparedness', hi: 'बाढ़ की तैयारी' },
    IconComponent: MaterialCommunityIcons,
    iconName: 'waves',
    questions: [
      {
        q: { en: 'If flooding occurs, where is the safest place to go?', hi: 'यदि बाढ़ आती है, तो जाने के लिए सबसे सुरक्षित स्थान कहाँ है?' },
        options: { en: ['The basement', 'Higher floors or higher ground', 'Outside'], hi: ['तहखाना', 'ऊपरी मंजिलें या ऊंची जमीन', 'बाहर'] },
        answerIndex: 1
      },
      {
        q: { en: 'What should you do with electrical equipment during a flood?', hi: 'बाढ़ के दौरान बिजली के उपकरणों का क्या करना चाहिए?' },
        options: { en: ['Use it as normal', 'Turn it off if it is safe to do so', 'Move it to the floor'], hi: ['इसे सामान्य रूप से उपयोग करें', 'यदि ऐसा करना सुरक्षित है तो इसे बंद कर दें', 'इसे फर्श पर ले जाएं'] },
        answerIndex: 1
      },
      {
        q: { en: 'Is it safe to walk or drive through floodwater?', hi: 'क्या बाढ़ के पानी से चलना या गाड़ी चलाना सुरक्षित है?' },
        options: { en: ['Yes, if the water is not deep', 'Only if you have a large vehicle', 'No, never'], hi: ['हाँ, यदि पानी गहरा नहीं है', 'केवल यदि आपके पास एक बड़ा वाहन है', 'नहीं, कभी नहीं'] },
        answerIndex: 2
      },
      {
        q: { en: 'How many inches of flowing water can knock you down?', hi: 'बहते पानी के कितने इंच आपको गिरा सकते हैं?' },
        options: { en: ['6 inches', '24 inches', '18 inches'], hi: ['6 इंच', '24 इंच', '18 इंच'] },
        answerIndex: 0
      },
      {
        q: { en: 'Why should you stay away from floodwater?', hi: 'आपको बाढ़ के पानी से दूर क्यों रहना चाहिए?' },
        options: { en: ['It is cold', 'It may be contaminated', 'It is clean'], hi: ['यह ठंडा है', 'यह दूषित हो सकता है', 'यह साफ है'] },
        answerIndex: 1
      },
      {
        q: { en: 'What is a key preparation step before a flood?', hi: 'बाढ़ से पहले एक महत्वपूर्ण तैयारी कदम क्या है?' },
        options: { en: ['Ignore weather warnings', 'Know your school\'s flood evacuation plan', 'Store items in the basement'], hi: ['मौसम की चेतावनियों को अनदेखा करें', 'अपने स्कूल की बाढ़ निकासी योजना को जानें', 'तहखाने में सामान स्टोर करें'] },
        answerIndex: 1
      },
      {
        q: { en: 'During a flood, what should you avoid?', hi: 'बाढ़ के दौरान आपको किससे बचना चाहिए?' },
        options: { en: ['Higher floors', 'Basements and low-lying areas', 'Listening to authorities'], hi: ['ऊपरी मंजिलें', 'तहखाने और निचले इलाके', 'अधिकारियों की बात सुनना'] },
        answerIndex: 1
      },
      {
        q: { en: 'When should you evacuate during a flood?', hi: 'बाढ़ के दौरान आपको कब निकलना चाहिए?' },
        options: { en: ['Immediately', 'When you feel like it', 'When you receive official instructions'], hi: ['तुरंत', 'जब आपका मन करे', 'जब आपको आधिकारिक निर्देश मिलें'] },
        answerIndex: 2
      },
      {
        q: { en: 'How much water can carry away a vehicle?', hi: 'कितना पानी एक वाहन को बहा सकता है?' },
        options: { en: ['6 inches', '12 inches', '36 inches'], hi: ['6 इंच', '12 इंच', '36 इंच'] },
        answerIndex: 1
      },
      {
        q: { en: 'What is a primary cause of floods?', hi: 'बाढ़ का एक प्राथमिक कारण क्या है?' },
        options: { en: ['Heavy rainfall', 'Strong winds', 'Earthquakes'], hi: ['भारी वर्षा', 'तेज हवाएं', 'भूकंप'] },
        answerIndex: 0
      }
    ]
  },
  'cyclone-safety': {
    title: { en: 'Cyclone Safety', hi: 'चक्रवात सुरक्षा' },
    IconComponent: MaterialCommunityIcons,
    iconName: 'weather-hurricane',
    questions: [
      {
        q: { en: 'During a cyclone, where is the safest place to be?', hi: 'चक्रवात के दौरान, सबसे सुरक्षित स्थान कहाँ है?' },
        options: { en: ['Outside watching the storm', 'In a car', 'Indoors, in an interior room away from windows'], hi: ['बाहर तूफान देख रहे हैं', 'एक कार में', 'घर के अंदर, खिड़कियों से दूर एक आंतरिक कमरे में'] },
        answerIndex: 2
      },
      {
        q: { en: 'What should you do with loose objects outdoors before a cyclone?', hi: 'चक्रवात से पहले बाहर की ढीली वस्तुओं का क्या करना चाहिए?' },
        options: { en: ['Leave them as they are', 'Secure or remove them', 'Stack them neatly'], hi: ['उन्हें वैसे ही छोड़ दें', 'उन्हें सुरक्षित करें या हटा दें', 'उन्हें बड़े करीने से ढेर करें'] },
        answerIndex: 1
      },
      {
        q: { en: 'Is it safe to go outside during the "eye" of the storm?', hi: 'तूफान की "आंख" के दौरान बाहर जाना क्या सुरक्षित है?' },
        options: { en: ['Yes, it is calm', 'No, the storm will resume', 'Only for a short time'], hi: ['हाँ, यह शांत है', 'नहीं, तूफान फिर से शुरू होगा', 'केवल थोड़े समय के लिए'] },
        answerIndex: 1
      },
      {
        q: { en: 'How should you get updates during a cyclone if the power is out?', hi: 'यदि बिजली चली गई है तो चक्रवात के दौरान आपको अपडेट कैसे प्राप्त करने चाहिए?' },
        options: { en: ['Watch TV', 'Listen to a battery-powered radio', 'Check the internet'], hi: ['टीवी देखो', 'बैटरी चालित रेडियो सुनें', 'इंटरनेट जांचें'] },
        answerIndex: 1
      },
      {
        q: { en: 'What is a major danger associated with cyclones besides wind?', hi: 'हवा के अलावा चक्रवातों से जुड़ा एक बड़ा खतरा क्या है?' },
        options: { en: ['Drought', 'Storm surges and heavy rain', 'Sunny weather'], hi: ['सूखा', 'तूफानी लहरें और भारी बारिश', 'धूप का मौसम'] },
        answerIndex: 1
      },
      {
        q: { en: 'What should you do before a cyclone hits?', hi: 'चक्रवात आने से पहले आपको क्या करना चाहिए?' },
        options: { en: ['Ignore warnings', 'Review evacuation routes and shelter locations', 'Go to the beach'], hi: ['चेतावनियों को अनदेखा करें', 'निकासी मार्गों और आश्रय स्थानों की समीक्षा करें', 'समुद्र तट पर जाएं'] },
        answerIndex: 1
      },
      {
        q: { en: 'What should you stay away from inside a building during a cyclone?', hi: 'चक्रवात के दौरान एक इमारत के अंदर आपको किससे दूर रहना चाहिए?' },
        options: { en: ['Interior walls', 'Bathrooms', 'Windows and glass doors'], hi: ['आंतरिक दीवारें', 'बाथरूम', 'खिड़कियां और कांच के दरवाजे'] },
        answerIndex: 2
      },
      {
        q: { en: 'When is it safe to go outside after a cyclone?', hi: 'चक्रवात के बाद बाहर जाना कब सुरक्षित है?' },
        options: { en: ['Immediately after the wind stops', 'When authorities declare it is all-clear', 'The next day'], hi: ['हवा रुकने के तुरंत बाद', 'जब अधिकारी इसे ऑल-क्लियर घोषित करते हैं', 'अगले दिन'] },
        answerIndex: 1
      },
      {
        q: { en: 'What is a hazard to look out for after a storm passes?', hi: 'तूफान गुजरने के बाद किस खतरे से सावधान रहना चाहिए?' },
        options: { en: ['Rainbows', 'Fallen power lines', 'Clear skies'], hi: ['इंद्रधनुष', 'गिरी हुई बिजली की लाइनें', 'साफ आसमान'] },
        answerIndex: 1
      },
      {
        q: { en: 'What should you do with windows and doors before a cyclone?', hi: 'चक्रवात से पहले खिड़कियों और दरवाजों का क्या करना चाहिए?' },
        options: { en: ['Open them wide', 'Check and reinforce them', 'Remove them'], hi: ['उन्हें चौड़ा खोलो', 'उनकी जांच करें और उन्हें मजबूत करें', 'उन्हें हटा दें'] },
        answerIndex: 1
      }
    ]
  }
};

export const SAFETY_TIPS = [
  {
    en: 'Create a family emergency plan. Know how you’ll contact one another and reconnect if separated.',
    hi: 'एक पारिवारिक आपातकालीन योजना बनाएं। जानें कि आप एक-दूसरे से कैसे संपर्क करेंगे और अलग होने पर फिर से कैसे जुड़ेंगे।'
  },
  {
    en: 'Keep a battery-powered or hand-crank radio to get information during a power outage.',
    hi: 'बिजली कटौती के दौरान जानकारी प्राप्त करने के लिए बैटरी से चलने वाला या हैंड-क्रैंक रेडियो रखें।'
  },
  {
    en: 'In an earthquake, if you are outdoors, stay outdoors and move away from buildings, streetlights, and utility wires.',
    hi: 'भूकंप में, यदि आप बाहर हैं, तो बाहर ही रहें और इमारतों, स्ट्रीटलाइट्स और उपयोगिता तारों से दूर चले जाएं।'
  },
  {
    en: 'Never use a gas stove or oven to heat your home. It can cause carbon monoxide poisoning.',
    hi: 'अपने घर को गर्म करने के लिए कभी भी गैस स्टोव या ओवन का उपयोग न करें। इससे कार्बन मोनोऑक्साइड विषाक्तता हो सकती है।'
  },
  {
    en: 'Know the location of your main water, gas, and electricity shut-offs.',
    hi: 'अपने मुख्य पानी, गैस और बिजली के शट-ऑफ का स्थान जानें।'
  },
  {
    en: 'Assemble an emergency kit with water, non-perishable food, a first-aid kit, and a flashlight.',
    hi: 'पानी, खराब न होने वाले भोजन, एक प्राथमिक चिकित्सा किट और एक टॉर्च के साथ एक आपातकालीन किट इकट्ठा करें।'
  },
  {
    en: 'During a flood, just six inches of moving water can knock you down.',
    hi: 'बाढ़ के दौरान, सिर्फ छह इंच बहता पानी आपको गिरा सकता है।'
  },
  {
    en: 'Check on your neighbors, especially the elderly or those with special needs, after a disaster.',
    hi: 'आपदा के बाद अपने पड़ोसियों, विशेषकर बुजुर्गों या विशेष आवश्यकता वाले लोगों की जाँच करें।'
  },
  {
    en: 'If you smell smoke, stay low to the ground to avoid inhaling it.',
    hi: 'यदि आपको धुएं की गंध आती है, तो इसे अंदर लेने से बचने के लिए जमीन से नीचे रहें।'
  },
  {
    en: 'Secure heavy furniture like bookshelves and cabinets to the wall to prevent them from tipping over during an earthquake.',
    hi: 'भूकंप के दौरान बुकशेल्फ़ और कैबिनेट जैसे भारी फर्नीचर को दीवार से सुरक्षित करें ताकि वे पलटने से बच सकें।'
  }
];

export const EMERGENCY_KIT_GAME = {
  title: { en: 'Emergency Kit Packer', hi: 'आपातकालीन किट पैकर' },
  description: { en: 'Pack the essential items for your emergency kit!', hi: 'अपनी आपातकालीन किट के लिए आवश्यक वस्तुएं पैक करें!' },
  items: [
    { name: { en: 'Water Bottle', hi: 'पानी की बोतल' }, icon: 'water', isEssential: true },
    { name: { en: 'First-Aid Kit', hi: 'प्राथमिक चिकित्सा किट' }, icon: 'medical-bag', isEssential: true },
    { name: { en: 'Flashlight', hi: 'टॉर्च' }, icon: 'flashlight', isEssential: true },
    { name: { en: 'Snack Bars', hi: 'स्नैक बार' }, icon: 'food-apple', isEssential: true },
    { name: { en: 'Whistle', hi: 'सीटी' }, icon: 'whistle', isEssential: true },
    { name: { en: 'Battery Radio', hi: 'बैटरी रेडियो' }, icon: 'radio', isEssential: true },
    { name: { en: 'Video Game', hi: 'वीडियो गेम' }, icon: 'gamepad-variant', isEssential: false },
    { name: { en: 'Heavy Books', hi: 'भारी किताबें' }, icon: 'book-open-variant', isEssential: false },
    { name: { en: 'Favorite Toy', hi: 'पसंदीदा खिलौना' }, icon: 'robot', isEssential: false },
    { name: { en: 'Extra Batteries', hi: 'अतिरिक्त बैटरी' }, icon: 'battery', isEssential: true },
    { name: { en: 'Candles', hi: 'मोमबत्तियाँ' }, icon: 'candle', isEssential: false }, // Fire hazard
    { name: { en: 'Important Documents', hi: 'महत्वपूर्ण दस्तावेज़' }, icon: 'file-document', isEssential: true },
  ]
};

export function getContent(lang) {
  return [
    {
      id: 'eq-prep',
      IconComponent: MaterialCommunityIcons,
      iconName: 'earth',
      title: lang === 'hi' ? 'भूकंप: तैयारी' : 'Earthquake Preparedness',
      body: lang === 'hi'
        ? 'भूकंप के लिए तैयारी और प्रतिक्रिया के तरीके सीखें।'
        : 'Learn how to prepare for and respond to earthquakes.'
    },
    {
      id: 'fire-safety',
      IconComponent: MaterialCommunityIcons,
      iconName: 'fire',
      title: lang === 'hi' ? 'आग सुरक्षा' : 'Fire Safety',
      body: lang === 'hi'
        ? 'आग से बचाव और सुरक्षित निकासी के तरीके।'
        : 'Fire prevention and safe evacuation procedures.'
    },
    {
      id: 'flood-prep',
      IconComponent: MaterialCommunityIcons,
      iconName: 'waves',
      title: lang === 'hi' ? 'बाढ़ तैयारी' : 'Flood Preparedness',
      body: lang === 'hi'
        ? 'बाढ़ की स्थिति में सुरक्षित रहने की गाइड।'
        : 'Guide to staying safe during flood situations.'
    },
    {
      id: 'cyclone-safety',
      IconComponent: MaterialCommunityIcons,
      iconName: 'weather-hurricane',
      title: lang === 'hi' ? 'चक्रवात सुरक्षा' : 'Cyclone Safety',
      body: lang === 'hi'
        ? 'चक्रवात और तूफान से सुरक्षा के उपाय।'
        : 'Protection measures for cyclones and storms.'
    }
  ];
}

export function getDetailedContent(contentId, lang) {
  const detailedContent = {
    'eq-prep': {
      en: {
        title: 'Earthquake Safety & Preparedness',
        sections: [
          {
            subtitle: 'Understanding Earthquakes',
            content: 'Earthquakes occur when tectonic plates shift suddenly, releasing energy that shakes the ground. India sits on several fault lines, making earthquake preparedness crucial for schools.',
            steps: null
          },
          {
            subtitle: 'Drop, Cover, Hold Protocol',
            content: 'The internationally recognized response during earthquake shaking:',
            steps: [
              'DROP to hands and knees immediately',
              'Take COVER under a sturdy desk or table',
              'HOLD on to your shelter and protect head/neck',
              'Stay in position until shaking stops completely'
            ]
          },
          {
            subtitle: 'After the Shaking',
            content: 'Once the earthquake stops, follow evacuation procedures:',
            steps: [
              'Check for injuries and hazards around you',
              'Exit building via predetermined evacuation routes',
              'Avoid elevators and damaged areas',
              'Assemble at designated safe area for attendance'
            ]
          },
          {
            subtitle: 'School Preparedness',
            content: 'Schools should maintain emergency supplies and conduct regular drills. Know your school\'s evacuation routes and assembly points.',
            steps: null
          }
        ]
      },
      hi: {
        title: 'भूकंप सुरक्षा और तैयारी',
        sections: [
          {
            subtitle: 'भूकंप को समझना',
            content: 'भूकंप तब आता है जब भूवैज्ञानिक प्लेटें अचानक खिसकती हैं और ऊर्जा निकलती है जो जमीन को हिलाती है। भारत कई फॉल्ट लाइनों पर स्थित है, इसलिए स्कूलों के लिए भूकंप की तैयारी महत्वपूर्ण है।',
            steps: null
          },
          {
            subtitle: 'झुको, ढको, पकड़े रहो प्रोटोकॉल',
            content: 'भूकंप के दौरान अंतर्राष्ट्रीय स्तर पर मान्यता प्राप्त प्रतिक्रिया:',
            steps: [
              'तुरंत हाथों और घुटनों के बल झुकें',
              'मजबूत डेस्क या टेबल के नीचे शरण लें',
              'अपने शरणस्थल को पकड़ें और सिर/गर्दन की सुरक्षा करें',
              'हिलना पूरी तरह बंद होने तक स्थिति में रहें'
            ]
          },
          {
            subtitle: 'हिलने के बाद',
            content: 'भूकंप रुकने के बाद, निकासी प्रक्रियाओं का पालन करें:',
            steps: [
              'अपने आसपास चोटों और खतरों की जांच करें',
              'पूर्व निर्धारित निकासी मार्गों से भवन से बाहर निकलें',
              'लिफ्ट और क्षतिग्रस्त क्षेत्रों से बचें',
              'उपस्थिति के लिए निर्दिष्ट सुरक्षित क्षेत्र में इकट्ठा हों'
            ]
          },
          {
            subtitle: 'स्कूल की तैयारी',
            content: 'स्कूलों को आपातकालीन आपूर्ति बनाए रखनी चाहिए और नियमित अभ्यास करना चाहिए। अपने स्कूल के निकासी मार्गों और सभा स्थलों को जानें।',
            steps: null
          }
        ]
      }
    },
    'fire-safety': {
      en: {
        title: 'Fire Safety & Emergency Response',
        sections: [
          {
            subtitle: 'Fire Prevention',
            content: 'Most school fires are preventable. Understanding fire hazards and prevention measures is the first line of defense.',
            steps: null
          },
          {
            subtitle: 'In Case of Fire',
            content: 'If you discover a fire or hear the fire alarm:',
            steps: [
              'Alert others immediately - shout "FIRE!"',
              'Activate the nearest fire alarm pull station',
              'Call emergency services (101)',
              'Evacuate immediately via nearest safe exit',
              'Never use elevators during fire evacuation'
            ]
          },
          {
            subtitle: 'Evacuation Procedures',
            content: 'During fire evacuation, remember these critical steps:',
            steps: [
              'Feel doors before opening - if hot, find alternate route',
              'Stay low and crawl under smoke if necessary',
              'Close doors behind you to slow fire spread',
              'Use stairs, never elevators',
              'Go to designated assembly point'
            ]
          },
          {
            subtitle: 'If Trapped',
            content: 'If you cannot evacuate safely, protect yourself until rescue arrives by sealing gaps under doors and signaling for help from windows.',
            steps: null
          }
        ]
      },
      hi: {
        title: 'आग सुरक्षा और आपातकालीन प्रतिक्रिया',
        sections: [
          {
            subtitle: 'आग की रोकथाम',
            content: 'अधिकांश स्कूल की आग रोकी जा सकती है। आग के खतरों और रोकथाम के उपायों को समझना पहली रक्षा पंक्ति है।',
            steps: null
          },
          {
            subtitle: 'आग के मामले में',
            content: 'यदि आप आग की खोज करते हैं या फायर अलार्म सुनते हैं:',
            steps: [
              'तुरंत दूसरों को सचेत करें - "आग!" चिल्लाएं',
              'निकटतम फायर अलार्म पुल स्टेशन को सक्रिय करें',
              'आपातकालीन सेवाओं को कॉल करें (101)',
              'निकटतम सुरक्षित निकास से तुरंत निकासी करें',
              'आग निकासी के दौरान कभी भी लिफ्ट का उपयोग न करें'
            ]
          },
          {
            subtitle: 'निकासी प्रक्रियाएं',
            content: 'आग निकासी के दौरान, इन महत्वपूर्ण चरणों को याद रखें:',
            steps: [
              'खोलने से पहले दरवाजों को महसूस करें - यदि गर्म है, तो वैकल्पिक रास्ता खोजें',
              'कम रहें और यदि आवश्यक हो तो धुएं के नीचे रेंगें',
              'आग फैलने को धीमा करने के लिए अपने पीछे दरवाजे बंद करें',
              'सीढ़ियों का उपयोग करें, कभी लिफ्ट नहीं',
              'निर्दिष्ट सभा स्थल पर जाएं'
            ]
          },
          {
            subtitle: 'यदि फंस गए',
            content: 'यदि आप सुरक्षित रूप से निकासी नहीं कर सकते, तो दरवाजों के नीचे के अंतराल को सील करके और खिड़कियों से मदद के लिए संकेत देकर बचाव तक पहुंचने तक अपनी सुरक्षा करें।',
            steps: null
          }
        ]
      }
    },
    'flood-prep': {
      en: {
        title: 'Flood Preparedness & Response',
        sections: [
          {
            subtitle: 'Understanding Flood Risks',
            content: 'Floods can occur due to heavy rainfall, dam failures, or storm surges. Schools in low-lying areas or near water bodies face higher risks.',
            steps: null
          },
          {
            subtitle: 'Before the Flood',
            content: 'Preparation is key to flood safety:',
            steps: [
              'Monitor weather warnings and alerts',
              'Know your school\'s flood evacuation plan',
              'Identify higher ground and safe zones',
              'Keep emergency supplies accessible',
              'Ensure communication systems work'
            ]
          },
          {
            subtitle: 'During Flooding',
            content: 'If flooding occurs during school hours:',
            steps: [
              'Move to higher floors immediately',
              'Avoid basements and low-lying areas',
              'Turn off electricity if safely possible',
              'Stay away from floodwater - it may be contaminated',
              'Wait for official evacuation instructions'
            ]
          },
          {
            subtitle: 'Water Safety',
            content: 'Never attempt to walk or drive through floodwater. Just 6 inches of flowing water can knock you down, and 12 inches can carry away vehicles.',
            steps: null
          }
        ]
      },
      hi: {
        title: 'बाढ़ की तैयारी और प्रतिक्रिया',
        sections: [
          {
            subtitle: 'बाढ़ के जोखिमों को समझना',
            content: 'भारी बारिश, बांध टूटने, या तूफान की लहरों के कारण बाढ़ आ सकती है। निचले इलाकों में या जल निकायों के पास के स्कूलों को अधिक जोखिम है।',
            steps: null
          },
          {
            subtitle: 'बाढ़ से पहले',
            content: 'तैयारी बाढ़ सुरक्षा की कुंजी है:',
            steps: [
              'मौसम चेतावनियों और अलर्ट पर नज़र रखें',
              'अपने स्कूल की बाढ़ निकासी योजना को जानें',
              'उच्च भूमि और सुरक्षित क्षेत्रों की पहचान करें',
              'आपातकालीन आपूर्ति को सुलभ रखें',
              'सुनिश्चित करें कि संचार प्रणालियां काम करती हैं'
            ]
          },
          {
            subtitle: 'बाढ़ के दौरान',
            content: 'यदि स्कूल के घंटों के दौरान बाढ़ आती है:',
            steps: [
              'तुरंत ऊपरी मंजिलों पर जाएं',
              'तहखाने और निचले इलाकों से बचें',
              'यदि सुरक्षित रूप से संभव हो तो बिजली बंद करें',
              'बाढ़ के पानी से दूर रहें - यह दूषित हो सकता है',
              'आधिकारिक निकासी निर्देशों की प्रतीक्षा करें'
            ]
          },
          {
            subtitle: 'जल सुरक्षा',
            content: 'कभी भी बाढ़ के पानी से चलने या गाड़ी चलाने की कोशिश न करें। बहते पानी के केवल 6 इंच आपको गिरा सकते हैं, और 12 इंच वाहनों को बहा सकते हैं।',
            steps: null
          }
        ]
      }
    },
    'cyclone-safety': {
      en: {
        title: 'Cyclone & Storm Safety',
        sections: [
          {
            subtitle: 'Cyclone Preparation',
            content: 'Cyclones bring dangerous winds, heavy rains, and storm surges. Coastal schools need specific preparedness measures.',
            steps: null
          },
          {
            subtitle: 'Before the Storm',
            content: 'When cyclone warnings are issued:',
            steps: [
              'Monitor official weather updates regularly',
              'Secure or remove loose objects outdoors',
              'Check and reinforce windows and doors',
              'Prepare emergency supplies and communication devices',
              'Review evacuation routes and shelter locations'
            ]
          },
          {
            subtitle: 'During the Cyclone',
            content: 'When the storm hits:',
            steps: [
              'Stay indoors in the safest room (interior, away from windows)',
              'Keep away from windows, glass doors, and skylights',
              'Listen to battery-powered radio for updates',
              'Do not go outside during the eye of the storm',
              'Stay indoors until authorities declare all-clear'
            ]
          },
          {
            subtitle: 'Post-Storm Safety',
            content: 'After the storm passes, be cautious of fallen power lines, damaged buildings, and contaminated water. Wait for official clearance before resuming normal activities.',
            steps: null
          }
        ]
      },
      hi: {
        title: 'चक्रवात और तूफान सुरक्षा',
        sections: [
          {
            subtitle: 'चक्रवात की तैयारी',
            content: 'चक्रवात खतरनाक हवाएं, भारी बारिश और तूफानी लहरें लाते हैं। तटीय स्कूलों को विशिष्ट तैयारी उपायों की आवश्यकता होती है।',
            steps: null
          },
          {
            subtitle: 'तूफान से पहले',
            content: 'जब चक्रवात चेतावनी जारी की जाती है:',
            steps: [
              'आधिकारिक मौसम अपडेट की नियमित निगरानी करें',
              'बाहर के ढीले वस्तुओं को सुरक्षित करें या हटा दें',
              'खिड़कियों और दरवाजों की जांच करें और मजबूत करें',
              'आपातकालीन आपूर्ति और संचार उपकरण तैयार करें',
              'निकासी मार्गों और आश्रय स्थानों की समीक्षा करें'
            ]
          },
          {
            subtitle: 'चक्रवात के दौरान',
            content: 'जब तूफान आता है:',
            steps: [
              'सबसे सुरक्षित कमरे में घर के अंदर रहें (अंदरूनी, खिड़कियों से दूर)',
              'खिड़कियों, कांच के दरवाजों और रोशनदानों से दूर रहें',
              'अपडेट के लिए बैटरी चालित रेडियो सुनें',
              'तूफान की आंख के दौरान बाहर न जाएं',
              'अधिकारी ऑल-क्लियर घोषित करने तक घर के अंदर रहें'
            ]
          },
          {
            subtitle: 'तूफान के बाद सुरक्षा',
            content: 'तूफान गुजरने के बाद, गिरी बिजली की लाइनों, क्षतिग्रस्त इमारतों और दूषित पानी से सावधान रहें। सामान्य गतिविधियों को फिर से शुरू करने से पहले आधिकारिक मंजूरी की प्रतीक्षा करें।',
            steps: null
          }
        ]
      }
    }
  };

  return detailedContent[contentId] ? detailedContent[contentId][lang] : null;
}
