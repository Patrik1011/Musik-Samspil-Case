import { isAuthenticated, getUserSession } from "./utils/auth.js";

export function createRouter() {
  const routes = {
    "/": {
      template: "/unauthenticated/landing-page.html",
      init: null, 
    },
    "/authenticated/destinations": {
      template: "/authenticated/destinations.html",
      init: async () => {
        const m = await import(
          "./components/authenticated/destinations/loadDestinations.js"
        );

        return m.loadDestinations();
      },
    },
    '/authenticated/trips': {
      template: '/authenticated/trips.html',
      init: async () => {
        const m = await import('./components/authenticated/trips/loadTrips.js');

        return m.loadTrips();
      }
    },
    '/authenticated/new-trip': {
      template: '/authenticated/new-trip.html',
      init: async () => {
        const m = await import('./components/authenticated/trips/addTrip.js');

        return m.addTripForm();
      }
    },
    "/authenticated/new-destination": {
      template: "/authenticated/new-destination.html",
      init: async () => {
        const user = getUserSession();
        if (!user || !user.isAdmin) {
          alert("You don't have permission to access this page.");
          window.history.pushState({}, "", "/authenticated/trips");
          handleRoute();
          return;
        }
        const m = await import(
          "./components/authenticated/destinations/addDestinations.js"
        );
        return m.addDestinationForm();
      },
    },
    '/authenticated/trips/:id': {
      template: '/authenticated/trip-details.html',
      init: async (params) => {
        const m = await import('./components/authenticated/trips/tripDetails.js');
        return m.loadTripDetails(params.id);
      }
    },
    "/login": {
      template: "/unauthenticated/auth/login.html",
      init: async () => {
        const m = await import("./components/unauthenticated/auth/login.js");

        return m.initLogin();
      },
    },
    "/signup": {
      template: "/unauthenticated/auth/signup.html",
      init: async () => {
        const m = await import("./components/unauthenticated/auth/signup.js");

        return m.initSignup();
      },
    },
  };

  async function loadContent(url) {
    console.log('Loading content from:', url);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Failed to load content from ${url}. Status: ${response.status}. Using fallback content.`);
        return;
      }
      return await response.text();
    } catch (error) {
      console.warn(`Error loading content from ${url}:`, error.message);
      return; 
    }
  }

  async function handleRoute() {
    if (!handleAuthRedirects()) return;

    const { matchedRoute, params } = findMatchingRoute();
    await renderContent(matchedRoute, params);
  }

  function handleAuthRedirects() {
    const path = window.location.pathname;

    if (isAuthenticated()) {
      if (path === '/' || path === '/login' || path === '/signup') {
        window.history.pushState({}, "", "/authenticated/trips");
        handleRoute();
        return false;
      }
    } else {
      if (path.startsWith("/authenticated")) {
        alert("You must be logged in to access this page.");
        window.history.pushState({}, "", "/login");
        handleRoute();
        return false;
      }
    }
    return true;
  }

  function findMatchingRoute() {
    const path = window.location.pathname;
    let matchedRoute = null;
    const params = {};

    for (const [routePath, routeConfig] of Object.entries(routes)) {
      const match = matchRoute(routePath, path);
      if (match) {
        matchedRoute = routeConfig;
        Object.assign(params, match.params);
        break;
      }
    }

    return { matchedRoute: matchedRoute || routes["/"], params };
  }

  async function renderContent(route, params) {
    const content = await loadContent(route.template);
    const mainContent = document.getElementById("main-content");

    if (mainContent) {
      mainContent.innerHTML = content;
      await new Promise(resolve => requestAnimationFrame(resolve));
      if (route.init) {
        await route.init(params);
      }
    } else {
      console.error("Main content element not found");
    }
  }

  function matchRoute(routePath, path) {
    const routeParts = routePath.split('/');
    const pathParts = path.split('/');

    if (routeParts.length !== pathParts.length) {
      return null;
    }

    const params = {};
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = pathParts[i];
      } else if (routeParts[i] !== pathParts[i]) {
        return null;
      }
    }

    return { params };
  }

  function init() {
    window.addEventListener("popstate", handleRoute);

    document.body.addEventListener("click", (event) => {
      if (event.target.matches('a[href^="/"]')) {
        event.preventDefault();

        window.history.pushState({}, "", event.target.href);

        handleRoute();
      }
    });

    handleRoute();
  }

  return { init };
}
