import { List, ListItem, BlockTitle, Icon, Progressbar, Block } from 'konsta/react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { directionState, languageState, storyState } from '../atoms';
import { useNavigate } from 'react-router-dom';
import { countries, langList, languages, rtlLanguages } from '../constants';
import { loadToCache, storage } from '../helper';
import { useEffect, useState } from 'react';
import axios from 'axios';

const LanguageSelector = ({ loading, setLoading }) => {
  const setLanguage = useSetRecoilState(languageState);
  const setDirection = useSetRecoilState(directionState);
  const story = useRecoilValue(storyState);
  const navigate = useNavigate();
  const [availableLangs, setAvailableLangs] = useState()
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const getAvailableLangs = async () => {
      const _availableLangs = await Promise.all(languages.map((lang) => storage.getItem('get+https://git.door43.org/' + langList[lang] + 'toc.json').then(res => res !== null)))
      setAvailableLangs(_availableLangs)
    }
    getAvailableLangs()
  }, [])


  const { t } = useTranslation();
  const onLanguageChange = (lang) => {
    setLanguage(lang);
    setDirection(rtlLanguages.includes(lang) ? 'rtl' : 'ltr');
    if (availableLangs[languages.indexOf(lang)]) {
      navigate(`/${lang}/${story}`);
    } else {
      setLoading(true);
      axios.get(`https://git.door43.org/${langList[lang].split('/raw/')[0]}/archive/master.zip`, {
        responseType: 'arraybuffer',
        cache: false,
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.loaded / progressEvent.total;
          setProgress(percentCompleted);
        }
      }).then(async res => {
        await loadToCache(res.data, lang);
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        setLoading(false);
        navigate(`/${lang}/${story}`);
      })
    }
  }
  return (
    <>
      {loading ?
        <>
          <BlockTitle>{t('Loading...')}</BlockTitle>
          <Block strong inset outline>
            <Progressbar progress={progress} />
          </Block>
        </> :
        <>
          <List>
            {languages.sort((a, b) => t(`languages.${a}`).localeCompare(t(`languages.${b}`))).map((lang, index) => {
              const CountryIcon = countries[lang]
              return (
                <ListItem
                  key={index}
                  title={t(`languages.${lang}`)}
                  onClick={() => onLanguageChange(lang)}
                  after={availableLangs?.[index] ? t('loaded') : ''}
                  link
                  media={<Icon ios={<CountryIcon className="w-6 h-4" />}
                    material={<CountryIcon className="w-6 h-4" />} />}
                />
              )
            })}
          </List>
        </>
      }
    </>
  );
};

export default LanguageSelector;
