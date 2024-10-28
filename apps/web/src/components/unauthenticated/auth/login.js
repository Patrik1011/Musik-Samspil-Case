import { setUserSession } from '../../../utils/auth.js';

import { loginUser } from '../../../utils/authService.js';

export const initLogin = () => {
  const loginForm = document.getElementById('loginForm');

  const errorPopup = document.createElement('div');

  errorPopup.className =
    'hidden fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center';

  document.body.appendChild(errorPopup);

  if (!loginForm) {
    console.error('Login form not found');

    return;
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);

    const formObject = Object.fromEntries(formData);

    try {
      const data = await loginUser(formObject);

      setUserSession(
        data.user.email,
        data.user.username,
        data.token,
        data.user.isAdmin
      );

      window.location.href = '/authenticated/trips';
    } catch (error) {
      console.error('Error during login:', error);

      errorPopup.textContent = 'Incorrect email or password. Please try again.';

      errorPopup.classList.remove('hidden');

      setTimeout(() => {
        errorPopup.classList.add('hidden');
      }, 3000);
    }
  });
};
