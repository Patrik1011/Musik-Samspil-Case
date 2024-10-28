import { clearUserSession, getUserSession } from '../../../utils/auth';

const createNavLinks = () => {
  const user = getUserSession();

  const isAdmin = user?.isAdmin;

  const navLinksContainer = document.createElement('div');

  navLinksContainer.className =
    'flex flex-1 items-center justify-center sm:items-stretch sm:justify-start';

  const logoContainer = document.createElement('div');

  logoContainer.className = 'flex flex-shrink-0 items-center';

  const logoImg = document.createElement('img');

  logoImg.className = 'h-20 w-auto';

  logoImg.src = '/icons/mountain-logo.png';

  logoImg.alt = 'Your Company';

  logoContainer.appendChild(logoImg);

  navLinksContainer.appendChild(logoContainer);

  const links = [
    { href: '/authenticated/trips', text: 'Trips' },
    { href: '/authenticated/destinations', text: 'Destinations' },
    { href: '/authenticated/new-trip', text: 'Add Trip' }
  ];

  if (isAdmin) {
    links.push({
      href: '/authenticated/new-destination',
      text: 'Add Destination'
    });
  }

  const linksContainer = document.createElement('div');

  linksContainer.className = 'hidden sm:ml-6 sm:flex sm:space-x-8';

  for (const link of links) {
    const a = document.createElement('a');

    a.href = link.href;

    a.className =
      'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700';

    a.textContent = link.text;

    linksContainer.appendChild(a);
  }

  navLinksContainer.appendChild(linksContainer);

  return navLinksContainer;
};

const createProfileButton = () => {
  const profileButton = document.createElement('div');

  profileButton.className = 'relative ml-3';

  const button = document.createElement('button');

  button.type = 'button';

  button.className =
    'relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2';

  button.id = 'user-menu-button';

  button.setAttribute('aria-expanded', 'false');

  button.setAttribute('aria-haspopup', 'true');

  const profileImg = document.createElement('img');

  profileImg.className = 'h-8 w-8 rounded-full';

  profileImg.src =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

  profileImg.alt = 'Profile';

  button.appendChild(profileImg);

  profileButton.appendChild(button);

  const dropdown = document.createElement('div');

  dropdown.className =
    'absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden';

  dropdown.setAttribute('role', 'menu');

  dropdown.setAttribute('aria-orientation', 'vertical');

  dropdown.setAttribute('aria-labelledby', 'user-menu-button');

  dropdown.innerHTML = `
    <button class="block w-full text-left px-4 py-2 text-sm text-gray-700" role="menuitem" id="logoutButton">Sign out</button>
  `;

  profileButton.appendChild(dropdown);

  button.addEventListener('click', () => {
    dropdown.classList.toggle('hidden');
  });

  const logoutButton = dropdown.querySelector('#logoutButton');

  logoutButton.addEventListener('click', () => {
    clearUserSession();

    window.location.reload();
  });

  return profileButton;
};

export const createNavbar = () => {
  const nav = document.createElement('nav');

  nav.className = 'bg-white shadow';

  const container = document.createElement('div');

  container.className = 'mx-auto max-w-7xl px-2 sm:px-6 lg:px-8';

  const flexContainer = document.createElement('div');

  flexContainer.className = 'relative flex h-16 justify-between';

  const navLinks = createNavLinks();

  flexContainer.appendChild(navLinks);

  const profileContainer = document.createElement('div');

  profileContainer.className =
    'absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0';

  const profileButton = createProfileButton();

  profileContainer.appendChild(profileButton);

  flexContainer.appendChild(profileContainer);

  container.appendChild(flexContainer);

  nav.appendChild(container);

  return nav;
};
