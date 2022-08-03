/// <reference path="index.d.ts" />

export enum _STATUS_CODE {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  EARLY_HINTS = 103,
  SUCCESS = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MULTI_STATUS = 207,
  ALREADY_REPORTED = 208,
  IM_USED = 226,
  MULTIPLE_CHOICES = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  USE_PROXY = 305,
  SWITCH_PROXY = 306,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  ERRORON_WIKIMEDIA = 404,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  IM_A_TEAPOT = 418,
  MISDIRECTED_REQUEST = 421,
  UNPROCESSABLE_ENTITY = 422,
  LOCKED = 423,
  FAILED_DEPENDENCY = 424,
  TOO_EARLY = 425,
  UPGRADE_REQUIRED = 426,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,
  INTERNAL_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  VARIANT_ALSO_NEGOTIATES = 506,
  INSUFFICIENT_STORAGE = 507,
  LOOP_DETECTED = 508,
  NOT_EXTENDED = 510,
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}

globalThis.STATUS_CODE = _STATUS_CODE;

globalThis.prettyConsole = (...objects) => {
  return objects.forEach((message) =>
    typeof message === "object"
      ? console.log(prettyJSON(message))
      : console.log(message)
  );
};

globalThis.prettyJSON = (object) => {
  return JSON.stringify(object, null, 4);
};

globalThis.uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : r & (0x3 | 0x8);
    return v.toString(16);
  });
};

globalThis.BGMap = (props) => {
  const { backgroundColors, backgroundColor: dColor } = props;
  return (
    backgroundColors && dColor ? backgroundColors[dColor] || dColor : dColor
  ) as string;
};

globalThis.SizeMap = (props) => {
  const { sizes, size: dSize } = props;
  return (sizes && dSize ? sizes[dSize as string] || dSize : dSize) as number;
};

globalThis.FontMap = (props) => {
  const { fonts, font: dFont } = props;
  return (fonts && dFont ? fonts[dFont] || dFont : dFont) as string;
};

globalThis.animate = async () => {
  try {
    const { Platform, UIManager, LayoutAnimation } = await import(
      // @ts-ignore
      "react-native"
    );
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  } catch (err) {}
};

globalThis.ColorMap = (props) => {
  const { colors, color: dColor } = props;
  return (colors && dColor ? colors[dColor] || dColor : dColor) as string;
};

globalThis.BGMap = (props) => {
  const { backgroundColors, backgroundColor: dColor } = props;
  return (
    backgroundColors && dColor ? backgroundColors[dColor] || dColor : dColor
  ) as string;
};

globalThis.SizeMap = (props) => {
  const { sizes, size: dSize } = props;
  return (sizes && dSize ? sizes[dSize as string] || dSize : dSize) as number;
};

globalThis.FontMap = (props) => {
  const { fonts, font: dFont } = props;
  return (fonts && dFont ? fonts[dFont] || dFont : dFont) as string;
};

globalThis.noop = function () {
  return null;
};

globalThis.noopVoid = function () {};

globalThis.Alert = async function (message, optionsOrTitle = "Alert") {
  try {
    // @ts-ignore
    const { Alert: AlertRN } = await import("react-native");
    if (typeof optionsOrTitle === "string") {
      AlertRN.alert(optionsOrTitle, message);
    } else {
      const {
        buttons = [["Ok"]],
        title = "Alert",
        cancelable,
        onDismiss,
      } = optionsOrTitle;
      AlertRN.alert(
        title,
        message,
        buttons.map((btn) => {
          const [text, onPress, style] = btn || [];
          return { onPress, style, text };
        }),
        { cancelable, onDismiss }
      );
    }
  } catch (err) {}
};

Array.prototype.replace = function (index, data) {
  const state = this;
  const dataL = state.slice(0, index);
  const dataR = state.slice(index + 1);
  if (index >= 0 && index < state?.length) return [...dataL, data, ...dataR];
  return state;
};

Array.prototype.remove = function (index) {
  const state = this;
  const dataL = state.slice(0, index);
  const dataR = state.slice(index + 1);
  if (index > 0) return [...dataL, ...dataR];
  else return dataR;
};

Array.prototype.mmap = function (callback) {
  const arr = this as unknown[];
  return arr.map((item, index) => {
    return callback(
      { item, isFirst: index === 0, isLast: index + 1 === arr.length },
      index
    );
  });
};

Array.prototype.toRnStyle = function () {
  const styles = this.reduce((styles, style) => {
    const keys = Object.keys(style || {});
    if (keys.includes("0")) {
      return (styles = [...styles, ...keys.map((key) => style[key], {})]);
    } else {
      styles.push(style);
    }
    return styles;
  }, []);
  return styles;
};

Number.prototype.humanFileSize = function (si = false, dp = 1) {
  let bytes = this as number;
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) return bytes + " B";
  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;
  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );
  return bytes.toFixed(dp) + " " + units[u];
};

Number.prototype.getPercentage = function calculate(total = 0, dp = 2) {
  const current = this as number;
  return parseInt(((total / current) * 100).toFixed(3));
};

Number.prototype.ratio = function (ratio) {
  ratio = ratio.replace(/\:/g, "/");
  const height = eval(this.toString());
  const width = height * eval(ratio);
  return { height, width };
};

Number.prototype.toAlphabet = function () {
  let s = "",
    n = (this as number) - 1;
  const ordA = "a".charCodeAt(0);
  const ordZ = "z".charCodeAt(0);
  const len = ordZ - ordA + 1;
  while (n >= 0) {
    s = String.fromCharCode((n % len) + ordA) + s;
    n = Math.floor(n / len) - 1;
  }
  return s;
};

Number.prototype.toRoman = function () {
  const roman = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };
  let number = this as number,
    result = "";
  if (number > 0 && number < 4000) {
    let key: keyof typeof roman;
    for (key in roman) {
      const h = roman[key];
      while (h <= number) {
        result += key;
        number -= h;
      }
    }
    return result;
  } else {
    throw new Error(
      "Error. Number should be greater than 0 and less than 4000."
    );
  }
};

const caseReplacer = (str: string, separator: "_" | "-") => {
  const arr = str.split(separator);
  const capital = arr.map((item, index) =>
    index
      ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
      : item.toLowerCase()
  );
  const toCase = capital.join("");
  return toCase;
};

const caseReplacerFromPascal = function (str: string, separator: string) {
  return str.split(/(?=[A-Z])/).join(separator);
};

const caseReplacerFromCamel = function (str: string, separator: "-" | "_") {
  return str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, `$1${separator}$2`)
    .toLowerCase();
};

String.prototype.extractNumber = function () {
  const str = this.toString();
  try {
    const matches = str.match(/(-?|-\s+?)\d+/g) || [];
    if (matches.length > 0) {
      const num = matches.join("").replace(/\s/g, "");
      return parseInt(num);
    }
  } catch (e) {
    return 0;
  }
  return 0;
};

String.prototype.pascalToSpace = function () {
  return caseReplacerFromPascal(this as string, " ");
};

String.prototype.kebabToCamel = function () {
  const camelCase = caseReplacer(this as string, "-");
  return camelCase;
};

String.prototype.snakeToCamel = function () {
  const camelCase = caseReplacer(this as string, "_");
  return camelCase;
};

String.prototype.camelToSnake = function () {
  const snakeCase = caseReplacerFromCamel(this as string, "_");
  return snakeCase;
};

String.prototype.camelToKebab = function () {
  const kebabCase = caseReplacerFromCamel(this as string, "-");
  return kebabCase;
};

String.prototype.ucfirst = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.lcfirst = function () {
  return this.charAt(0).toLowerCase() + this.slice(1);
};

String.prototype.ucwords = function () {
  return this.replace(/\b[a-z]/g, function (letter) {
    return letter.toUpperCase();
  });
};

String.prototype.trimSpaces = function () {
  return this.trim().replace(/[\s]{2,}/gi, " ");
};

String.prototype.removeSpecialChar = function () {
  return this.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
};

String.prototype.isBase64File = function () {
  try {
    const regex =
      /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
    return !!this.match(regex);
  } catch (error) {
    return false;
  }
};

String.prototype.getRawUrl = function () {
  const url = this as string;
  if (!url.validURL()) return false;
  const str = decodeURI(url);
  return str.split("?")[0];
};

String.prototype.validURL = function () {
  const str = this as string;
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
};

String.prototype.getQueryParams = function () {
  const url = this as string;
  const query = url.substring(url.indexOf("?") + 1);
  if (query.includes(url)) return {};
  const re = /([^&=]+)=?([^&]*)/g;
  const decodeRE = /\+/g;
  const decode = (str: string) => {
    return decodeURIComponent(str.replace(decodeRE, " "));
  };
  let e: RegExpExecArray;
  const params: MyObject = {};
  while ((e = re.exec(query))) {
    let k = decode(e[1]);
    const v = decode(e[2]);
    if (k.substring(k.length - 2) === "[]") {
      k = k.substring(0, k.length - 2);
      // @ts-ignore
      (params[k] || (params[k] = [])).push(v);
    } else params[k] = v;
  }

  const assign = function (obj: MyObject<any>, keyPath: string, value: string) {
    const lastKeyIndex = keyPath.length - 1;
    for (let i = 0; i < lastKeyIndex; ++i) {
      const key = keyPath[i];
      if (!(key in obj))
        // @ts-ignore
        obj[key] = {}; // @ts-ignore
      obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
  };

  for (const prop in params) {
    const structure = prop.split("[");
    if (structure.length > 1) {
      const levels: any = [];
      structure.forEach(function (item) {
        const key = item.replace(/[?[\]\\ ]/g, "");
        levels.push(key);
      });
      assign(params, levels, params[prop]);
      delete params[prop];
    }
  }
  return params;
};

Math.randomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Object.toQueryParams = function (obj) {
  const ret = [];
  for (const key in obj) {
    const val = obj[key];
    if (val !== undefined) {
      if (Array.isArray(val)) {
        val.forEach((v, i) => ret.push(`${key}[${i}]=${v}`));
      } else ret.push(`${key}=${val}`);
    }
  }
  return ret.join("&");
};

export {};
