// show/hide
(async () => {
  const root = document.documentElement;

  let prevScroll = window.scrollY || window.scrollTop;
  let currScroll;
  let direction = 0;
  let prevDirection = 0;

  const header = document.querySelector('.page__header');

  const checkScroll = () => {
    currScroll = window.scrollY || root.scrollTop;

    if (currScroll > prevScroll) direction = 2;
    else if (currScroll < prevScroll) direction = 1;

    if (direction !== prevDirection) {
      toggleHeader(direction, currScroll);
    }

    prevScroll = currScroll;
  };

  const toggleHeader = (direction, currScroll) => {
    if (direction === 2 && currScroll > 60) {
      header.classList.add('page__header--hidden');
      prevDirection = direction;
    } else if (direction === 1) {
      header.classList.remove('page__header--hidden');
      prevDirection = direction;
    }
  };

  window.addEventListener('scroll', checkScroll, false);
})();
