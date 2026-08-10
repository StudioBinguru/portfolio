document.documentElement.classList.add("js");

const deck = document.querySelector(".deck");

/* 직군 적합도와 프로젝트 우선순위 기준 배치 */
const SLIDE_ORDER = [
  "s01", "s02", "s04",
  "s16", "s17", "s18", "s19", "s20", "s21",
  "s05", "s06", "s07", "s08", "s09", "s10",
  "s11", "s12", "s13", "s14", "s15",
  "s22", "s23", "s24", "s25", "s26", "s27", "s28", "s29",
];
SLIDE_ORDER.forEach(id => {
  const slide = document.querySelector(`#${id}`);
  if (slide) deck.appendChild(slide);
});

const slides = [...document.querySelectorAll(".slide")];
slides.forEach((slide, index) => {
  const pageNumber = slide.querySelector(".pageno");
  if (pageNumber) pageNumber.textContent = index + 1;
});
const rail = document.querySelector("#rail");
const preview = document.querySelector("#rail-preview");

/* 고정 캔버스 스케일 — 창 크기와 무관하게 16:9 비율 유지 */
const STAGE_W = 1440;
const STAGE_H = 810;
function fitStage() {
  const scale = Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
  deck.style.setProperty("--s", scale);
}
window.addEventListener("resize", fitStage);
fitStage();

/* 페이지 미리보기 데이터 */
const PAGE_INFO = [
  { t: "Game Client Developer", d: "이은빈 · 2026" },
  { t: "Summary", d: "이력 · 기술 · 경력 · 출시 경험 요약" },
  { t: "Projects", d: "6개 프로젝트 한눈에 보기" },
  { g: "PROJECT 01 · ODIE ODYSSEY", t: "Overview", d: "메트로배니아 구조의 2D 액션 어드벤처" },
  { g: "PROJECT 01 · ODIE ODYSSEY", t: "Play", d: "탐색·상호작용·대화·전투·미니게임으로 이어지는 플레이" },
  { g: "PROJECT 01 · ODIE ODYSSEY", t: "Architecture", d: "플레이어·몬스터의 모듈형 컨트롤러와 FSM·공통 데이터 구조" },
  { g: "PROJECT 01 · ODIE ODYSSEY", t: "Combat AI", d: "탐지부터 타격·피격까지 단계별로 나눈 전투 판정" },
  { g: "PROJECT 01 · ODIE ODYSSEY", t: "Level Build", d: "Tiled 맵 배치부터 충돌·카메라·포털 연결까지의 레벨 구축" },
  { g: "PROJECT 01 · ODIE ODYSSEY", t: "Runtime", d: "FMOD 음악 전환과 Addressables·Pool 리소스 재사용" },
  { g: "AI COMPANION APP", t: "Product", d: "캐릭터 대화·에피소드·영상통화·미니게임을 연결한 앱" },
  { g: "AI COMPANION APP", t: "Unity Scope", d: "앱 주요 화면과 담당한 Unity 콘텐츠" },
  { g: "PROJECT 02 · MINIGAMES", t: "Overview", d: "캐릭터 IP를 활용한 WebGL 미니게임 시리즈" },
  { g: "PROJECT 02 · MINIGAMES", t: "Play", d: "Note Rush · On the Run · 랭킹 화면" },
  { g: "PROJECT 02 · MINIGAMES", t: "Platforms", d: "웹·앱 진입 방식과 PC·모바일 화면 대응" },
  { g: "PROJECT 02 · MINIGAMES", t: "Event Flow", d: "앱과 Unity WebGL 게임 사이의 이벤트 흐름" },
  { g: "PROJECT 03 · CHARACTER RUNTIME", t: "Overview", d: "영상통화 화면에 통합한 Unity 3D 캐릭터" },
  { g: "PROJECT 03 · CHARACTER RUNTIME", t: "Call States", d: "대화 상태에 따라 전환되는 캐릭터 행동" },
  { g: "PROJECT 03 · CHARACTER RUNTIME", t: "Integration", d: "앱·네이티브 브리지·Unity의 통화 실행 흐름" },
  { g: "PROJECT 04 · BURN MY NEST", t: "Overview", d: "영화 속 세 장면을 터치 기반 미니게임으로 재구성" },
  { g: "PROJECT 04 · BURN MY NEST", t: "Play", d: "장면별 입력 방식과 완료 이후의 공통 처리" },
  { g: "PROJECT 05 · CREVERSE WEB GAMES", t: "Overview", d: "책 한 권의 어휘를 세 가지 웹 게임으로 재구성" },
  { g: "PROJECT 05 · CREVERSE WEB GAMES", t: "Play", d: "Connections · Coupang · Escape Room" },
  { g: "PROJECT 05 · CREVERSE WEB GAMES", t: "Hub", d: "여섯 게임의 독립 경로와 GitHub Pages 허브 배포" },
  { g: "PROJECT 06 · 우리집 행복한 고양이", t: "Overview", d: "돌보고 치료해 입양 보내는 2D 픽셀아트 육성 시뮬레이션" },
  { g: "PROJECT 06 · 우리집 행복한 고양이", t: "Play", d: "돌보기 · 치료 · 입양으로 이어지는 게임 루프" },
  { g: "PROJECT 06 · 우리집 행복한 고양이", t: "Solo Dev", d: "픽셀아트·사운드 제작부터 Google Play 출시까지" },
  { g: "PROJECT 06 · 우리집 행복한 고양이", t: "Performance", d: "행동 연산 주기 조정과 Sprite Atlas 기반 성능 최적화" },
  { t: "Thank You", d: "bin7342@gmail.com" },
];

/* 눈금 레일 생성 */
const DARK_THEMES = ["t-pixel", "t-pixel-light", "t-adventure", "t-appcover", "t-appdoc", "t-runtime"];
const ticks = slides.map((slide, index) => {
  const tick = document.createElement("button");
  tick.type = "button";
  tick.className = "tick";
  const badgeText = slide.querySelector(".slide-badge")?.textContent.trim() || "";
  if (badgeText.startsWith("Project ")) tick.classList.add("project-start");
  tick.setAttribute("aria-label", `${index + 1} 페이지로 이동`);
  tick.appendChild(document.createElement("i"));
  tick.addEventListener("click", () => goTo(index, true));
  tick.addEventListener("mouseenter", () => {
    showPreview(index, tick);
    magnify(index);
  });
  rail.appendChild(tick);
  return tick;
});

function showPreview(index, tick) {
  const info = PAGE_INFO[index] || { t: `${index + 1} 페이지`, d: "" };
  preview.innerHTML = `${info.g ? `<span class="pv-group">${info.g}</span>` : ""}<b><i class="pv-num">${index + 1}</i>${info.t}</b>${info.d ? `<p>${info.d}</p>` : ""}`;
  preview.classList.add("show");
  const rect = tick.getBoundingClientRect();
  const height = preview.offsetHeight;
  const top = rect.top + rect.height / 2 - height / 2;
  preview.style.top = `${Math.min(Math.max(12, top), window.innerHeight - height - 12)}px`;
}

/* 호버한 눈금 기준 양옆 3개까지만 스무스하게 길어지기 */
function magnify(hoverIndex) {
  ticks.forEach((tick, i) => {
    const distance = Math.abs(i - hoverIndex);
    const closeness = distance <= 3 ? 1 - distance / 4 : 0;
    tick.firstElementChild.style.width = closeness > 0 ? `${14 + 20 * closeness}px` : "";
  });
}
rail.addEventListener("mouseleave", () => {
  ticks.forEach(tick => { tick.firstElementChild.style.width = ""; });
  preview.classList.remove("show");
});

/* 테마별 레터박스 색 — 페이지 배경보다 한 톤 어두운 동계열 */
const LETTERBOX = {
  "t-paper": "#dcd9d1",
  "t-appdoc": "#070810",
  "t-appcover": "#070810",
  "t-runtime": "#070810",
  "t-pixel": "#070810",
  "t-pixel-light": "#070810",
  "t-papercraft": "#e9d8ba",
  "t-papercraft-light": "#ecdfc7",
  "t-film": "#cbd3cf",
  "t-film-light": "#d8dedb",
  "t-web": "#dde5e3",
  "t-web-light": "#dde5e3",
  "t-adventure": "#061426",
  "t-adventure-light": "#d5e1f0",
  "t-odie-cover": "#86b8a1",
  "t-odie-light": "#86b8a1",
  "t-cozy": "#eedcd2",
  "t-cozy-light": "#eedcd2",
};

const ACHROMATIC_SLIDES = new Set(["s01", "s02", "s04", "s29"]);

function syncRail(index) {
  ticks.forEach((tick, i) => tick.classList.toggle("active", i === index));
  const isDark = DARK_THEMES.some(theme => slides[index].classList.contains(theme));
  rail.classList.toggle("rail-light", isDark);
  const currentSlide = slides[index];
  const themeClass = [...currentSlide.classList].find(cls => LETTERBOX[cls]);
  document.body.style.background = ACHROMATIC_SLIDES.has(currentSlide.id)
    ? "#e5e6e7"
    : LETTERBOX[themeClass] || "#dcd9d1";
}

/* 슬라이드 전환 */
let currentIndex = -1;

function revealSlide(index) {
  slides[index].querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible"));
}

/* 현재 슬라이드와 양옆 슬라이드의 미디어만 메모리에 유지 */
const videoPlayTimers = new WeakMap();

function prepareImage(img) {
  img.loading = "eager";
  img.decoding = "async";
  if (!img.getAttribute("src")) img.src = img.dataset.src;
  if (typeof img.decode === "function") img.decode().catch(() => {});
}

function prewarmSlideImages(slide) {
  if (!slide) return;
  slide.querySelectorAll("img[data-src]").forEach(prepareImage);
}

function loadSlideMedia(slide, isCurrent = false) {
  slide.querySelectorAll("img[data-src]").forEach(prepareImage);

  slide.querySelectorAll("video").forEach((video, videoIndex) => {
    let changed = false;
    clearTimeout(videoPlayTimers.get(video));
    if (video.dataset.poster && !video.getAttribute("poster")) {
      video.poster = video.dataset.poster;
    }
    video.querySelectorAll("source[data-src]").forEach(source => {
      if (!source.getAttribute("src")) {
        source.src = source.dataset.src;
        changed = true;
      }
    });
    video.preload = isCurrent ? "auto" : "metadata";
    if (changed) video.load();
    if (isCurrent) {
      const delay = slide.id === "s15" ? 620 + videoIndex * 80 : 0;
      const timer = setTimeout(() => video.play().catch(() => {}), delay);
      videoPlayTimers.set(video, timer);
    } else {
      video.pause();
    }
  });
}

function unloadSlideMedia(slide) {
  slide.querySelectorAll("img[data-src]").forEach(img => img.removeAttribute("src"));
  slide.querySelectorAll("video").forEach(video => {
    clearTimeout(videoPlayTimers.get(video));
    video.pause();
    video.removeAttribute("poster");
    video.querySelectorAll("source[data-src]").forEach(source => source.removeAttribute("src"));
    video.preload = "none";
    video.load();
  });
}

function syncSlideMedia(index) {
  slides.forEach((slide, slideIndex) => {
    if (Math.abs(slideIndex - index) <= 1) loadSlideMedia(slide, slideIndex === index);
    else unloadSlideMedia(slide);
  });

  /* Character Runtime 진입 전에 다음 페이지 이미지까지 디코딩 */
  if (slides[index + 1]?.id === "s11") prewarmSlideImages(slides[index + 2]);
}

function goTo(index, instant = false) {
  const clamped = Math.max(0, Math.min(slides.length - 1, index));
  if (clamped === currentIndex) return;
  currentIndex = clamped;

  if (instant) deck.classList.add("no-anim");
  slides.forEach((slide, i) => {
    slide.classList.toggle("is-current", i === clamped);
    slide.classList.toggle("is-above", i < clamped);
    slide.classList.toggle("is-below-next", i === clamped + 1 || i === clamped - 1);
  });
  if (instant) {
    void deck.offsetHeight;
    requestAnimationFrame(() => deck.classList.remove("no-anim"));
  }

  syncRail(clamped);
  syncSlideMedia(clamped);
  setTimeout(() => revealSlide(clamped), instant ? 40 : 220);
}

goTo(0, true);

/* Index 페이지의 프로젝트 링크 → 슬라이드 점프 */
document.querySelectorAll('a[href^="#s"]').forEach(link => {
  link.addEventListener("click", event => {
    const target = document.querySelector(link.getAttribute("href"));
    const index = slides.indexOf(target);
    if (index < 0) return;
    event.preventDefault();
    goTo(index);
  });
});

/* 휠 = 한 칸씩 */
let wheelLocked = false;
window.addEventListener("wheel", event => {
  event.preventDefault();
  if (wheelLocked || Math.abs(event.deltaY) < 4) return;
  wheelLocked = true;
  goTo(currentIndex + (event.deltaY > 0 ? 1 : -1));
  setTimeout(() => { wheelLocked = false; }, 550);
}, { passive: false });

/* 터치 스와이프 */
let touchStartY = null;
window.addEventListener("touchstart", event => {
  touchStartY = event.touches[0].clientY;
}, { passive: true });
window.addEventListener("touchend", event => {
  if (touchStartY === null) return;
  const delta = touchStartY - event.changedTouches[0].clientY;
  touchStartY = null;
  if (Math.abs(delta) < 40) return;
  goTo(currentIndex + (delta > 0 ? 1 : -1));
}, { passive: true });

/* 키보드 */
window.addEventListener("keydown", event => {
  if (event.target.matches("input, textarea")) return;
  if (["ArrowDown", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    goTo(currentIndex + 1);
  } else if (["ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    goTo(currentIndex - 1);
  } else if (event.key === "Home") {
    event.preventDefault();
    goTo(0);
  } else if (event.key === "End") {
    event.preventDefault();
    goTo(slides.length - 1);
  }
});
