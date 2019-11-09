const key = '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';

function subscribe() {
  const emailInput = document.querySelector('#email');
  const email = emailInput.value.trim();
  const success = document.querySelector('#success');
  const error = document.querySelector('#error');

  success.textContent = '';
  success.style.display = 'none';
  error.textContent = '';
  error.style.display = 'none';

  if (!email) {
    return;
  }

  axios({
    method: 'post',
    url: 'https://api.sendinblue.com/v3/contacts',
    data: {
      email: email,
    },
    headers: { 
      'content-type': 'application/json',
      'api-key': key,
    },
  }).then(() => {
    success.textContent = 'You have subscribed successfully!';
    success.style.display = 'block';
    emailInput.value = '';
  }).catch(e => {
    error.textContent = (e.response && e.response.data && e.response.data.message) || 'Oops, something went wrong. Please try again.';
    error.style.display = 'block';
  })
}
