import { createRouter } from './router.js';

import { createNavbar } from './components/authenticated/navigation/navbar.js';

import './styles/tailwind.css';

document.addEventListener('DOMContentLoaded', async () => {
  const { body } = document;

  const mainContent = document.createElement('div');

  mainContent.id = 'main-content';

  body.appendChild(mainContent);

  const router = createRouter();

  router.init();

  if (window.location.pathname.startsWith('/authenticated')) {
    const navbar = createNavbar();

    body.prepend(navbar);
  }
});
