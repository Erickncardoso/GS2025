const CACHE_NAME = "alaganao-v1.0.0";
const STATIC_CACHE_NAME = "alaganao-static-v1.0.0";
const DYNAMIC_CACHE_NAME = "alaganao-dynamic-v1.0.0";

// Arquivos essenciais para cache estático
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/bgShero.jpg",
  // Páginas principais
  "/login",
  "/register",
  "/map",
  "/relatar",
  "/comunidade",
  "/alertas",
  "/doacoes",
  "/profile",
  // Assets estáticos
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/icon-192x192.svg",
  "/icons/icon-512x512.svg",
  "/favicon.svg",
];

// URLs que devem sempre buscar da rede primeiro
const NETWORK_FIRST_URLS = [
  "/api/",
  "https://api.supabase.co/",
  "https://maps.googleapis.com/",
];

// URLs que podem usar cache primeiro
const CACHE_FIRST_URLS = [
  "/icons/",
  "/screenshots/",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".css",
  ".js",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets...");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Static assets cached successfully");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Failed to cache static assets:", error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName !== CACHE_NAME
            ) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Claiming clients...");
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with different strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip extension requests
  if (url.protocol === "chrome-extension:" || url.protocol === "moz-extension:")
    return;

  // Network first strategy for API calls
  if (NETWORK_FIRST_URLS.some((pattern) => request.url.includes(pattern))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache first strategy for static assets
  if (CACHE_FIRST_URLS.some((pattern) => request.url.includes(pattern))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stale while revalidate for navigation requests
  if (request.mode === "navigate") {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Default: cache first with network fallback
  event.respondWith(cacheFirst(request));
});

// Cache first strategy
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error("Cache first failed:", error);

    // Return offline fallback for navigation requests
    if (request.mode === "navigate") {
      const offlineResponse = await caches.match("/");
      return offlineResponse || new Response("Offline", { status: 503 });
    }

    throw error;
  }
}

// Network first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.status === 200 && request.url.startsWith("http")) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("Network first falling back to cache:", request.url);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => {
      // Return cached response if network fails
      return cachedResponse;
    });

  // Return cached response immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered:", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  try {
    // Handle offline reports, donations, etc.
    const offlineActions = await getOfflineActions();

    for (const action of offlineActions) {
      try {
        await syncAction(action);
        await removeOfflineAction(action.id);
      } catch (error) {
        console.error("Failed to sync action:", error);
      }
    }
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

async function getOfflineActions() {
  // This would integrate with IndexedDB to get offline actions
  return [];
}

async function syncAction(action) {
  // This would handle syncing different types of actions
  console.log("Syncing action:", action);
}

async function removeOfflineAction(actionId) {
  // This would remove the action from IndexedDB after successful sync
  console.log("Removing offline action:", actionId);
}

// Push notifications
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push notification received");

  const options = {
    body: "Você tem uma nova notificação do alaganao",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Ver Detalhes",
        icon: "/icons/icon-96x96.png",
      },
      {
        action: "close",
        title: "Fechar",
        icon: "/icons/icon-96x96.png",
      },
    ],
  };

  if (event.data) {
    const data = event.data.json();
    options.title = data.title || "alaganao";
    options.body = data.body || options.body;
    options.data = { ...options.data, ...data };
  }

  event.waitUntil(self.registration.showNotification("alaganao", options));
});

// Notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked");

  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  } else if (event.action === "close") {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("/"));
  }
});

// Message handling for cache updates
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "UPDATE_CACHE") {
    event.waitUntil(updateCache());
  }
});

async function updateCache() {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    await cache.addAll(STATIC_ASSETS);
    console.log("Cache updated successfully");
  } catch (error) {
    console.error("Failed to update cache:", error);
  }
}
 