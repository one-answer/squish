import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 flex items-center gap-1">
        <Globe className="w-4 h-4" />
        {t('languageSelector')}:
      </span>
      <div className="flex gap-2">
        <button
          className={`px-3 py-1.5 text-sm rounded-full transition-all duration-300 ${
            i18n.language === 'en' 
              ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
          onClick={() => changeLanguage('en')}
        >
          English
        </button>
        <button
          className={`px-3 py-1.5 text-sm rounded-full transition-all duration-300 ${
            i18n.language === 'zh' 
              ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
          onClick={() => changeLanguage('zh')}
        >
          中文
        </button>
      </div>
    </div>
  );
}
