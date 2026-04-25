import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Language } from "../types";

type TranslationKey =
  | "nav.dashboard"
  | "nav.detection"
  | "nav.history"
  | "nav.shop"
  | "nav.seeds"
  | "nav.weather"
  | "nav.orders"
  | "nav.settings"
  | "app.name"
  | "app.tagline"
  | "auth.signin"
  | "auth.signout"
  | "auth.signinWith"
  | "dashboard.title"
  | "dashboard.subtitle"
  | "dashboard.recentDiagnoses"
  | "dashboard.activeOrders"
  | "dashboard.weatherAlert"
  | "dashboard.quickActions"
  | "dashboard.stat.totalDiagnoses"
  | "dashboard.stat.pendingOrders"
  | "dashboard.stat.availablePesticides"
  | "dashboard.stat.activeSeeds"
  | "detect.title"
  | "detect.subtitle"
  | "detect.uploadPrompt"
  | "detect.analyzing"
  | "detect.result"
  | "detect.confidence"
  | "detect.severity"
  | "detect.treatment"
  | "detect.symptoms"
  | "detect.pesticide"
  | "detect.fertilizer"
  | "detect.consultExpert"
  | "history.title"
  | "history.empty"
  | "history.deleteConfirm"
  | "shop.title"
  | "shop.addToCart"
  | "shop.cart"
  | "shop.checkout"
  | "shop.total"
  | "shop.category"
  | "shop.inStock"
  | "shop.outOfStock"
  | "shop.qty"
  | "seeds.title"
  | "seeds.search"
  | "seeds.batchNumber"
  | "seeds.germination"
  | "seeds.purity"
  | "seeds.grade"
  | "seeds.healthStatus"
  | "seeds.manufacturer"
  | "weather.title"
  | "weather.temperature"
  | "weather.humidity"
  | "weather.rainfall"
  | "weather.windSpeed"
  | "weather.advisory"
  | "weather.forecast"
  | "orders.title"
  | "orders.empty"
  | "orders.status"
  | "orders.total"
  | "orders.date"
  | "orders.address"
  | "orders.items"
  | "settings.title"
  | "settings.language"
  | "settings.account"
  | "settings.logout"
  | "settings.deleteAccount"
  | "settings.deleteConfirm"
  | "common.loading"
  | "common.error"
  | "common.retry"
  | "common.save"
  | "common.cancel"
  | "common.delete"
  | "common.confirm"
  | "common.back"
  | "common.search"
  | "common.filter"
  | "common.noResults"
  | "common.viewAll"
  | "common.close"
  | "common.submit"
  | "offline.banner"
  | "severity.low"
  | "severity.moderate"
  | "severity.high"
  | "severity.critical";

type Translations = Record<TranslationKey, string>;

const translations: Record<Language, Translations> = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.detection": "Crop Detection",
    "nav.history": "Diagnosis History",
    "nav.shop": "Pesticide Shop",
    "nav.seeds": "Seed Verification",
    "nav.weather": "Weather",
    "nav.orders": "My Orders",
    "nav.settings": "Settings",
    "app.name": "AgriShield AI",
    "app.tagline": "Smart Crop Health Platform",
    "auth.signin": "Sign In",
    "auth.signout": "Sign Out",
    "auth.signinWith": "Sign in with Internet Identity",
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Monitor your crop health at a glance",
    "dashboard.recentDiagnoses": "Recent Diagnoses",
    "dashboard.activeOrders": "Active Orders",
    "dashboard.weatherAlert": "Weather Alert",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.stat.totalDiagnoses": "Total Diagnoses",
    "dashboard.stat.pendingOrders": "Pending Orders",
    "dashboard.stat.availablePesticides": "Available Pesticides",
    "dashboard.stat.activeSeeds": "Active Seeds",
    "detect.title": "Crop Detection",
    "detect.subtitle": "Upload a photo to diagnose your crop",
    "detect.uploadPrompt": "Drop image here or click to upload",
    "detect.analyzing": "Analyzing crop...",
    "detect.result": "Diagnosis Result",
    "detect.confidence": "Confidence",
    "detect.severity": "Severity",
    "detect.treatment": "Treatment",
    "detect.symptoms": "Symptoms",
    "detect.pesticide": "Pesticide Recommendation",
    "detect.fertilizer": "Fertilizer Recommendation",
    "detect.consultExpert": "Consult an Expert",
    "history.title": "Diagnosis History",
    "history.empty": "No diagnoses yet. Start by scanning a crop.",
    "history.deleteConfirm": "Delete this diagnosis?",
    "shop.title": "Pesticide Shop",
    "shop.addToCart": "Add to Cart",
    "shop.cart": "Cart",
    "shop.checkout": "Checkout",
    "shop.total": "Total",
    "shop.category": "Category",
    "shop.inStock": "In Stock",
    "shop.outOfStock": "Out of Stock",
    "shop.qty": "Qty",
    "seeds.title": "Seed Verification",
    "seeds.search": "Search batch number...",
    "seeds.batchNumber": "Batch Number",
    "seeds.germination": "Germination Rate",
    "seeds.purity": "Purity",
    "seeds.grade": "Quality Grade",
    "seeds.healthStatus": "Health Status",
    "seeds.manufacturer": "Manufacturer",
    "weather.title": "Weather Insights",
    "weather.temperature": "Temperature",
    "weather.humidity": "Humidity",
    "weather.rainfall": "Rainfall",
    "weather.windSpeed": "Wind Speed",
    "weather.advisory": "Farming Advisory",
    "weather.forecast": "7-Day Forecast",
    "orders.title": "My Orders",
    "orders.empty": "No orders yet. Shop for pesticides to get started.",
    "orders.status": "Status",
    "orders.total": "Total",
    "orders.date": "Order Date",
    "orders.address": "Delivery Address",
    "orders.items": "Items",
    "settings.title": "Settings",
    "settings.language": "Language",
    "settings.account": "Account",
    "settings.logout": "Logout",
    "settings.deleteAccount": "Delete Account",
    "settings.deleteConfirm": "Are you sure? This action cannot be undone.",
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.retry": "Retry",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.confirm": "Confirm",
    "common.back": "Back",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.noResults": "No results found",
    "common.viewAll": "View All",
    "common.close": "Close",
    "common.submit": "Submit",
    "offline.banner": "You're offline. Some features may be limited.",
    "severity.low": "Low",
    "severity.moderate": "Moderate",
    "severity.high": "High",
    "severity.critical": "Critical",
  },
  hi: {
    "nav.dashboard": "डैशबोर्ड",
    "nav.detection": "फसल जांच",
    "nav.history": "निदान इतिहास",
    "nav.shop": "कीटनाशक दुकान",
    "nav.seeds": "बीज सत्यापन",
    "nav.weather": "मौसम",
    "nav.orders": "मेरे ऑर्डर",
    "nav.settings": "सेटिंग्स",
    "app.name": "एग्रीशील्ड AI",
    "app.tagline": "स्मार्ट फसल स्वास्थ्य प्लेटफॉर्म",
    "auth.signin": "साइन इन",
    "auth.signout": "साइन आउट",
    "auth.signinWith": "इंटरनेट आइडेंटिटी से साइन इन करें",
    "dashboard.title": "डैशबोर्ड",
    "dashboard.subtitle": "अपनी फसल स्वास्थ्य पर नज़र रखें",
    "dashboard.recentDiagnoses": "हाल के निदान",
    "dashboard.activeOrders": "सक्रिय ऑर्डर",
    "dashboard.weatherAlert": "मौसम चेतावनी",
    "dashboard.quickActions": "त्वरित क्रियाएं",
    "dashboard.stat.totalDiagnoses": "कुल निदान",
    "dashboard.stat.pendingOrders": "लंबित ऑर्डर",
    "dashboard.stat.availablePesticides": "उपलब्ध कीटनाशक",
    "dashboard.stat.activeSeeds": "सक्रिय बीज",
    "detect.title": "फसल जांच",
    "detect.subtitle": "अपनी फसल का निदान करने के लिए फोटो अपलोड करें",
    "detect.uploadPrompt": "यहाँ छवि डालें या अपलोड करने के लिए क्लिक करें",
    "detect.analyzing": "फसल का विश्लेषण...",
    "detect.result": "निदान परिणाम",
    "detect.confidence": "विश्वास",
    "detect.severity": "गंभीरता",
    "detect.treatment": "उपचार",
    "detect.symptoms": "लक्षण",
    "detect.pesticide": "कीटनाशक सुझाव",
    "detect.fertilizer": "उर्वरक सुझाव",
    "detect.consultExpert": "विशेषज्ञ से परामर्श करें",
    "history.title": "निदान इतिहास",
    "history.empty": "अभी तक कोई निदान नहीं। फसल स्कैन करके शुरू करें।",
    "history.deleteConfirm": "यह निदान हटाएं?",
    "shop.title": "कीटनाशक दुकान",
    "shop.addToCart": "कार्ट में जोड़ें",
    "shop.cart": "कार्ट",
    "shop.checkout": "चेकआउट",
    "shop.total": "कुल",
    "shop.category": "श्रेणी",
    "shop.inStock": "स्टॉक में",
    "shop.outOfStock": "स्टॉक में नहीं",
    "shop.qty": "मात्रा",
    "seeds.title": "बीज सत्यापन",
    "seeds.search": "बैच नंबर खोजें...",
    "seeds.batchNumber": "बैच नंबर",
    "seeds.germination": "अंकुरण दर",
    "seeds.purity": "शुद्धता",
    "seeds.grade": "गुणवत्ता ग्रेड",
    "seeds.healthStatus": "स्वास्थ्य स्थिति",
    "seeds.manufacturer": "निर्माता",
    "weather.title": "मौसम जानकारी",
    "weather.temperature": "तापमान",
    "weather.humidity": "आर्द्रता",
    "weather.rainfall": "वर्षा",
    "weather.windSpeed": "हवा की गति",
    "weather.advisory": "खेती सलाह",
    "weather.forecast": "7 दिन का पूर्वानुमान",
    "orders.title": "मेरे ऑर्डर",
    "orders.empty": "अभी तक कोई ऑर्डर नहीं। शुरू करने के लिए कीटनाशक खरीदें।",
    "orders.status": "स्थिति",
    "orders.total": "कुल",
    "orders.date": "ऑर्डर तिथि",
    "orders.address": "डिलीवरी पता",
    "orders.items": "आइटम",
    "settings.title": "सेटिंग्स",
    "settings.language": "भाषा",
    "settings.account": "खाता",
    "settings.logout": "लॉगआउट",
    "settings.deleteAccount": "खाता हटाएं",
    "settings.deleteConfirm": "क्या आप सुनिश्चित हैं? यह क्रिया वापस नहीं हो सकती।",
    "common.loading": "लोड हो रहा है...",
    "common.error": "कुछ गलत हुआ",
    "common.retry": "पुनः प्रयास",
    "common.save": "सहेजें",
    "common.cancel": "रद्द करें",
    "common.delete": "हटाएं",
    "common.confirm": "पुष्टि करें",
    "common.back": "वापस",
    "common.search": "खोज",
    "common.filter": "फ़िल्टर",
    "common.noResults": "कोई परिणाम नहीं",
    "common.viewAll": "सभी देखें",
    "common.close": "बंद करें",
    "common.submit": "जमा करें",
    "offline.banner": "आप ऑफलाइन हैं। कुछ सुविधाएं सीमित हो सकती हैं।",
    "severity.low": "कम",
    "severity.moderate": "मध्यम",
    "severity.high": "उच्च",
    "severity.critical": "गंभीर",
  },
  ta: {
    "nav.dashboard": "டாஷ்போர்டு",
    "nav.detection": "பயிர் கண்டறிதல்",
    "nav.history": "நோயறிதல் வரலாறு",
    "nav.shop": "பூச்சிக்கொல்லி கடை",
    "nav.seeds": "விதை சரிபார்ப்பு",
    "nav.weather": "வானிலை",
    "nav.orders": "என் ஆர்டர்கள்",
    "nav.settings": "அமைப்புகள்",
    "app.name": "அக்ரிஷீல்ட் AI",
    "app.tagline": "ஸ்மார்ட் பயிர் ஆரோக்கிய தளம்",
    "auth.signin": "உள்நுழை",
    "auth.signout": "வெளியேறு",
    "auth.signinWith": "இணைய அடையாளத்தில் உள்நுழையுங்கள்",
    "dashboard.title": "டாஷ்போர்டு",
    "dashboard.subtitle": "உங்கள் பயிர் ஆரோக்கியத்தை கண்காணிக்கவும்",
    "dashboard.recentDiagnoses": "சமீபத்திய நோயறிதல்கள்",
    "dashboard.activeOrders": "செயலில் உள்ள ஆர்டர்கள்",
    "dashboard.weatherAlert": "வானிலை எச்சரிக்கை",
    "dashboard.quickActions": "விரைவு செயல்கள்",
    "dashboard.stat.totalDiagnoses": "மொத்த நோயறிதல்கள்",
    "dashboard.stat.pendingOrders": "நிலுவையில் உள்ள ஆர்டர்கள்",
    "dashboard.stat.availablePesticides": "கிடைக்கும் பூச்சிக்கொல்லிகள்",
    "dashboard.stat.activeSeeds": "செயலில் உள்ள விதைகள்",
    "detect.title": "பயிர் கண்டறிதல்",
    "detect.subtitle": "உங்கள் பயிரை நோயறிய ஒரு புகைப்படம் பதிவேற்றுங்கள்",
    "detect.uploadPrompt": "படத்தை இங்கே இழுக்கவும் அல்லது பதிவேற்ற கிளிக் செய்யுங்கள்",
    "detect.analyzing": "பயிரை ஆய்வு செய்கிறது...",
    "detect.result": "நோயறிதல் முடிவு",
    "detect.confidence": "நம்பகத்தன்மை",
    "detect.severity": "தீவிரம்",
    "detect.treatment": "சிகிச்சை",
    "detect.symptoms": "அறிகுறிகள்",
    "detect.pesticide": "பூச்சிக்கொல்லி பரிந்துரை",
    "detect.fertilizer": "உரம் பரிந்துரை",
    "detect.consultExpert": "நிபுணரை கலந்தாலோசிக்கவும்",
    "history.title": "நோயறிதல் வரலாறு",
    "history.empty": "இன்னும் நோயறிதல் இல்லை. ஒரு பயிரை ஸ்கேன் செய்யுங்கள்.",
    "history.deleteConfirm": "இந்த நோயறிதலை நீக்கவா?",
    "shop.title": "பூச்சிக்கொல்லி கடை",
    "shop.addToCart": "கூடையில் சேர்",
    "shop.cart": "கூடை",
    "shop.checkout": "செலுத்து",
    "shop.total": "மொத்தம்",
    "shop.category": "வகை",
    "shop.inStock": "கையிருப்பில்",
    "shop.outOfStock": "கையிருப்பில் இல்லை",
    "shop.qty": "அளவு",
    "seeds.title": "விதை சரிபார்ப்பு",
    "seeds.search": "தொகுதி எண் தேடுங்கள்...",
    "seeds.batchNumber": "தொகுதி எண்",
    "seeds.germination": "முளைப்பு விகிதம்",
    "seeds.purity": "தூய்மை",
    "seeds.grade": "தர நிலை",
    "seeds.healthStatus": "ஆரோக்கிய நிலை",
    "seeds.manufacturer": "உற்பத்தியாளர்",
    "weather.title": "வானிலை நுண்ணறிவு",
    "weather.temperature": "வெப்பநிலை",
    "weather.humidity": "ஈரப்பதம்",
    "weather.rainfall": "மழைப்பொழிவு",
    "weather.windSpeed": "காற்று வேகம்",
    "weather.advisory": "விவசாய ஆலோசனை",
    "weather.forecast": "7 நாள் முன்னறிவிப்பு",
    "orders.title": "என் ஆர்டர்கள்",
    "orders.empty": "இன்னும் ஆர்டர்கள் இல்லை. பூச்சிக்கொல்லி வாங்குங்கள்.",
    "orders.status": "நிலை",
    "orders.total": "மொத்தம்",
    "orders.date": "ஆர்டர் தேதி",
    "orders.address": "டெலிவரி முகவரி",
    "orders.items": "பொருட்கள்",
    "settings.title": "அமைப்புகள்",
    "settings.language": "மொழி",
    "settings.account": "கணக்கு",
    "settings.logout": "வெளியேறு",
    "settings.deleteAccount": "கணக்கை நீக்கு",
    "settings.deleteConfirm": "நீங்கள் உறுதியா? இந்த செயலை மாற்ற முடியாது.",
    "common.loading": "ஏற்றுகிறது...",
    "common.error": "ஏதோ தவறு நடந்தது",
    "common.retry": "மீண்டும் முயற்சி",
    "common.save": "சேமி",
    "common.cancel": "ரத்து செய்",
    "common.delete": "நீக்கு",
    "common.confirm": "உறுதிப்படுத்து",
    "common.back": "திரும்பு",
    "common.search": "தேடு",
    "common.filter": "வடிகட்டு",
    "common.noResults": "முடிவுகள் இல்லை",
    "common.viewAll": "அனைத்தையும் காண்",
    "common.close": "மூடு",
    "common.submit": "சமர்ப்பி",
    "offline.banner": "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். சில அம்சங்கள் கட்டுப்படுத்தப்படலாம்.",
    "severity.low": "குறைவு",
    "severity.moderate": "மிதமான",
    "severity.high": "அதிகம்",
    "severity.critical": "மிகவும் தீவிரம்",
  },
  te: {
    "nav.dashboard": "డ్యాష్‌బోర్డ్",
    "nav.detection": "పంట గుర్తింపు",
    "nav.history": "రోగనిర్ధారణ చరిత్ర",
    "nav.shop": "పురుగుమందుల దుకాణం",
    "nav.seeds": "విత్తన ధృవీకరణ",
    "nav.weather": "వాతావరణం",
    "nav.orders": "నా ఆర్డర్లు",
    "nav.settings": "సెట్టింగ్స్",
    "app.name": "అగ్రీషీల్డ్ AI",
    "app.tagline": "స్మార్ట్ పంట ఆరోగ్య వేదిక",
    "auth.signin": "సైన్ ఇన్",
    "auth.signout": "సైన్ అవుట్",
    "auth.signinWith": "ఇంటర్నెట్ ఐడెంటిటీతో సైన్ ఇన్",
    "dashboard.title": "డ్యాష్‌బోర్డ్",
    "dashboard.subtitle": "మీ పంట ఆరోగ్యాన్ని పర్యవేక్షించండి",
    "dashboard.recentDiagnoses": "ఇటీవలి రోగనిర్ధారణలు",
    "dashboard.activeOrders": "క్రియాశీల ఆర్డర్లు",
    "dashboard.weatherAlert": "వాతావరణ హెచ్చరిక",
    "dashboard.quickActions": "శీఘ్ర చర్యలు",
    "dashboard.stat.totalDiagnoses": "మొత్తం రోగనిర్ధారణలు",
    "dashboard.stat.pendingOrders": "పెండింగ్ ఆర్డర్లు",
    "dashboard.stat.availablePesticides": "అందుబాటులో ఉన్న పురుగుమందులు",
    "dashboard.stat.activeSeeds": "క్రియాశీల విత్తనాలు",
    "detect.title": "పంట గుర్తింపు",
    "detect.subtitle": "మీ పంటను నిర్ధారించడానికి ఫోటో అప్‌లోడ్ చేయండి",
    "detect.uploadPrompt": "ఇక్కడ చిత్రాన్ని వదలండి లేదా అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి",
    "detect.analyzing": "పంటను విశ్లేషిస్తోంది...",
    "detect.result": "రోగనిర్ధారణ ఫలితం",
    "detect.confidence": "విశ్వాసం",
    "detect.severity": "తీవ్రత",
    "detect.treatment": "చికిత్స",
    "detect.symptoms": "లక్షణాలు",
    "detect.pesticide": "పురుగుమందు సిఫారసు",
    "detect.fertilizer": "ఎరువు సిఫారసు",
    "detect.consultExpert": "నిపుణుడిని సంప్రదించండి",
    "history.title": "రోగనిర్ధారణ చరిత్ర",
    "history.empty": "ఇంకా రోగనిర్ధారణ లేదు. పంటను స్కాన్ చేయడం ద్వారా ప్రారంభించండి.",
    "history.deleteConfirm": "ఈ రోగనిర్ధారణను తొలగించాలా?",
    "shop.title": "పురుగుమందుల దుకాణం",
    "shop.addToCart": "కార్ట్‌కు జోడించు",
    "shop.cart": "కార్ట్",
    "shop.checkout": "చెక్అవుట్",
    "shop.total": "మొత్తం",
    "shop.category": "వర్గం",
    "shop.inStock": "స్టాక్‌లో ఉంది",
    "shop.outOfStock": "స్టాక్ అయిపోయింది",
    "shop.qty": "పరిమాణం",
    "seeds.title": "విత్తన ధృవీకరణ",
    "seeds.search": "బ్యాచ్ నంబర్ వెతకండి...",
    "seeds.batchNumber": "బ్యాచ్ నంబర్",
    "seeds.germination": "మొలకెత్తే రేటు",
    "seeds.purity": "శుద్ధత",
    "seeds.grade": "నాణ్యత గ్రేడ్",
    "seeds.healthStatus": "ఆరోగ్య స్థితి",
    "seeds.manufacturer": "తయారీదారు",
    "weather.title": "వాతావరణ అంతర్దృష్టులు",
    "weather.temperature": "ఉష్ణోగ్రత",
    "weather.humidity": "తేమ",
    "weather.rainfall": "వర్షపాతం",
    "weather.windSpeed": "గాలి వేగం",
    "weather.advisory": "వ్యవసాయ సలహా",
    "weather.forecast": "7 రోజుల అంచనా",
    "orders.title": "నా ఆర్డర్లు",
    "orders.empty": "ఇంకా ఆర్డర్లు లేవు. పురుగుమందులు కొనండి.",
    "orders.status": "స్థితి",
    "orders.total": "మొత్తం",
    "orders.date": "ఆర్డర్ తేదీ",
    "orders.address": "డెలివరీ చిరునామా",
    "orders.items": "వస్తువులు",
    "settings.title": "సెట్టింగ్స్",
    "settings.language": "భాష",
    "settings.account": "ఖాతా",
    "settings.logout": "లాగ్ అవుట్",
    "settings.deleteAccount": "ఖాతాను తొలగించు",
    "settings.deleteConfirm": "మీకు ఖచ్చితంగా ఉందా? ఈ చర్యను రద్దు చేయడం సాధ్యం కాదు.",
    "common.loading": "లోడ్ అవుతోంది...",
    "common.error": "ఏదో తప్పు జరిగింది",
    "common.retry": "మళ్ళీ ప్రయత్నించు",
    "common.save": "సేవ్ చేయి",
    "common.cancel": "రద్దు చేయి",
    "common.delete": "తొలగించు",
    "common.confirm": "నిర్ధారించు",
    "common.back": "వెనుకకు",
    "common.search": "వెతకు",
    "common.filter": "వడపోత",
    "common.noResults": "ఫలితాలు కనుగొనబడలేదు",
    "common.viewAll": "అన్నీ చూడండి",
    "common.close": "మూసు",
    "common.submit": "సమర్పించు",
    "offline.banner": "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. కొన్ని లక్షణాలు పరిమితంగా ఉండవచ్చు.",
    "severity.low": "తక్కువ",
    "severity.moderate": "మధ్యస్థం",
    "severity.high": "అధికం",
    "severity.critical": "చాలా తీవ్రం",
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

const LANG_KEY = "agrishield_lang";

function getStoredLang(): Language {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored && ["en", "hi", "ta", "te"].includes(stored)) {
    return stored as Language;
  }
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getStoredLang);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_KEY, lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[language][key] ?? translations.en[key] ?? key;
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export type { TranslationKey };
