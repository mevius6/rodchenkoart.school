const UA = navigator.userAgent;
const { innerWidth, innerHeight } = window;
const { documentElement, body } = document;

const math = {
  map: (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c,
  // линейная интерполяция
  lerp: (min, max, val) => min * (1 - val) + max * val,
  // расстояние между двумя точками
  distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
  // случайное число
  getRandomNum: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
};

const generateNumSeq = num => Array.from({length: num}, (v, i) => i);

const calcWinsize = () => {
  return { ww: innerWidth, wh: innerHeight };
};

const getMousePos = (e) => {
  const { pageX, pageY, clientX, clientY } = e;

  let posx = 0;
  let posy = 0;

  if (!e) e = window.event;
  if (pageX || pageY) {
    posx = pageX;
    posy = pageY;
  } else if (clientX || clientY) {
    posx = clientX + body.scrollLeft + documentElement.scrollLeft;
    posy = clientY + body.scrollTop + documentElement.scrollTop;
  }

  return { x: posx, y: posy };
};

const getMouseRelativePos = (e, vars={}) => {
  let posx = 0;
  let posy = 0;

  // calc mouse coordinates in relation to element x/y axes
  let offsetX = getCoords(e.target).left;
  let offsetY = getCoords(e.target).top;

  if (vars.math === 'px') {
    posx = Math.round(getMousePos(e).x - offsetX);
    posy = Math.round(getMousePos(e).y - offsetY);

    if (vars.setProps) {
      setCssProp('--x', `${posx}px`, e.target);
      setCssProp('--y', `${posy}px`, e.target);
    }
  }
  if (vars.math === 'pc') {
    posx = Math.round(
      ((getMousePos(e).x - offsetX) / innerWidth) * 100
    );
    posy = Math.round(
      ((getMousePos(e).y - offsetY) / innerHeight) * 100
    );

    if (vars.setProps) {
      setCssProp('--x', `${posx}%`, e.target);
      setCssProp('--y', `${posy}%`, e.target);
    }
  }

  return { x: posx, y: posy };
}

function getCoords(elem) {
  let box = elem.getBoundingClientRect();

  let coords = { top: 0, left: 0 }
  coords.top = box.top + scrollY;
  coords.left = box.left + scrollX;

  return coords;
  // return {
  //   top: box.top + scrollY,
  //   left: box.left + scrollX,
  // };
}

function setCssProp(name, val, elem) {
  elem.style.setProperty(name, val);
}

/**
 * https://github.com/ykob/tplh.net-2019/blob/master/src/utils/checkWebpFeature.js
 * @param {*} feature 'lossy' / 'lossless' / 'alpha' / 'animation'
 * @usage checkWebpFeature('alpha').then(() => {...}).catch(() => {...});
 */
const checkWebpFeature = (feature) => {
  return new Promise((resolve, reject) => {
    let testImages = {
      lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
      lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
      alpha:
        'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
      animation:
        'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
    };
    let img = new Image();
    img.onload = () => {
      if (img.width > 0 && img.height > 0) {
        resolve(feature);
      } else {
        reject(feature);
      }
    };
    img.onerror = () => {
      reject(feature);
    };
    img.src = 'data:image/webp;base64,' + testImages[feature];
  });
};

const isMobileDevice = () => {
  let hasTouchScreen = false;
  if ('maxTouchPoints' in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ('msMaxTouchPoints' in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
  } else {
    let mql = window.matchMedia && matchMedia('(pointer:coarse)');
    if (mql && mql.media === '(pointer:coarse)') {
      hasTouchScreen = !!mql.matches;
    } else if ('orientation' in window) {
      hasTouchScreen = true;
    } else {
      hasTouchScreen = (
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
      );
    }
  }

  return new Promise((resolve, reject) => {
    hasTouchScreen ? resolve() : reject();
  });
}

const getWidth = (elem) =>
  parseFloat(getComputedStyle(elem, null).width.replace('px', ''));

const getHeight = (elem) =>
  parseFloat(getComputedStyle(elem, null).height.replace('px', ''));

const select = (expr, con = null) => (con || document).querySelector(expr);

const selectAll = (expr, con) => {
  return Array.prototype.slice.call((con || document).querySelectorAll(expr));
};

const findByData = (expr, con) => selectAll(`[data-${con}]`).find(
  (elem) => elem.dataset[con] === expr
);

const createNode = (expr) => document.createElement(expr);

const appendNode = (expr, con) => expr.appendChild(con);

const createNodeWithClass = (expr, con) => {
  const elem = createNode(expr);
  // elem.classList.add(con);
  elem.className += con;
  return elem;
};

// https://javascript.plainenglish.io/another-17-life-saving-javascript-one-liners-8c335bf73d2c
// https://javascript.plainenglish.io/17-life-saving-javascript-one-liners-part1-b0b0b32c9f61

const siblings = (elem) => selectAll(elem.parentNode.children).filter(
  (child) => child !== elem
);

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
// const isEqual = (a, b) => a.length === b.length &&
//   a.every((v, i) => v === b[i]);

const toObject = (arr, key) => arr.reduce((a, b) => (
  { ...a, [b[key]]: b }), {}
);
// const toObject = (arr, key) => Object.fromEntries(
//   arr.map((it) => [it[key], it])
// );

const isObject = (obj) => {
   return Object.prototype.toString.call(obj) === '[object Object]';
};

const objectEntries = (obj) => Object.entries(obj);
// const objectKeys = (obj) => Object.keys(obj);

const isArrEmpty = (arr) => !Array.isArray(arr) || arr.length === 0;
const isObjEmpty = (obj) => !isObject(obj) || objectEntries(obj).length === 0;

const isEmpty = (expr) => {
  if (Array.isArray(expr)) return isArrEmpty(expr);
  if (isObject(expr)) return isObjEmpty(expr);
  // if (Array.isArray(expr)) return expr.length === 0;
  // if (isObject(expr)) return objectEntries(expr).length === 0;
}

const randomValue = (arr) => arr[Math.floor(Math.random() * arr.length)];

function handleAriaExpanded(target) {
  // let target = evt.target || evt.currentTarget;
  let isExpanded = target.getAttribute('aria-expanded') === 'true';

  ['aria-expanded', 'aria-pressed'].map((state) => {
    target.setAttribute(state, !isExpanded);
    target.setAttribute('aria-label', !isExpanded ? 'Show' : 'Hide');
  });
}

/**
 * https://developers.google.com/web/fundamentals/primers/async-functions#async_return_values
 *
 * https://davidwalsh.name/javascript-promise-tricks
 *
 * @param {*} ms время в миллисекундах
 * @usage await delay(200);
 */
const delay = (ms) => new Promise(r => setTimeout(r, ms));

/**
 *
 * @param {*} url источник данных
 * @param {*} options объект с параметрами запроса
 * @param {*} query структура запроса
 * @returns декодированный ответ в формате JSON
 */
const asyncFetchJSON = async (url, options = {}, query = {}) => {
  const response = await fetch(url, options, query);
  const json = await response.json();

  if (!response.ok || json.errors) {
    // console.error(json.errors);
    const message = `Произошла ошибка: ${response.status}`;
    throw new Error(message);
  }

  return json;
};

function checkBrowser() {
  let UA = navigator.userAgent;
  let browser;

  // es5: UA.indexOf('...') > -1;
  let chromeAgent = UA.includes('Chrome');
  let IExplorerAgent = UA.includes('MSIE') || UA.includes('rv:');
  let firefoxAgent = UA.includes('Firefox');
  let safariAgent = UA.includes('Safari');
  if (chromeAgent && safariAgent) safariAgent = false;
  let operaAgent = UA.includes('OP');
  if (chromeAgent && operaAgent) chromeAgent = false;

  if (safariAgent) browser = 'Safari';
  if (chromeAgent) browser = 'Chrome';
  if (IExplorerAgent) browser = 'IE';
  if (operaAgent) browser = 'Opera';
  if (firefoxAgent) browser = 'Firefox';

  return browser;
}

function checkSystem() {
  let AV = navigator.appVersion;
  let os;

  // es5: AV.indexOf('...') != -1)
  if (AV.includes('Win')) os = 'Windows';
  if (AV.includes('Mac')) os = 'macOS';
  if (AV.includes('X11')) os = 'UNIX';
  if (AV.includes('Linux')) os = 'Linux';

  return os;
}

// https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element
function trapFocus(element) {
  let focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'),
      [firstFocusableEl] = focusableEls,
      lastFocusableEl = focusableEls[focusableEls.length - 1];
  const KEYCODE_TAB = 9;

  element.addEventListener('keydown', function(e) {
    let isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
        e.preventDefault();
      }
    }
  });
}

/**
 * https://w3c.github.io/IntersectionObserver/ — spec
 *
 * @param {*} entries target Element
 * @param {*} observer IO w/ default options
 * @example
 * const options = {
 *   root: document.querySelector('[data-io-root]'),
 *   rootMargin: '0px',
 *   threshold: [1.0],
 *   trackVisibility: true,
 *   delay: 100
 * }
 *
 * for (const element of querySelectorAll('.js-anim')) {
 *   animationObserver.observe(element, options);
 * }
 */
// eslint-disable-next-line no-unused-vars
const animationObserver = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    entry.target.classList.toggle('js-anim--running', entry.isIntersecting)
  }
});

/**
 * https://caniuse.com/#search=intersectionobserver
 *
 * @param {*} elem
 * @param {*} callback
 * @param {*} options
 * @returns
 * @example
 * inViewport('.target', element => {
 *   doc.querySelector('.box').textContent = element.isIntersecting;
 * }, {
 *   root: doc.querySelector('.scroll')
 * });
 */
function inViewport(elem, callback, options = {}) {
  return new IntersectionObserver(entries => {
    entries.forEach(entry => callback(entry));
  }, options).observe(document.querySelector(elem));
}

const clearCookies = () => document.cookie
  .split(';')
  .forEach((c) => (document.cookie = c
    .replace(/^ +/, '')
    .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
  ));

const cookiesObj = document.cookie.split(';').map((item) => item
  .split('='))
  .reduce((acc, [k, v]) => (acc[k.trim().replace('"', '')] = v) && acc, {});

export {
  math,
  generateNumSeq,
  calcWinsize,
  getMousePos,
  getMouseRelativePos,
  isMobileDevice,
  checkBrowser,
  checkSystem,
  checkWebpFeature,
  setCssProp,
  select,
  selectAll,
  findByData,
  getCoords,
  getWidth,
  getHeight,
  createNode,
  appendNode,
  createNodeWithClass,
  objectEntries,
  isEmpty,
  handleAriaExpanded,
  delay,
  asyncFetchJSON,
  trapFocus,
  randomValue,
  animationObserver,
  inViewport
};
