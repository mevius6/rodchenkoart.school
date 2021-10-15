// https://github.com/GoogleChromeLabs/dark-mode-toggle/

const doc = document;
const store = localStorage;

const NAME = 'theme-switch';
const DARK = 'dark';
const LIGHT = 'light';
const PREFERS_COLOR_SCHEME = 'prefers-color-scheme';
const MQ_DARK = `(${PREFERS_COLOR_SCHEME}:${DARK})`;
const MQ_LIGHT = `(${PREFERS_COLOR_SCHEME}:${LIGHT})`;
const COLOR_SCHEME_CHANGE = 'colorschemechange';
const PERMANENT_COLOR_SCHEME = 'permanentcolorscheme';
const HEX = ['b580d1', '8b84d7'];
const ICON_GRADIENT = `%3E%3Cdefs%3E%3ClinearGradient id='Grad' gradientUnits='userSpaceOnUse' x1='0%25' y1='0%25' x2='100%25' y2='0%25' gradientTransform='rotate(45)'%3E%3Cstop offset='0%25' stop-color='%23${HEX[0]}' /%3E%3Cstop offset='100%25' stop-color='%23${HEX[1]}' /%3E%3C/linearGradient%3E%3C/defs%3E`;
const ICON_BULB = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='64 64 896 896'%3E${ICON_GRADIENT}%3Cpath fill='url(%23Grad)' d='M632 888H392c-4.4 0-8 3.6-8 8v32c0 17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-32c0-4.4-3.6-8-8-8zM512 64c-181.1 0-328 146.9-328 328 0 121.4 66 227.4 164 284.1V792c0 17.7 14.3 32 32 32h264c17.7 0 32-14.3 32-32V676.1c98-56.7 164-162.7 164-284.1 0-181.1-146.9-328-328-328zm127.9 549.8L604 634.6V752H420V634.6l-35.9-20.8C305.4 568.3 256 484.5 256 392c0-141.4 114.6-256 256-256s256 114.6 256 256c0 92.5-49.4 176.3-128.1 221.8z'/%3E%3C/svg%3E")`;
const ICON_BULB_FILLED = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='64 64 896 896'%3E${ICON_GRADIENT}%3Cpath fill='url(%23Grad)' d='M348 676.1C250 619.4 184 513.4 184 392c0-181.1 146.9-328 328-328s328 146.9 328 328c0 121.4-66 227.4-164 284.1V792c0 17.7-14.3 32-32 32H380c-17.7 0-32-14.3-32-32V676.1zM392 888h240c4.4 0 8 3.6 8 8v32c0 17.7-14.3 32-32 32H416c-17.7 0-32-14.3-32-32v-32c0-4.4 3.6-8 8-8z'/%3E%3C/svg%3E")`;

// https://developer.mozilla.org/en-US/docs/Web/CSS/::part
// https://github.com/mdn/web-components-examples/blob/master/shadow-part/index.html
// ? https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/CSSModules/v1Explainer.md
const template = doc.createElement('template');
template.innerHTML = `
  <style>
    *,::after,::before{box-sizing:border-box}:host{contain:content;display:block}form{padding:0;background:transparent;color:inherit}fieldset{border:0;margin:0;padding:0}legend{font:var(--${NAME}-legend-font,inherit);padding:0;margin-block-end:0.5rem}input,label{cursor:pointer}

    input {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      position: absolute;
      pointer-events: none;
      margin: 0;
      border: 0;
      padding: 0;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(100%);
      white-space: nowrap;
    }

    input:focus:not(:focus-visible) + label { outline: 0; }

    input:focus-visible + label {
      --${NAME}-border-color: var(--accent);
    }

    label {
      display: inline-block;
      position: relative;
      border-width: 1px;
      border-style: solid;
      border-color: var(--${NAME}-border-color, transparent);
      border-radius: 50%;
      padding: 1ch;
      font-size: 14px;
      line-height: 1;
      vertical-align: top;
      transition-delay: 0s;
      transition-duration: 300ms;
      transition-property: border-color, filter;
      transition-timing-function: ease-in-out;
    }

    label::before {
      content: '';
      display: inline-block;
      background-size: var(--${NAME}-icon-size, 1rem);
      background-repeat: no-repeat;
      width: var(--${NAME}-icon-size, 1rem);
      height: var(--${NAME}-icon-size, 1rem);
      filter: var(--${NAME}-icon-filter, none);
      vertical-align: middle;
      transition: filter 200ms ease-in-out;
    }

    [part="darkLabel"]::before {
      background-image: var(--${NAME}-${DARK}-icon, ${ICON_BULB});
    }

    [part="lightLabel"]::before {
      background-image: var(--${NAME}-${LIGHT}-icon, ${ICON_BULB_FILLED});
    }

    [part="toggleLabel"]::before {
      background-image: var(--${NAME}-icon, none);
    }

    @media (hover: hover) {
      label:hover::before { filter: brightness(120%); }
    }
  </style>
  <form part="form">
    <fieldset part="fieldset">
      <!--<legend part="legend">Поменять оформление</legend>-->
      <!--<input part="${LIGHT}Radio" id="r1" type="radio" name="mode" value="${LIGHT}">-->
      <!--<label part="${LIGHT}Label" for="r1" title="Светлое оформление"></label>-->
      <!--<input part="${DARK}Radio" id="r2" type="radio" name="mode" value="${DARK}">-->
      <!--<label part="${DARK}Label" for="r2" title="Тёмное оформление"></label>-->

      <input part="toggleCheckbox" id="cb" type="checkbox">
      <label part="toggleLabel" for="cb" title="Поменять оформление"></label>
    </fieldset>
  </form>
`;

export class ThemeSwitch extends HTMLElement {
  constructor() {
    super();

    doc.addEventListener(COLOR_SCHEME_CHANGE, (event) => {
      this.mode = event.detail.colorScheme;
      // this._updateRadios();
      this._updateCheckbox();
    });

    doc.addEventListener(PERMANENT_COLOR_SCHEME, (event) => {
      this.permanent = event.detail.permanent;
    });

    this._initializeDOM();
  }

  _initializeDOM() {
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(template.content.cloneNode(true));

    // this._lightRadio = shadowRoot.querySelector('[part=lightRadio]');
    // this._lightLabel = shadowRoot.querySelector('[part=lightLabel]');
    // this._darkRadio = shadowRoot.querySelector('[part=darkRadio]');
    // this._darkLabel = shadowRoot.querySelector('[part=darkLabel]');

    this._toggleCheckbox = shadowRoot.querySelector('[part=toggleCheckbox]');
    this._toggleLabel = shadowRoot.querySelector('[part=toggleLabel]');

    const hasNativePrefersColorScheme = matchMedia(MQ_DARK).media !== 'not all';

    if (hasNativePrefersColorScheme) {
      matchMedia(MQ_DARK).addListener(({matches}) => {
        this.mode = matches ? DARK : LIGHT;
        this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode});
      });
    }

    const rememberedValue = store.getItem(NAME);

    if (rememberedValue && [DARK, LIGHT].includes(rememberedValue)) {
      this.mode = rememberedValue;
      this.permanent = true;
    }
    // Задать цветовую схему в зависимости от системных настроек
    else if (hasNativePrefersColorScheme) {
      this.mode = matchMedia(MQ_LIGHT).matches ? LIGHT : DARK;
    }
    if (!this.mode) {
      this.mode = DARK;
    }
    if (this.permanent && !rememberedValue) {
      store.setItem(NAME, this.mode);
    }

    // this._updateRadios();

    this._updateCheckbox();

    // [this._lightRadio, this._darkRadio].forEach((input) => {
    //   input.addEventListener('change', e => {
    //     if (e.target.checked) {
    //       this.mode = e.target.value;
    //       this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode})
    //     }
    //   }, false);
    // });

    this._toggleCheckbox.addEventListener('change', () => {
      this.mode = this._toggleCheckbox.checked ? LIGHT : DARK;
      this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode});

      this.permanent = true;

      if (this.permanent) {
        store.setItem(NAME, this.mode);
      } else {
        store.removeItem(NAME);
      }
    });

    this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode});
    this._dispatchEvent(PERMANENT_COLOR_SCHEME, {
      permanent: this.permanent,
    });
  }

  _dispatchEvent(type, value) {
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail: value,
    }));
  }

  // _updateRadios() {
  //   if (this.mode === LIGHT) {
  //     this._lightRadio.checked = true;
  //   } else {
  //     this._darkRadio.checked = true;
  //   }
  // }

  _updateCheckbox() {
    if (this.mode === DARK) {
      this._toggleLabel.style.setProperty(
        // `--${NAME}-icon`, `${ICON_SUN_URL}`
        `--${NAME}-icon`, `${ICON_BULB}`
      );
      this._toggleCheckbox.checked = false;
    } else {
      this._toggleLabel.style.setProperty(
        // `--${NAME}-icon`, `${ICON_MOON_URL}`
        `--${NAME}-icon`, `${ICON_BULB_FILLED}`
      );
      this._toggleCheckbox.checked = true;
    }
  }
}

window.customElements.define(NAME, ThemeSwitch);
