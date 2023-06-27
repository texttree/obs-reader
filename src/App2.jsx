import { useState } from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';
import axios from './helper2';
import localforage from 'localforage';
import UploadResources from './Upload';

function App2() {
  const [markdown, setMarkdown] = useState('');
  const [story, setStory] = useState('01');
  const getStory = () => {
    axios
      .get(
        'https://git.door43.org/ru_gl/ru_obs/raw/branch/master/content/' +
          story +
          '.md'
      )
      .then((res) => {
        console.log({fromCache: !!res.request?.fromCache});
        setMarkdown(res.data);
      });
  };
  const createNew = () => {
    const cacheStore = localforage.createInstance({
      driver: [localforage.INDEXEDDB],
      name: 'web-cache',
    });
    cacheStore
      .setItem(
        'get+https://git.door43.org/ru_gl/ru_obs/raw/branch/master/content/99.md',
        {"expires":(Date.now() + 1000*60*60*24*365),"data":{"data":"# 1. test\n\n_Библейская история из Бытия 1-2_\n","status":200,"statusText":"OK","headers":{"cache-control":"private, max-age=300","content-disposition":"inline; filename=\"99.md\"; filename*=UTF-8''99.md","content-type":"text/plain; charset=utf-8","last-modified":"Thu, 06 May 2021 09:48:18 GMT"}}}
      )
      .then(function () {
        const a = cacheStore.getItem(
          'get+https://git.door43.org/ru_gl/ru_obs/raw/branch/master/content/99.md'
        );
        const b = cacheStore.getItem(
          'get+https://git.door43.org/ru_gl/ru_obs/raw/branch/master/content/99.md'
        );
        console.log({ a, b });
        console.log('success');
      })
      .catch(function (err) {
        console.log({ err });
      });
  }
  return (
    <>
      <h1>axios-cache-adapter</h1>
      <div className="card">
        <input value={story} onChange={(e) => setStory(e.target.value)} />{' '}
        <br />
        <button onClick={getStory}>Load</button>
        <button onClick={createNew}>Create</button>
        <UploadResources />
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </>
  );
}

export default App2;