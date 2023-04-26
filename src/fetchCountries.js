import { Notify } from 'notiflix';

export function fetchCountries(name) {
  const URL = 'https://restcountries.com/v3.1';
  const END_POINT = '/name/';

  return fetch(
    `${URL}${END_POINT}${name}?fields=name,capital,population,flags,languages`
  )
    .then(resp => {
      if (!resp.ok) {
        throw new Error(
          Notify.failure('Oops, there is no country with that name')
        );
      }
      return resp.json();
    })
    .catch(err => console.log(err));
}
