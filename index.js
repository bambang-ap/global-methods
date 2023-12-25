"use strict";
/// <reference path="../index.d.ts" />
function toVal(mix) {
    var k, y, str = "";
    if (typeof mix === "string" || typeof mix === "number") {
        str += mix;
    }
    else if (typeof mix === "object") {
        if (Array.isArray(mix)) {
            for (k = 0; k < mix.length; k++) {
                if (mix[k]) {
                    if ((y = toVal(mix[k]))) {
                        str && (str += " ");
                        str += y;
                    }
                }
            }
        }
        else {
            for (k in mix) {
                if (mix[k]) {
                    str && (str += " ");
                    str += k;
                }
            }
        }
    }
    return str;
}
globalThis.classNames = function () {
    var i = 0, tmp, x, str = "";
    while (i < arguments.length) {
        if ((tmp = arguments[i++])) {
            if ((x = toVal(tmp))) {
                str && (str += " ");
                str += x;
            }
        }
    }
    return str;
};
globalThis.reorderArrayIndex = function (arr, fromIndex, toIndex) {
    const array = arr.slice();
    if (fromIndex < 0 || fromIndex >= array.length)
        return array;
    if (toIndex < 0 || toIndex >= array.length)
        return array;
    const element = array[fromIndex];
    array.splice(fromIndex, 1);
    array.splice(toIndex, 0, element);
    return array;
};
globalThis.prettyConsole = (...objects) => {
    return objects.forEach((message) => typeof message === "object"
        ? console.log(prettyJSON(message))
        : console.log(message));
};
globalThis.prettyJSON = (object) => {
    return JSON.stringify(object, null, 4);
};
globalThis.uuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        let r = (Math.random() * 16) | 0, v = c === "x" ? r : r & (0x3 | 0x8);
        return v.toString(16);
    });
};
globalThis.entries = function (obj) {
    if (!obj)
        return [];
    return Object.entries(obj);
};
globalThis.noop = function () {
    return null;
};
globalThis.noopVoid = function () { };
Array.prototype.nest = function (nestProperty, nestId, nestForeignId) {
    const array = this;
    return array.reduce((nested, item) => {
        item[nestProperty] = array.filter((itemToCompare) => itemToCompare[nestForeignId] === item[nestId]);
        if (item[nestForeignId] == null) {
            nested.push(item);
        }
        return nested;
    }, []);
};
Array.prototype.replace = function (index, dataOrCallback) {
    const state = this;
    const dataL = state.slice(0, index);
    const dataR = state.slice(index + 1);
    if (index >= 0 && index < (state === null || state === void 0 ? void 0 : state.length)) {
        if (typeof dataOrCallback === "function") {
            return [...dataL, dataOrCallback(state[index]), ...dataR];
        }
        else
            return [...dataL, dataOrCallback, ...dataR];
    }
    return state;
};
Array.prototype.remove = function (index) {
    const state = this;
    const dataL = state.slice(0, index);
    const dataR = state.slice(index + 1);
    if (index > 0)
        return [...dataL, ...dataR];
    else
        return dataR;
};
Array.prototype.generateRows = function (numColumns, sameCount = false) {
    const array = this;
    return array.reduce((ret, curr, i) => {
        const n = i / numColumns;
        const isRound = n - Math.floor(n) === 0;
        if (isRound) {
            if (sameCount)
                ret.data.push(Array.from({ length: numColumns }, noop));
            else
                ret.data.push([]);
            ret.rows += 1;
        }
        if (sameCount) {
            const index = i % numColumns;
            ret.data[ret.rows][index] = curr;
        }
        else
            ret.data[ret.rows].push(curr);
        return ret;
    }, { data: [], rows: -1 });
};
Array.prototype.mmap = function (callback) {
    const arr = this;
    return arr.map((item, index) => {
        return callback({ item, isFirst: index === 0, isLast: index + 1 === arr.length }, index);
    });
};
Array.prototype.toRnStyle = function () {
    const styles = this.reduce((styles, style) => {
        const keys = Object.keys(style || {});
        if (keys.includes("0")) {
            return (styles = [...styles, ...keys.map((key) => style[key], {})]);
        }
        else {
            styles.push(style);
        }
        return styles;
    }, []);
    return styles;
};
Number.prototype.humanize = function (opts) {
    let bytes = this, indexUnit = -1;
    const { si = true, dp = 1, op = "B" } = opts !== null && opts !== void 0 ? opts : {};
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh)
        return classNames(bytes.toFixed(dp), op);
    const rank = 10 ** dp;
    const units = si
        ? ["K", "M", "G", "T", "P", "E", "Z", "Y"]
        : ["Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi", "Yi"];
    do {
        bytes /= thresh;
        ++indexUnit;
    } while (Math.round(Math.abs(bytes) * rank) / rank >= thresh &&
        indexUnit < units.length - 1);
    return classNames(bytes.toFixed(dp), units[indexUnit], op);
};
Number.prototype.getPercentage = function calculate(total = 0, dp = 2) {
    const current = this;
    return parseInt(((total / current) * 100).toFixed(3));
};
Number.prototype.ratio = function (ratio) {
    ratio = ratio.replace(/\:/g, "/");
    const height = eval(this.toString());
    const width = height * eval(ratio);
    return { height, width };
};
Number.prototype.toAlphabet = function () {
    let s = "", n = this - 1;
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
    let number = this, result = "";
    if (number > 0 && number < 4000) {
        let key;
        for (key in roman) {
            const h = roman[key];
            while (h <= number) {
                result += key;
                number -= h;
            }
        }
        return result;
    }
    else {
        throw new Error("Error. Number should be greater than 0 and less than 4000.");
    }
};
const caseReplacer = (str, separator) => {
    const arr = str.split(separator);
    const capital = arr.map((item, index) => index
        ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
        : item.toLowerCase());
    const toCase = capital.join("");
    return toCase;
};
const caseReplacerFromPascal = function (str, separator) {
    return str.split(/(?=[A-Z])/).join(separator);
};
const caseReplacerFromCamel = function (str, separator) {
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
    }
    catch (e) {
        return 0;
    }
    return 0;
};
String.prototype.pascalToSpace = function () {
    return caseReplacerFromPascal(this, " ");
};
String.prototype.kebabToCamel = function () {
    const camelCase = caseReplacer(this, "-");
    return camelCase;
};
String.prototype.snakeToCamel = function () {
    const camelCase = caseReplacer(this, "_");
    return camelCase;
};
String.prototype.camelToSnake = function () {
    const snakeCase = caseReplacerFromCamel(this, "_");
    return snakeCase;
};
String.prototype.camelToKebab = function () {
    const kebabCase = caseReplacerFromCamel(this, "-");
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
        const regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
        return !!this.match(regex);
    }
    catch (error) {
        return false;
    }
};
String.prototype.getRawUrl = function () {
    const url = this;
    if (!url.validURL())
        return false;
    const str = decodeURI(url);
    return str.split("?")[0];
};
String.prototype.validURL = function () {
    const str = this;
    const pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
    return !!pattern.test(str);
};
String.prototype.getQueryParams = String.prototype.toStringFromQueryParams =
    function () {
        const url = this;
        const query = url.substring(url.indexOf("?") + 1);
        if (query.includes(url))
            return {};
        const re = /([^&=]+)=?([^&]*)/g;
        const decodeRE = /\+/g;
        const decode = (str) => {
            return decodeURIComponent(str.replace(decodeRE, " "));
        };
        let e = re.exec(query);
        const params = {};
        while (e) {
            let k = decode(e[1]);
            const v = decode(e[2]);
            if (k.substring(k.length - 2) === "[]") {
                k = k.substring(0, k.length - 2);
                // @ts-ignore
                (params[k] || (params[k] = [])).push(v);
            }
            else
                params[k] = v;
        }
        const assign = function (obj, keyPath, value) {
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
                const levels = [];
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
    const params = Object.entries(obj).reduce((ret, [key, value]) => {
        if (value !== undefined)
            ret.push(`${key}=${value}`);
        return ret;
    }, []);
    return params.join("&");
};
