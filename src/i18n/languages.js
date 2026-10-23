// All 22 scheduled languages of India (8th Schedule) + English + Bhojpuri.
// `gt` = Google Translate code, `speech` = BCP-47 tag for voice input / read-aloud.
export const LANGUAGES = [
  { code: 'en', gt: 'en', native: 'English', english: 'English', speech: 'en-IN' },
  { code: 'hi', gt: 'hi', native: 'हिन्दी', english: 'Hindi', speech: 'hi-IN' },
  { code: 'bn', gt: 'bn', native: 'বাংলা', english: 'Bengali', speech: 'bn-IN' },
  { code: 'te', gt: 'te', native: 'తెలుగు', english: 'Telugu', speech: 'te-IN' },
  { code: 'mr', gt: 'mr', native: 'मराठी', english: 'Marathi', speech: 'mr-IN' },
  { code: 'ta', gt: 'ta', native: 'தமிழ்', english: 'Tamil', speech: 'ta-IN' },
  { code: 'ur', gt: 'ur', native: 'اردو', english: 'Urdu', speech: 'ur-IN', rtl: true },
  { code: 'gu', gt: 'gu', native: 'ગુજરાતી', english: 'Gujarati', speech: 'gu-IN' },
  { code: 'kn', gt: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada', speech: 'kn-IN' },
  { code: 'ml', gt: 'ml', native: 'മലയാളം', english: 'Malayalam', speech: 'ml-IN' },
  { code: 'or', gt: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia', speech: 'or-IN' },
  { code: 'pa', gt: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi', speech: 'pa-IN' },
  { code: 'as', gt: 'as', native: 'অসমীয়া', english: 'Assamese', speech: 'as-IN' },
  { code: 'mai', gt: 'mai', native: 'मैथिली', english: 'Maithili', speech: 'hi-IN' },
  { code: 'sa', gt: 'sa', native: 'संस्कृतम्', english: 'Sanskrit', speech: 'hi-IN' },
  { code: 'ne', gt: 'ne', native: 'नेपाली', english: 'Nepali', speech: 'ne-NP' },
  { code: 'sd', gt: 'sd', native: 'سنڌي', english: 'Sindhi', speech: 'sd-IN', rtl: true },
  { code: 'kok', gt: 'gom', native: 'कोंकणी', english: 'Konkani', speech: 'hi-IN' },
  { code: 'doi', gt: 'doi', native: 'डोगरी', english: 'Dogri', speech: 'hi-IN' },
  { code: 'mni', gt: 'mni-Mtei', native: 'ꯃꯩꯇꯩꯂꯣꯟ', english: 'Manipuri', speech: 'en-IN' },
  { code: 'ks', gt: 'ks', native: 'کٲشُر', english: 'Kashmiri', speech: 'ur-IN', rtl: true },
  { code: 'sat', gt: 'sat', native: 'ᱥᱟᱱᱛᱟᱲᱤ', english: 'Santali', speech: 'en-IN' },
  { code: 'brx', gt: 'brx', native: 'बड़ो', english: 'Bodo', speech: 'hi-IN' },
  { code: 'bho', gt: 'bho', native: 'भोजपुरी', english: 'Bhojpuri', speech: 'hi-IN' },
];

export const getLanguage = (code) => LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
