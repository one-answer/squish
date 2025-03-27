import { useTranslation } from 'react-i18next';

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{t('languageSelector')}:</span>
      <div className="flex gap-2">
        <button
          className={`px-2 py-1 text-sm rounded ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => changeLanguage('en')}
        >
          English
        </button>
        <button
          className={`px-2 py-1 text-sm rounded ${i18n.language === 'zh' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => changeLanguage('zh')}
        >
          中文
        </button>
      </div>
    </div>
  );
}
