import { atom } from 'recoil';

let defaultFont = 'default';
if (!localStorage.getItem('font')) {
  localStorage.setItem('font', defaultFont);
} else {
  defaultFont = localStorage.getItem('font');
}

export const fontState = atom({
  key: 'fontState',
  default: defaultFont,
});

let defaultLanguage = '';
if (!localStorage.getItem('language')) {
  localStorage.setItem('language', defaultLanguage);
} else {
  defaultLanguage = localStorage.getItem('language');
}

export const languageState = atom({
  key: 'languageState',
  default: defaultLanguage,
});

let defaultLanguageApp = 'en';
if (!localStorage.getItem('languageApp')) {
  localStorage.setItem('languageApp', defaultLanguageApp);
} else {
  defaultLanguageApp = localStorage.getItem('languageApp');
}

export const languageAppState = atom({
  key: 'languageAppState',
  default: defaultLanguageApp,
});

export const subtitleState = atom({
  key: 'subtitleState',
  default: '',
});

export const titleState = atom({
  key: 'titleState',
  default: '',
});

let defaultShowImages = '1';
if (!localStorage.getItem('showImages')) {
  localStorage.setItem('showImages', defaultShowImages);
} else {
  defaultShowImages = localStorage.getItem('showImages');
}

export const showImagesState = atom({
  key: 'showImagesState',
  default: defaultShowImages,
});

let defaultFontSize = 16;
if (!localStorage.getItem('fontSize')) {
  localStorage.setItem('fontSize', defaultFontSize);
} else {
  defaultFontSize = localStorage.getItem('fontSize');
}

export const fontSizeState = atom({
  key: 'fontSizeState',
  default: defaultFontSize,
});

let defaultStory = '01';
if (!localStorage.getItem('story')) {
  localStorage.setItem('story', defaultStory);
} else {
  defaultStory = localStorage.getItem('story');
}

export const storyState = atom({
  key: 'storyState',
  default: defaultStory,
});

let defaultDarkMode = '0';
if (!localStorage.getItem('darkMode')) {
  localStorage.setItem('darkMode', defaultDarkMode);
} else {
  defaultDarkMode = localStorage.getItem('darkMode');
}

export const darkModeState = atom({
  key: 'darkModeState',
  default: defaultDarkMode,
});
