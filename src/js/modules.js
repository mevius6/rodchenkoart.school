const parsedUrl = new URL(window.location.href);
const doc = document,
      root = doc.documentElement;

// https://github.com/tc39/proposal-dynamic-import
/* eslint-disable no-unused-vars */
(async () => {
  const toggle = await import('./modules/theme-switcher.js').then(() => {
    const themeSwitch = doc.querySelector('theme-switch');
    root.setAttribute('data-theme-style', themeSwitch.mode === 'dark'
      ? 'dark'
      : 'light'
    );
    themeSwitch.addEventListener('colorschemechange', () => {
      root.dataset.themeStyle = themeSwitch.mode;
    });
  });

  if (
    parsedUrl.pathname === '/' ||
    parsedUrl.pathname === '/index.html'
  ) {
    const player = await import('./modules/video-player');
    const header = await import('./modules/header');
    const nav = await import('./modules/nav');
    const io = await import('./modules/class-toggle');
    const lazyimg = await import('./modules/reveal-image');
    const slideshow = await import('./modules/slideshow');
    const disclosure = await import('./modules/disclosure');
    const cursor = await import('./modules/cursor');
    // const form = await import('./modules/form');
  }
})();
/* eslint-enable no-unused-vars */
