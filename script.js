const API_ENDPOINT = 'https://api.neverhaveiever.io/v1/statement';

const STATEMENT = document.querySelector('#js-ph-statement');
const LEVEL_SELECTION = document.querySelector('#js-ph-category-selection');

const TOGGLE_HARMLESS = document.querySelector('#js-ph-toggle-harmless');
const TOGGLE_DELICATE = document.querySelector('#js-ph-toggle-delicate');
const TOGGLE_OFFENSIVE = document.querySelector('#js-ph-toggle-offensive');

let blockRefresh = false;

/**
 * Fetches a new statement.
 */
function refreshStatement() {
  if (blockRefresh) {
    return;
  }

  axios
      .get(API_ENDPOINT, {
        crossdomain: true,
        params: {
          harmless: TOGGLE_HARMLESS.checked,
          delicate: TOGGLE_DELICATE.checked,
          offensive: TOGGLE_OFFENSIVE.checked,
        },
      })
      .then(function(response) {
        if ('statement' in response.data) {
          STATEMENT.innerHTML = response.data.statement;
        } else {
          STATEMENT.innerHTML = 'Retarded API response.';
        }
      })
      .catch(function(error) {
        console.log(error);
        STATEMENT.innerHTML = 'Seems like the API is dead.';
      })
      .finally(function() {
        STATEMENT.classList.remove('ph-statement--animated');
      });
}

document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', refreshStatement);
  document.addEventListener('keydown', refreshStatement);

  LEVEL_SELECTION.addEventListener('click', function (event) {
    event.stopPropagation();
  });

  window.addEventListener('offline', function() {
    blockRefresh = true;
    STATEMENT.innerHTML = 'Your internet connection sucks.';
  });

  window.addEventListener('online', function() {
    blockRefresh = false;
    STATEMENT.innerHTML = 'Welcome back! Tap to continue.';
  });

  refreshStatement();
});
