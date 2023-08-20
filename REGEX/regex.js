function register() {
  var emailInput = document.getElementById('emailInput');
  var passwordInput = document.getElementById('passwordInput');
  var phoneInput = document.getElementById('phoneInput');
  var result = document.getElementById('result');

  // regularni vyrazy pro validaci
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  var phoneRegex = /^\+\d{1,3}\s?\d{3}\s?\d{3}\s?\d{3}$/;

  var email = emailInput.value;
  var password = passwordInput.value;
  var phone = phoneInput.value;

  if (!emailRegex.test(email)) {
    result.innerHTML = "E-mailová adresa je neplatná.";
    result.style.color = "red";
    return;
  }

  if (!passwordRegex.test(password)) {
    result.innerHTML = "Heslo musí obsahovat alespoň 8 znaků, včetně číslic a malých a velkých písmen.";
    result.style.color = "red";
    return;
  }

  if (!phoneRegex.test(phone)) {
    result.innerHTML = "Telefonní číslo je neplatné.";
    result.style.color = "red";
    return;
  }

  // registrace uspesna
  result.innerHTML = "Registrace proběhla úspěšně!";
  result.style.color = "green";
}
