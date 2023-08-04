import {
  BlockTitle,
  Dialog,
  DialogButton,
  List,
  ListButton,
  ListItem,
  Range,
  Toggle,
} from 'konsta/react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  fontSizeState,
  fontState,
  languageState,
  showImagesState,
  subtitleState,
} from '../../atoms';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../../helper';
import {} from 'i18next';
import { useTranslation } from 'react-i18next';
import SettingsExample from '../../components/SettingsExample';

export default function SettingsPage() {
  const { t } = useTranslation();
  const setSubtitle = useSetRecoilState(subtitleState);
  const language = useRecoilValue(languageState);
  const font = useRecoilValue(fontState);
  const [showImages, setShowImages] = useRecoilState(showImagesState);
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);

  useEffect(() => {
    setSubtitle('');
  }, [setSubtitle]);

  const [confirmOpened, setConfirmOpened] = useState(false);

  const clearCache = () => {
    setConfirmOpened(false);
    storage
      .keys()
      .then(function (keys) {
        for (const el of keys) {
          storage.removeItem(el);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const showImagesHandler = () => {
    setShowImages((prev) => {
      const newValue = prev === '1' ? '0' : '1';
      localStorage.setItem('showImages', newValue);
      return newValue;
    });
  };

  const fontSizeHandler = (e) => {
    localStorage.setItem('fontSize', parseInt(e.target.value));
    setFontSize(parseInt(e.target.value));
  };

  return (
    <>
      <BlockTitle>{t('Settings')}</BlockTitle>
      <List strongIos outlineIos insetIos>
        <ListItem
          link
          linkComponent={Link}
          linkProps={{ to: '/settings/language' }}
          title={t('Language')}
          after={t(language)}
        />
        <ListItem
          link
          linkComponent={Link}
          linkProps={{ to: '/settings/font' }}
          title={t('Font')}
          after={font}
        />
        <ListItem title={t('FontSize')} after={`${fontSize}px`} />
        <ListItem
          innerClassName="flex space-x-4 rtl:space-x-reverse"
          innerChildren={
            <>
              <Range
                value={fontSize}
                step={1}
                min={12}
                max={30}
                onChange={fontSizeHandler}
              />
            </>
          }
        />
        <ListItem
          label
          title={t('ShowImages')}
          component="div"
          after={
            <Toggle
              component="div"
              className="-my-1"
              checked={showImages === '1'}
              onChange={showImagesHandler}
            />
          }
        />
        <ListButton
          className="k-color-brand-red"
          component="div"
          onClick={() => setConfirmOpened(true)}>
          {t('ClearCache')}
        </ListButton>
      </List>
      <SettingsExample />
      <Dialog
        opened={confirmOpened}
        onBackdropClick={() => setConfirmOpened(false)}
        title={t('ClearCache')}
        content={t('DataRemoved')}
        buttons={
          <>
            <DialogButton onClick={() => setConfirmOpened(false)}>
              {t('No')}
            </DialogButton>
            <DialogButton
              strong
              onClick={() => {
                clearCache();
              }}>
              {t('Yes')}
            </DialogButton>
          </>
        }
      />
    </>
  );
}