import { Language } from '../types';

export interface TranslationDictionary {
  // Navigation & Branding
  appTitle: string;
  tagline: string;
  subtagline: string;
  home: string;
  practice: string;
  learn: string;
  challenges: string;
  myPrompts: string;
  about: string;
  login: string;
  signUp: string;
  logOut: string;
  dailyStreak: string;
  xp: string;
  profile: string;
  settings: string;
  startPracticing: string;
  explorePromptLab: string;
  continueAsGuest: string;

  // Practice Page
  currentLevel: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  beginnerDesc: string;
  intermediateDesc: string;
  advancedDesc: string;
  beginnerTip: string;
  intermediateTip: string;
  advancedTip: string;
  levelProgress: string;
  levelTasks: string;

  // Prompt Editor
  yourPrompt: string;
  promptPlaceholder: string;
  promptBuildingBlocks: string;
  role: string;
  task: string;
  context: string;
  tone: string;
  audience: string;
  constraints: string;
  format: string;
  examples: string;
  words: string;
  chars: string;
  promptQuality: string;
  aiPromptCoach: string;
  coachGeneralWarning: string;
  coachMissing: string;
  coachSuggestions: string;
  improveItForMe: string;
  generateOutput: string;
  generating: string;
  clear: string;
  templates: string;
  proExample: string;

  // AI Output Console
  aiOutput: string;
  create: string;
  text: string;
  image: string;
  video: string;
  ready: string;
  awaitingInput: string;
  copy: string;
  copied: string;
  regenerate: string;
  download: string;
  save: string;
  saved: string;
  copyPrompt: string;
  promptCopied: string;
  explainThisOutput: string;
  creatingImage: string;
  creatingVideo: string;
  imageUnavailableTitle: string;
  imageUnavailableDesc: string;
  videoUnavailableTitle: string;
  videoUnavailableDesc: string;
  limitReachedTitle: string;
  limitReachedDesc: string;
  errorTitle: string;
  errorDesc: string;
  retry: string;
  switchToText: string;
  generatedImage: string;
  generatedVideo: string;

  // Improve Prompt Section
  improvePrompt: string;
  improvePromptDesc: string;
  originalPrompt: string;
  improvedPrompt: string;
  whyThisIsBetter: string;
  generateImprovedOutput: string;
  editImprovedPrompt: string;

  // See The Difference
  seeTheDifference: string;
  comparisonSubtitle: string;
  initialPromptHeading: string;
  initialOutputHeading: string;
  refinedPromptHeading: string;
  refinedOutputHeading: string;
  whatChanged: string;

  // Output Breakdown Modal
  outputBreakdownTitle: string;
  whatAiUnderstood: string;
  instructionsFollowed: string;
  missingGuardrails: string;
  whyResultLooksThisWay: string;
  easyChanges: string;

  // Common
  close: string;
  loading: string;
  or: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appTitle: 'PromptLab',
    tagline: "Don't Just Use AI. Learn How to Talk to It.",
    subtagline: 'Practice prompting, create with AI, and improve your results.',
    home: 'Home',
    practice: 'Practice',
    learn: 'Learn',
    challenges: 'Challenges',
    myPrompts: 'My Prompts',
    about: 'About',
    login: 'Login',
    signUp: 'Sign Up',
    logOut: 'Log Out',
    dailyStreak: 'Daily Streak',
    xp: 'XP',
    profile: 'Profile',
    settings: 'Settings',
    startPracticing: '🚀 Start Practicing',
    explorePromptLab: '✨ Explore PromptLab',
    continueAsGuest: 'Continue as Guest',

    currentLevel: '🎯 Current Level',
    beginner: '🌱 Beginner',
    intermediate: '⚡ Intermediate',
    advanced: '🚀 Advanced',
    beginnerDesc: 'LEVEL 1 — BEGINNER 🌱: “Learn the basics of writing clear AI prompts.”',
    intermediateDesc: 'LEVEL 2 — INTERMEDIATE ⚡: “Create detailed prompts with context, tone and constraints.”',
    advancedDesc: 'LEVEL 3 — ADVANCED 🚀: “Build structured, precise prompts for complex AI tasks.”',
    beginnerTip: '💡 Tip: “Try adding what you want, who it is for, and how you want the answer.”',
    intermediateTip: '💡 Tip: “Include Role, Context, Audience, Tone, Constraints, and Output format.”',
    advancedTip: '💡 Tip: “Provide multi-step requirements, structured schemas, few-shot examples, and strict negative constraints.”',
    levelProgress: 'Level Progress',
    levelTasks: '🎯 Level Tasks (Click to load):',

    yourPrompt: '✍️ Your Prompt',
    promptPlaceholder: 'Example: A picture of delicious chicken biryani...',
    promptBuildingBlocks: '🪄 Prompt Building Blocks',
    role: '+ Role',
    task: '+ Task',
    context: '+ Context',
    tone: '+ Tone',
    audience: '+ Audience',
    constraints: '+ Constraints',
    format: '+ Format',
    examples: '+ Examples',
    words: 'words',
    chars: 'chars',
    promptQuality: '🧠 Prompt Quality',
    aiPromptCoach: '🧠 AI Prompt Coach',
    coachGeneralWarning: '💡 Your prompt is very general.',
    coachMissing: 'Missing:',
    coachSuggestions: 'Suggestions:',
    improveItForMe: '✨ Improve It For Me',
    generateOutput: '✨ Generate Output',
    generating: 'Generating AI Output...',
    clear: 'Clear',
    templates: 'Templates',
    proExample: 'Pro Example',

    aiOutput: '🤖 AI Output',
    create: 'CREATE:',
    text: '📝 Text',
    image: '🎨 Image',
    video: '🎬 Video',
    ready: '🟢 Ready',
    awaitingInput: 'Awaiting Input',
    copy: '📋 Copy',
    copied: 'Copied',
    regenerate: '🔄 Regenerate',
    download: '⬇️ Download',
    save: '⭐ Save',
    saved: '⭐ Saved!',
    copyPrompt: '📋 Copy Prompt',
    promptCopied: 'Prompt Copied',
    explainThisOutput: '🔍 Explain This Output',
    creatingImage: '🎨 Creating your image...',
    creatingVideo: '🎬 Creating your video...',
    imageUnavailableTitle: '⚠️ Image Generation Unavailable',
    imageUnavailableDesc: 'The selected generation service is not currently configured or has reached its available usage limit.',
    videoUnavailableTitle: '⚠️ Video Generation Unavailable',
    videoUnavailableDesc: 'The selected generation service is not currently configured or has reached its available usage limit.',
    limitReachedTitle: '⚠️ Generation Limit Reached',
    limitReachedDesc: 'The current generation service has reached its usage limit. Please try again later or use another available generation mode.',
    errorTitle: '⚠️ Something went wrong',
    errorDesc: 'Please try again later or use another available generation mode.',
    retry: '🔄 Retry',
    switchToText: '📝 Switch to Text',
    generatedImage: '🎨 Generated Image',
    generatedVideo: '🎬 Generated Video',

    improvePrompt: '✨ IMPROVE PROMPT',
    improvePromptDesc: 'Preserves your original intention while enriching context, parameters, and style.',
    originalPrompt: 'ORIGINAL PROMPT',
    improvedPrompt: 'IMPROVED PROMPT',
    whyThisIsBetter: '🧠 WHY THIS IS BETTER',
    generateImprovedOutput: '🚀 Generate Improved Output',
    editImprovedPrompt: '✏️ Edit Improved Prompt',

    seeTheDifference: '🔍 SEE THE DIFFERENCE',
    comparisonSubtitle: 'Observe how adding clarity, constraints, and tone directly elevates the AI’s response quality.',
    initialPromptHeading: 'Original Prompt',
    initialOutputHeading: 'Original Output',
    refinedPromptHeading: 'Improved Prompt',
    refinedOutputHeading: 'Improved Output',
    whatChanged: '📈 WHAT CHANGED?',

    outputBreakdownTitle: 'AI Output Breakdown',
    whatAiUnderstood: '1. What did AI understand?',
    instructionsFollowed: '2. Which parts of the prompt did AI follow?',
    missingGuardrails: '3. What was missing?',
    whyResultLooksThisWay: '4. Why the Output Looks the Way It Does',
    easyChanges: '5. How can you improve the result?',

    close: 'Close',
    loading: 'Loading...',
    or: 'or',
  },

  te: {
    appTitle: 'ప్రాంప్ట్‌ల్యాబ్',
    tagline: 'AI ని కేవలం వాడడమే కాదు. దానితో ఎలా మాట్లాడాలో నేర్చుకోండి.',
    subtagline: 'మంచి ప్రాంప్ట్‌లు రాయడం నేర్చుకోండి, AI ఫలితాలను అర్థం చేసుకోండి, మరియు సాధన ద్వారా ఫలితాలను మెరుగుపరచండి.',
    home: 'హోమ్',
    practice: 'ప్రాక్టీస్',
    learn: 'నేర్చుకోండి',
    challenges: 'చాలెంజ్లు',
    myPrompts: 'నా ప్రాంప్ట్లు',
    about: 'గురించి',
    login: 'లాగిన్',
    signUp: 'సైన్ అప్',
    logOut: 'లాగ్ అవుట్',
    dailyStreak: 'రోజువారీ స్ట్రీక్',
    xp: 'XP',
    profile: 'ప్రొఫైల్',
    settings: 'సెట్టింగ్స్',
    startPracticing: '🚀 సాధన ప్రారంభించండి',
    explorePromptLab: '✨ అన్వేషించండి',
    continueAsGuest: 'గెస్ట్‌గా ప్రాక్టీస్ చేయండి',

    currentLevel: '🎯 ప్రస్తుత స్థాయి',
    beginner: '🌱 బిగినర్',
    intermediate: '⚡ ఇంటర్మీడియట్',
    advanced: '🚀 అడ్వాన్స్డ్',
    beginnerDesc: 'స్థాయి 1 — బిగినర్ 🌱: “స్పష్టమైన AI ప్రాంప్ట్‌లు రాయడం నేర్చుకోండి.”',
    intermediateDesc: 'స్థాయి 2 — ఇంటర్మీడియట్ ⚡: “సందర్భం, టోన్ మరియు పరిమితులతో ప్రాంప్ట్‌లు రాయండి.”',
    advancedDesc: 'స్థాయి 3 — అడ్వాన్స్డ్ 🚀: “సంక్లిష్టమైన AI పనుల కోసం నిర్మాణాత్మక ప్రాంప్ట్‌లు రూపొందించండి.”',
    beginnerTip: '💡 చిట్కా: “మీకు ఏమి కావాలో, ఎవరి కోసమో, ఎలాంటి సమాధానం కావాలో స్పష్టంగా రాయండి.”',
    intermediateTip: '💡 చిట్కా: “రోల్, నేపథ్యం, ప్రేక్షకులు, మరియు అవుట్‌పుట్ ఫార్మాట్‌ను జోడించండి.”',
    advancedTip: '💡 చిట్కా: “మల్టీ-స్టెప్ నియమాలు, నమూనా ఉదాహరణలు, మరియు కచ్చితమైన పరిమితులను ఇవ్వండి.”',
    levelProgress: 'స్థాయి పురోగతి',
    levelTasks: '🎯 స్థాయి పనులు (లోడ్ చేయడానికి క్లిక్ చేయండి):',

    yourPrompt: 'మీ ప్రాంప్ట్',
    promptPlaceholder: 'ఉదాహరణ: రుచికరమైన చికెన్ బిర్యానీ చిత్రం...',
    promptBuildingBlocks: '🪄 ప్రాంప్ట్ బిల్డింగ్ బ్లాక్స్',
    role: '+ రోల్',
    task: '+ టాస్క్',
    context: '+ సందర్భం',
    tone: '+ టోన్',
    audience: '+ ప్రేక్షకులు',
    constraints: '+ పరిమితులు',
    format: '+ ఫార్మాట్',
    examples: '+ ఉదాహరణలు',
    words: 'పదాలు',
    chars: 'అక్షరాలు',
    promptQuality: 'ప్రాంప్ట్ నాణ్యత',
    aiPromptCoach: '🧠 AI ప్రాంప్ట్ కోచ్',
    coachGeneralWarning: '💡 మీ ప్రాంప్ట్ చాలా సాధారణంగా ఉంది. మరిన్ని వివరాలను జోడిస్తే మంచి ఫలితం వస్తుంది.',
    coachMissing: 'లోపించినవి:',
    coachSuggestions: 'సూచనలు:',
    improveItForMe: '✨ నా కోసం మెరుగుపరచండి',
    generateOutput: 'అవుట్పుట్ రూపొందించండి',
    generating: 'AI అవుట్‌పుట్ రూపొందిస్తోంది...',
    clear: 'క్లియర్',
    templates: 'టెంప్లేట్లు',
    proExample: 'ప్రో ఉదాహరణ',

    aiOutput: 'AI అవుట్పుట్',
    create: 'సృష్టించండి:',
    text: 'టెక్స్ట్',
    image: 'ఇమేజ్',
    video: 'వీడియో',
    ready: '🟢 సిద్ధంగా ఉంది',
    awaitingInput: 'ప్రాంప్ట్ కోసం వేచి ఉంది',
    copy: 'కాపీ చేయండి',
    copied: 'కాపీ చేయబడింది',
    regenerate: 'మళ్లీ రూపొందించండి',
    download: 'డౌన్లోడ్',
    save: 'సేవ్ చేయండి',
    saved: '⭐ సేవ్ చేయబడింది!',
    copyPrompt: '📋 ప్రాంప్ట్ కాపీ చేయండి',
    promptCopied: 'ప్రాంప్ట్ కాపీ చేయబడింది',
    explainThisOutput: '🔍 ఈ ఫలితాన్ని వివరించండి',
    creatingImage: '🎨 మీ చిత్రాన్ని రూపొందిస్తోంది...',
    creatingVideo: '🎬 మీ వీడియోను రూపొందిస్తోంది...',
    imageUnavailableTitle: '⚠️ ఇమేజ్ జనరేషన్ అందుబాటులో లేదు',
    imageUnavailableDesc: 'ఎంచుకున్న జనరేషన్ సేవ ప్రస్తుతం కాన్ఫిగర్ చేయబడలేదు లేదా దాని వినియోగ పరిమితిని చేరుకుంది.',
    videoUnavailableTitle: '⚠️ వీడియో జనరేషన్ అందుబాటులో లేదు',
    videoUnavailableDesc: 'ఎంచుకున్న జనరేషన్ సేవ ప్రస్తుతం కాన్ఫిగర్ చేయబడలేదు లేదా దాని వినియోగ పరిమితిని చేరుకుంది.',
    limitReachedTitle: '⚠️ జనరేషన్ పరిమితి ముగిసింది',
    limitReachedDesc: 'ప్రస్తుత జనరేషన్ సేవ దాని వినియోగ పరిమితిని చేరుకుంది. దయచేసి కాసేపటి తర్వాత ప్రయత్నించండి లేదా అందుబాటులో ఉన్న ఇతర మోడ్‌ను ఉపయోగించండి.',
    errorTitle: '⚠️ ఏదో తప్పు జరిగింది',
    errorDesc: 'దయచేసి కాసేపటి తర్వాత ప్రయత్నించండి లేదా మరొక మోడ్‌ను ఎంచుకోండి.',
    retry: '🔄 మళ్లీ ప్రయత్నించండి',
    switchToText: '📝 టెక్స్ట్‌కి మారండి',
    generatedImage: '🎨 రూపొందించిన చిత్రం',
    generatedVideo: '🎬 రూపొందించిన వీడియో',

    improvePrompt: 'ప్రాంప్ట్ను మెరుగుపరచండి',
    improvePromptDesc: 'మీ ఉద్దేశ్యాన్ని కాపాడుతూనే సందర్భం, శైలి మరియు నాణ్యతను పెంచుతుంది.',
    originalPrompt: 'అసలు ప్రాంప్ట్',
    improvedPrompt: 'మెరుగుపరచబడిన ప్రాంప్ట్',
    whyThisIsBetter: '🧠 ఇది ఎందుకు మెరుగైనది',
    generateImprovedOutput: '🚀 మెరుగైన ఫలితాన్ని రూపొందించండి',
    editImprovedPrompt: '✏️ ప్రాంప్ట్‌ను సవరించండి',

    seeTheDifference: '🔍 తేడాను గమనించండి (SEE THE DIFFERENCE)',
    comparisonSubtitle: 'స్పష్టమైన సూచనలు AI నాణ్యతను ఎలా పెంచుతాయో సరిపోల్చి చూడండి.',
    initialPromptHeading: 'అసలు ప్రాంప్ట్',
    initialOutputHeading: 'మొదటి AI అవుట్‌పుట్',
    refinedPromptHeading: 'మెరుగుపరచబడిన ప్రాంప్ట్',
    refinedOutputHeading: 'మెరుగైన AI అవుట్‌పుట్',
    whatChanged: '📈 ఏమి మారింది?',

    outputBreakdownTitle: 'AI ఫలితం వివరణ',
    whatAiUnderstood: '1. AI ఏమి అర్థం చేసుకుంది?',
    instructionsFollowed: '2. ప్రాంప్ట్‌లోని ఏ సూచనలను AI అనుసరించింది?',
    missingGuardrails: '3. ఏమి లోపించింది?',
    whyResultLooksThisWay: '4. ఫలితం ఇలా ఎందుకు వచ్చింది?',
    easyChanges: '5. ఫలితాన్ని ఎలా మెరుగుపరచవచ్చు?',

    close: 'మూసివేయి',
    loading: 'లోడ్ అవుతోంది...',
    or: 'లేదా',
  },

  hi: {
    appTitle: 'प्रॉम्प्टलैब',
    tagline: 'सिर्फ AI का उपयोग न करें। इससे बात करना सीखें।',
    subtagline: 'प्रॉम्प्ट लिखना सीखें, AI के साथ बनाएं, और अपने परिणामों को सुधारें।',
    home: 'होम',
    practice: 'प्रैक्टिस',
    learn: 'सीखें',
    challenges: 'चैलेंज',
    myPrompts: 'मेरे प्रॉम्प्ट',
    about: 'अबाउट',
    login: 'लॉगिन',
    signUp: 'साइन अप',
    logOut: 'लॉग आउट',
    dailyStreak: 'डेली स्ट्रीक',
    xp: 'XP',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्स',
    startPracticing: '🚀 अभ्यास शुरू करें',
    explorePromptLab: '✨ प्रॉम्प्टलैब देखें',
    continueAsGuest: 'अतिथि के रूप में जारी रखें',

    currentLevel: '🎯 वर्तमान स्तर',
    beginner: '🌱 शुरुआती',
    intermediate: '⚡ इंटरमीडिएट',
    advanced: '🚀 एडवांस्ड',
    beginnerDesc: 'स्तर 1 — शुरुआती 🌱: “स्पष्ट AI प्रॉम्प्ट लिखने की मूल बातें सीखें।”',
    intermediateDesc: 'स्तर 2 — इंटरमीडिएट ⚡: “संदर्भ, टोन और सीमाओं के साथ विस्तृत प्रॉम्प्ट बनाएं।”',
    advancedDesc: 'स्तर 3 — एडवांस्ड 🚀: “जटिल कार्यों के लिए संरचित और सटीक प्रॉम्प्ट बनाएं।”',
    beginnerTip: '💡 सुझाव: “बताएं कि आपको क्या चाहिए, यह किसके लिए है, और कैसा उत्तर चाहते हैं।”',
    intermediateTip: '💡 सुझाव: “भूमिका (Role), संदर्भ, लक्षित दर्शक, और आउटपुट प्रारूप जोड़ें।”',
    advancedTip: '💡 सुझाव: “बहु-चरणीय निर्देश, संरचित प्रारूप, और संदर्भ उदाहरण शामिल करें।”',
    levelProgress: 'स्तर प्रगति',
    levelTasks: '🎯 स्तर के अभ्यास कार्य (क्लिक करके लोड करें):',

    yourPrompt: 'आपका प्रॉम्प्ट',
    promptPlaceholder: 'उदाहरण: स्वादिष्ट चिकन बिरयानी की एक तस्वीर...',
    promptBuildingBlocks: '🪄 प्रॉम्प्ट बिल्डिंग ब्लॉक्स',
    role: '+ भूमिका (Role)',
    task: '+ कार्य (Task)',
    context: '+ संदर्भ (Context)',
    tone: '+ टोन (Tone)',
    audience: '+ दर्शक (Audience)',
    constraints: '+ सीमाएं (Limits)',
    format: '+ प्रारूप (Format)',
    examples: '+ उदाहरण (Examples)',
    words: 'शब्द',
    chars: 'अक्षर',
    promptQuality: 'प्रॉम्प्ट गुणवत्ता',
    aiPromptCoach: '🧠 AI प्रॉम्प्ट कोच',
    coachGeneralWarning: '💡 आपका प्रॉम्प्ट बहुत सामान्य है। अधिक विवरण जोड़ने से बेहतर परिणाम मिलेगा।',
    coachMissing: 'अनुपस्थित घटक:',
    coachSuggestions: 'सुझाव:',
    improveItForMe: '✨ मेरे लिए इसे सुधारें',
    generateOutput: 'आउटपुट जनरेट करें',
    generating: 'AI आउटपुट जनरेट कर रहा है...',
    clear: 'साफ़ करें',
    templates: 'टेम्प्लेट',
    proExample: 'प्रो उदाहरण',

    aiOutput: 'AI आउटपुट',
    create: 'सृजन करें:',
    text: 'टेक्स्ट',
    image: 'इमेज',
    video: 'वीडियो',
    ready: '🟢 तैयार',
    awaitingInput: 'प्रॉम्प्ट की प्रतीक्षा है',
    copy: 'कॉपी करें',
    copied: 'कॉपी हो गया',
    regenerate: 'फिर से जनरेट करें',
    download: 'डाउनलोड',
    save: 'सेव करें',
    saved: '⭐ सेव हो गया!',
    copyPrompt: '📋 प्रॉम्प्ट कॉपी करें',
    promptCopied: 'प्रॉम्प्ट कॉपी हो गया',
    explainThisOutput: '🔍 इस आउटपुट को समझें',
    creatingImage: '🎨 आपकी छवि बनाई जा रही है...',
    creatingVideo: '🎬 आपका वीडियो बनाया जा रहा है...',
    imageUnavailableTitle: '⚠️ इमेज जनरेशन अनुपलब्ध',
    imageUnavailableDesc: 'चयनित जनरेशन सेवा वर्तमान में कॉन्फ़िगर नहीं है या अपनी उपयोग सीमा तक पहुँच गई है।',
    videoUnavailableTitle: '⚠️ वीडियो जनरेशन अनुपलब्ध',
    videoUnavailableDesc: 'चयनित जनरेशन सेवा वर्तमान में कॉन्फ़िगर नहीं है या अपनी उपयोग सीमा तक पहुँच गई है।',
    limitReachedTitle: '⚠️ जनरेशन सीमा समाप्त',
    limitReachedDesc: 'वर्तमान जनरेशन सेवा अपनी उपयोग सीमा तक पहुँच गई है। कृपया बाद में पुनः प्रयास करें या किसी अन्य उपलब्ध मोड का उपयोग करें।',
    errorTitle: '⚠️ कुछ गलत हो गया',
    errorDesc: 'कृपया बाद में पुनः प्रयास करें या किसी अन्य मोड का उपयोग करें।',
    retry: '🔄 पुनः प्रयास करें',
    switchToText: '📝 टेक्स्ट पर स्विच करें',
    generatedImage: '🎨 जनरेट की गई छवि',
    generatedVideo: '🎬 जनरेट किया गया वीडियो',

    improvePrompt: 'प्रॉम्प्ट सुधारें',
    improvePromptDesc: 'आपके मूल उद्देश्य को बनाए रखते हुए संदर्भ, शैली और सटीकता को समृद्ध करता है।',
    originalPrompt: 'मूल प्रॉम्प्ट',
    improvedPrompt: 'सुधारा हुआ प्रॉम्प्ट',
    whyThisIsBetter: '🧠 यह बेहतर क्यों है',
    generateImprovedOutput: '🚀 सुधरा हुआ आउटपुट जनरेट करें',
    editImprovedPrompt: '✏️ सुधारे हुए प्रॉम्प्ट को संपादित करें',

    seeTheDifference: '🔍 अंतर देखें (SEE THE DIFFERENCE)',
    comparisonSubtitle: 'तुलना करें कि कैसे स्पष्ट निर्देश AI के उत्तर की गुणवत्ता को तुरंत बढ़ाते हैं।',
    initialPromptHeading: 'मूल प्रॉम्प्ट',
    initialOutputHeading: 'प्रारंभिक AI आउटपुट',
    refinedPromptHeading: 'सुधारा हुआ प्रॉम्प्ट',
    refinedOutputHeading: 'बेहतर AI आउटपुट',
    whatChanged: '📈 क्या बदला?',

    outputBreakdownTitle: 'AI आउटपुट विश्लेषण',
    whatAiUnderstood: '1. AI ने क्या समझा?',
    instructionsFollowed: '2. प्रॉम्प्ट के किन निर्देशों का पालन हुआ?',
    missingGuardrails: '3. क्या छूट गया था?',
    whyResultLooksThisWay: '4. आउटपुट ऐसा क्यों दिखता है?',
    easyChanges: '5. परिणाम को और कैसे बेहतर बना सकते हैं?',

    close: 'बंद करें',
    loading: 'लोड हो रहा है...',
    or: 'या',
  },
};

export function getTranslation(lang: Language): TranslationDictionary {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
