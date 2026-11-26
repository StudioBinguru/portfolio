document.documentElement.classList.add("js");

const deck = document.querySelector(".deck");

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
const PAGE_INFO = {
  "s01": { t: "Game Developer", d: "이은빈 · 2026" },
  "s02": { t: "Summary", d: "프로필 · 학력 · 기술 · 경력" },
  "s04": { t: "Projects", d: "게임과 3D 웹 프로젝트 5선" },
  "s05": { g: "AI 컴패니언 앱", t: "Product", d: "캐릭터 대화·에피소드·영상통화·미니게임을 연결한 앱" },
  "s06": { g: "AI 컴패니언 앱", t: "Unity Scope", d: "앱 주요 화면과 담당한 Unity 콘텐츠" },
  "s07": { g: "AI 컴패니언 앱", t: "Overview", d: "캐릭터 IP를 활용한 WebGL 미니게임 시리즈" },
  "s08": { g: "AI 컴패니언 앱", t: "Play", d: "Note Rush · On the Run · 랭킹 화면" },
  "s09": { g: "AI 컴패니언 앱", t: "Platforms", d: "웹·앱 진입 방식과 PC·모바일 화면 대응" },
  "s10": { g: "AI 컴패니언 앱", t: "Event Flow", d: "앱과 Unity WebGL 게임 사이의 이벤트 흐름" },
  "s11": { g: "AI 컴패니언 앱", t: "Overview", d: "영상통화 화면에 통합한 Unity 3D 캐릭터" },
  "s13": { g: "AI 컴패니언 앱", t: "Integration", d: "앱·네이티브 브리지·Unity의 통화 실행 흐름" },
  "s16": { g: "ODIE ODYSSEY", t: "Overview", d: "메트로배니아 구조의 2D 액션 어드벤처" },
  "s17": { g: "ODIE ODYSSEY", t: "Play", d: "탐색·상호작용·대화·전투·미니게임으로 이어지는 플레이" },
  "s18": { g: "ODIE ODYSSEY", t: "Architecture", d: "플레이어·몬스터의 모듈형 컨트롤러와 FSM·공통 데이터 구조" },
  "s19": { g: "ODIE ODYSSEY", t: "Combat AI", d: "탐지부터 타격·피격까지 단계별로 나눈 전투 판정" },
  "s20": { g: "ODIE ODYSSEY", t: "Level Build", d: "Tiled 맵 배치부터 충돌·카메라·포털 연결까지의 레벨 구축" },
  "s-seoul": { g: "Cent!ent Metaverse", t: "서울 골목 동네", d: "달동네 옥상의 아침·저녁·밤" },
  "s-seoul-structure": { g: "Cent!ent Metaverse", t: "게임 구조", d: "동네 지도에서 보는 서버 판정·시간 동기화·개인 저장" },
  "s-seoul-truck": { g: "Cent!ent Metaverse", t: "1980년대 서울 골목의 하루", d: "교실의 공기놀이와 저녁 골목의 소독차" },
  "s-seoul-soccer": { g: "Cent!ent Metaverse", t: "동네에서 함께하는 미니게임", d: "복도 놀이와 운동장의 5 대 5 축구" },
  "s-seoul-arcade": { g: "Cent!ent Metaverse", t: "골목 전자오락실, 게임 속의 게임", d: "ROBO CLASH의 조작과 관전" },
  "s-seoul-release": { g: "Cent!ent Metaverse", t: "멀티플레이 월드의 시스템 아키텍처", d: "공유 시계·이동 판정·개발 빌드 관리" },
  "s14": { g: "BURN MY NEST", t: "Overview", d: "영화 속 세 장면을 터치 기반 미니게임으로 재구성" },
  "s15": { g: "BURN MY NEST", t: "Play", d: "장면별 입력 방식과 완료 이후의 공통 처리" },
  "s31": { g: "BURN MY NEST", t: "Production", d: "원화 선별부터 레이어 분리와 Unity 장면 조립까지" },
  "s25": { g: "우리집 행복한 고양이", t: "Overview", d: "돌보고 치료해 입양 보내는 2D 픽셀아트 육성 시뮬레이션" },
  "s26": { g: "우리집 행복한 고양이", t: "Play", d: "돌보기 · 치료 · 입양으로 이어지는 게임 루프" },
  "s27": { g: "우리집 행복한 고양이", t: "Solo Dev", d: "픽셀아트·사운드 제작부터 Google Play 출시까지" },
};

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
  const info = PAGE_INFO[slides[index].id] || { t: `${index + 1} 페이지`, d: "" };
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
  "theme-shoe": "#ebdeda",
  "theme-land": "#e1dcef",
  "theme-auto": "#dedfe1",
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

const ACHROMATIC_SLIDES = new Set(["s01", "s02", "s04"]);

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
let transitionCleanup = null;
let queuedDirection = 0;
let revealTimer = null;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
  slide.querySelectorAll("img[data-src]").forEach(img => {
    if (isCurrent || !img.classList.contains("seoul-loop")) prepareImage(img);
  });

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
    if (isCurrent && !video.hasAttribute("data-manual")) {
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
  if (instant) queuedDirection = 0;
  if (clamped === currentIndex) return;
  instant = instant || reducedMotion.matches || Math.abs(clamped - currentIndex) > 1;
  if (transitionCleanup && !instant) {
    queuedDirection = Math.sign(clamped - currentIndex);
    return;
  }
  transitionCleanup?.();
  transitionCleanup = null;
  queuedDirection = 0;
  clearTimeout(revealTimer);
  // Keep the departing GIF on screen until the slide finishes moving.
  const departingLoop = slides[currentIndex]?.querySelector(".seoul-loop");
  const releaseDepartingLoop = () => departingLoop?.removeAttribute("src");
  currentIndex = clamped;

  if (instant) deck.classList.add("no-anim");
  slides.forEach((slide, i) => {
    slide.classList.toggle("is-current", i === clamped);
    slide.classList.toggle("is-above", i < clamped);
    slide.classList.toggle("is-below-next", i === clamped + 1 || i === clamped - 1);
  });
  if (instant) {
    void deck.offsetHeight;
    releaseDepartingLoop();
    requestAnimationFrame(() => deck.classList.remove("no-anim"));
  }

  syncRail(clamped);
  syncSlideMedia(clamped);
  revealTimer = setTimeout(() => revealSlide(clamped), instant ? 0 : 220);

  if (!instant) {
    const currentSlide = slides[clamped];
    const style = getComputedStyle(currentSlide);
    const durations = style.transitionDuration.split(",").map(value => parseFloat(value) * (value.trim().endsWith("ms") ? 1 : 1000));
    const duration = Math.max(...durations);
    if (!duration) { releaseDepartingLoop(); return; }
    let fallback;
    const finish = () => {
      transitionCleanup();
      transitionCleanup = null;
      const direction = queuedDirection;
      queuedDirection = 0;
      if (direction) goTo(currentIndex + direction);
    };
    const onEnd = event => {
      if (event.target === currentSlide && event.propertyName === "transform") finish();
    };
    transitionCleanup = () => {
      clearTimeout(fallback);
      releaseDepartingLoop();
      currentSlide.removeEventListener("transitionend", onEnd);
    };
    currentSlide.addEventListener("transitionend", onEnd);
    /* 백그라운드 탭 등에서 종료 이벤트가 누락된 경우의 잠금 해제 */
    fallback = setTimeout(finish, duration + 100);
  }
}

function stepSlide(direction, repeatedKey = false) {
  if (transitionCleanup) {
    /* 빠른 개별 입력은 마지막 방향 하나만 보관, 키 반복은 다음 전환까지 대기 */
    if (!repeatedKey) queuedDirection = direction;
    return;
  }
  goTo(currentIndex + direction);
}

/* 직접 링크로 연 페이지도 덱의 선택 상태와 일치시킨다. */
function openHashSlide() {
  const index = slides.findIndex(slide => `#${slide.id}` === location.hash);
  goTo(index < 0 ? 0 : index, true);
}
window.addEventListener("hashchange", openHashSlide);
openHashSlide();

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

/* 휠 관성 구간은 한 번의 입력으로 처리 */
let wheelLastAt = -Infinity;
let wheelDirection = 0;
let wheelDistance = 0;
let wheelConsumed = false;
window.addEventListener("wheel", event => {
  if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
  event.preventDefault();
  if (!event.deltaY) return;
  const now = performance.now();
  const direction = Math.sign(event.deltaY);
  if (now - wheelLastAt > 160 || direction !== wheelDirection) {
    wheelDistance = 0;
    wheelConsumed = false;
  }
  wheelLastAt = now;
  wheelDirection = direction;
  if (wheelConsumed) return;
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
  wheelDistance += Math.abs(event.deltaY) * unit;
  if (wheelDistance < 40) return;
  wheelConsumed = true;
  stepSlide(direction);
}, { passive: false });

/* 터치 스와이프 */
let touchStartY = null;
window.addEventListener("touchstart", event => {
  touchStartY = event.target.closest?.("video, .seoul-options") ? null : event.touches[0].clientY;
}, { passive: true });
window.addEventListener("touchend", event => {
  if (touchStartY === null) return;
  const delta = touchStartY - event.changedTouches[0].clientY;
  touchStartY = null;
  if (Math.abs(delta) < 40) return;
  stepSlide(delta > 0 ? 1 : -1);
}, { passive: true });

/* 키보드 */
window.addEventListener("keydown", event => {
  if (event.target.closest?.("input, textarea, select, video, [contenteditable='true']")) return;
  if (event.key === " " && event.target.closest?.("button")) return;
  if (["ArrowDown", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    stepSlide(1, event.repeat);
  } else if (["ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    stepSlide(-1, event.repeat);
  } else if (event.key === "Home") {
    event.preventDefault();
    goTo(0, true);
  } else if (event.key === "End") {
    event.preventDefault();
    goTo(slides.length - 1, true);
  }
});
