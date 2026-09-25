// 계획표 & 일정 달력 - Service Worker
// 캐시 이름을 바꾸면(v2, v3...) 이전 캐시가 자동으로 정리되고 새 파일로 교체됩니다.
const CACHE_NAME = "calendar-app-cache-v2";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

// 설치 시 필요한 파일들을 미리 캐시에 저장
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// 활성화 시 이전 버전 캐시 삭제
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 요청이 오면: 네트워크를 먼저 시도하고, 실패하면(오프라인) 캐시에서 응답
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
