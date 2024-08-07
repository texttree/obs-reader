import { useRef, useState } from 'react';
import { BlockTitle, Button } from 'konsta/react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { directionState, languageState, storyState } from '../atoms';
import { checkTextDirection, langStorage, loadToCache } from '../helper';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function FromDevice() {
  const { t } = useTranslation();
  const fileInput = useRef();
  const setLanguage = useSetRecoilState(languageState);
  const setDirection = useSetRecoilState(directionState);
  const [isEnabled, setIsEnabled] = useState(false)
  const [langName, setLangName] = useState('')
  const [langCode, setLangCode] = useState('')

  const story = useRecoilValue(storyState);
  const navigate = useNavigate();

  const onChange = (evt) => {
    fileInput.current = evt.target.files[0];
    setIsEnabled(true)
  };

  const uploadHandle = async () => {
    let reader = new FileReader();
    try {
      reader.onload = async function () {
        setLanguage('user-' + langCode)
        await loadToCache(reader.result, 'user-' + langCode, 'https://git.door43.org/bsa/')
        const { data: toc } = await axios.get('https://git.door43.org/bsa/user-' + langCode + '/toc.json', {
          headers: {
            Accept: 'application/json',
          }
        })
        const firstStory = JSON.parse(toc)[0].title;
        setDirection(checkTextDirection(firstStory) ? 'rtl' : 'ltr')
        await langStorage.setItem(langCode, JSON.stringify({ name: langName, direction: (checkTextDirection(firstStory) ? 'rtl' : 'ltr') }))
        navigate(`/user-${langCode}/${story}`)
      };
      reader.readAsArrayBuffer(fileInput.current);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <BlockTitle withBlock={false} className='!px-0 !mt-2'>{t('languageName')}</BlockTitle>
      <input type="text" id='lang_name' name="lang_name" className='w-full mb-3 text-base material:text-sm appearance-none transition-colors focus:outline-none select-none bg-figma-bg-card-light dark:bg-figma-bg-card-dark ios:rounded material:rounded-lg material:font-medium ios:duration-100 material:duration-300 px-4 ios:py-0.5 material:py-2.5' value={langName} onChange={(e) => setLangName(e.target.value)} />
      <BlockTitle withBlock={false} className='!px-0 !mt-2'>{t('languageCode')}</BlockTitle>
      <input type="text" id='lang_name' name="lang_name" className='w-full mb-3 text-base material:text-sm appearance-none transition-colors focus:outline-none select-none bg-figma-bg-card-light dark:bg-figma-bg-card-dark ios:rounded material:rounded-lg material:font-medium ios:duration-100 material:duration-300 px-4 ios:py-0.5 material:py-2.5' value={langCode} onChange={(e) => {
        setLangCode(e.target.value.toLocaleLowerCase().match(/[a-z0-9\\-]{0,10}/)[0])
      }} pattern='[a-z0-9\-]{2,10}' />
      <BlockTitle withBlock={false} className='!px-0 !mt-2'>{t('uploadArchive')}</BlockTitle>
      <input
        type="file"
        onChange={onChange}
        name="file"
        className="w-full mb-12 text-base material:text-sm cursor-pointer appearance-none transition-colors focus:outline-none select-none overflow-hidden z-10 relative text-gray-500 dark:text-gray-400 ios:file:text-white material:file:text-md-light-on-primary material:dark:file:text-md-dark-on-primary ios:file:bg-primary material:file:bg-md-light-primary material:dark:file:bg-md-dark-primary bg-figma-bg-card-light dark:bg-figma-bg-card-dark file:cursor-pointer file:border-0 file:px-4 ltr:file:mr-4 rtl:file:ml-4 ios:rounded material:rounded-lg material:font-medium ios:duration-100 material:duration-300 ios:file:pb-1 ios:file:pt-1.5 material:file:py-3 material:touch-ripple-white material:dark:touch-ripple-primary"
        id="file"
        accept=".zip"
      />
      <Button onClick={uploadHandle} disabled={!isEnabled || !langName.trim() || !langCode.trim()}>{t('addNew')}</Button>
    </>
  );
}
