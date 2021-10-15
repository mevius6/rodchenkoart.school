// https://app.form2chat.io/docs

const form = document.getElementById('contact-form');

const submitResult = document.getElementById('submit-result');

form.onsubmit = function(e) {
  e.preventDefault();

  const formData = new FormData(form);
  const xhr = new XMLHttpRequest();

  xhr.open('POST', form.action, true);

  xhr.onload = function(e) {
    const response = JSON.parse(xhr.response);

    if (xhr.status === 200) {
      submitResult.textContent = 'Ваша заявка успешно отправлена!';
    } else {
      submitResult.textContent = 'Ошибка: ' + response.error;
    }
  };

  xhr.send(formData);
};

// ? https://ravitejanunna.hashnode.dev/how-to-send-an-email-using-js-without-any-backend
