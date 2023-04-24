import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const ref = {
  input: document.querySelector('#search-box'),
  ul: document.querySelector('.country-list'),
  div: document.querySelector('.country-info'),
};

ref.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  let currentSeach = evt.target.value.trim();

  if (!currentSeach) {
    ref.div.innerHTML = '';
    ref.ul.innerHTML = '';
    return;
  }

  fetchCountries(currentSeach)
    .then(resp => {
      if (resp.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        ref.ul.innerHTML = '';
      } else if (resp.length > 1 && resp.length < 10) {
        createMarkupOne(resp);
        ref.ul.innerHTML = '';
      } else if (resp.length === 1) {
        createMarkupAll(resp);
        ref.div.innerHTML = '';
      }
    })
    .catch(err => {
      ref.ul.innerHTML = '';
      ref.div.innerHTML = '';
      console.log(err);
    })
    .finally(() => {
      currentSeach = '';
    });
}

function createMarkupAll(arr) {
  console.log(arr);
  const markup = arr
    .map(
      ({
        name: { official },
        capital,
        population,
        flags: { svg },
        languages,
      }) => {
        return `<li>
        <img src="${svg}" alt="${official}">
  <h2> ${official}</h2>
  <p>Capital: ${capital}</p>
<p>Population: ${population}</p>
<p>Languages: ${countryLanguages(languages)}</p>
</li>`;
      }
    )
    .join();

  ref.ul.innerHTML = markup;
}

function createMarkupOne(arr) {
  const markup = arr
    .map(({ flags: { svg }, name: { official } }) => {
      return `<img src="${svg}" alt="${official}">
        <h2> ${official}</h2>`;
    })
    .join();

  ref.div.innerHTML = markup;
}

function countryLanguages(lang) {
  let languages = [];
  for (const el in lang) {
    languages.push(lang[el]);
  }
  return languages;
}
