self.addEventListener('install', (event) => {
	console.log('[Service Worker] Installing Service Worker ...', event);
});

self.addEventListener('activate', (event) => {
	console.log('[Service Worker] Activating Service Worker ...', event);
	return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
	if (event.request.method !== 'GET') {
		return;
	}
	const url = new URL(event.request.url);
	if (url.origin !== self.location.origin) {
		return;
	}
	event.respondWith(fetch(event.request));
});
