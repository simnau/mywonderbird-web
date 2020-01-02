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
    url: '/api/subscription',
    data: {
      email: email,
    },
    headers: {
      'content-type': 'application/json',
    },
  })
    .then(() => {
      success.textContent = 'You have subscribed successfully!';
      success.style.display = 'block';
      emailInput.value = '';
    })
    .catch(e => {
      error.textContent =
        (e.response && e.response.data && e.response.data.message) ||
        'Oops, something went wrong. Please try again.';
      error.style.display = 'block';
    });
}
