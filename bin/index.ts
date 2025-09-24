/// <reference path="../index.d.ts" />

function toVal(mix: any) {
	let k,
		y,
		str = "";

	if (typeof mix === "string" || typeof mix === "number") {
		str += mix;
	} else if (typeof mix === "object") {
		if (Array.isArray(mix)) {
			for (k = 0; k < mix.length; k++) {
				if (mix[k]) {
					if ((y = toVal(mix[k]))) {
						str && (str += " ");
						str += y;
					}
				}
			}
		} else {
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

globalThis.sleep = function (ms = 500) {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

globalThis.toQueryParams = function (obj) {
	const params = Object.entries(obj).reduce<string[]>((ret, [key, value]) => {
		if (value !== undefined) ret.push(`${key}=${value}`);

		return ret;
	}, []);

	return params.join("&");
};

globalThis.classNames = function () {
	let i = 0,
		tmp,
		x,
		str = "";

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

globalThis.prettyConsole = (...objects) => {
	return objects.forEach((message) =>
		typeof message === "object"
			? console.log(prettyJSON(message))
			: console.log(message)
	);
};

let typingTimer: ReturnType<typeof setTimeout>;
globalThis.typingDebounce = function (callback: () => void, timeout = 500) {
	clearTimeout(typingTimer);
	typingTimer = setTimeout(callback, timeout);
};

globalThis.prettyJSON = (object) => {
	return JSON.stringify(object, null, 4);
};

globalThis.uuid = () => {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		let r = (Math.random() * 16) | 0,
			v = c === "x" ? r : r & (0x3 | 0x8);
		return v.toString(16);
	});
};

globalThis.entries = function <T extends object>(obj?: T) {
	if (!obj) return [];

	return Object.entries(obj) as Entries<T>;
};

globalThis.noop = function () {
	return null;
};

globalThis.noopVoid = function () {};

type TComment = {
	id: number;
	text: string;
	parent_id?: TComment["id"];
	subMenu?: TComment[];
};

Array.prototype.position = function (index) {
	const { length } = this;
	const isLast = length - 1 === index;
	const isFirst = index === 0;
	return { isFirst, isLast };
};

Array.prototype.sortOrder = function (order, callback) {
	const arr = this as unknown[];
	const [leftSide, rightSide]: [unknown[], unknown[]] = [[], []];

	for (const item of arr) {
		const index = order.indexOf(callback(item));
		if (index < 0) rightSide.push(item);
		else leftSide.push(item);
	}

	const orderedRightSide = rightSide.sort((a, b) => {
		return +callback(a) - +callback(b);
	});

	const orderedLeftSide = leftSide.sort((a, b) => {
		return order.indexOf(callback(a)) - order.indexOf(callback(b));
	});

	const result = [...orderedLeftSide, ...orderedRightSide];

	return result;
};

Array.prototype.nest = function (nestProperty, nestId, nestForeignId) {
	const array = this;
	return array.reduce((nested, item) => {
		item[nestProperty] = array.filter(
			(itemToCompare) => itemToCompare[nestForeignId] === item[nestId]
		);

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
	if (index >= 0 && index < state?.length) {
		if (typeof dataOrCallback === "function") {
			return [...dataL, dataOrCallback(state[index]), ...dataR];
		} else return [...dataL, dataOrCallback, ...dataR];
	}

	return state;
};

Array.prototype.remove = function (index) {
	const state = this;
	const dataL = state.slice(0, index);
	const dataR = state.slice(index + 1);
	if (index > 0) return [...dataL, ...dataR];
	else return dataR;
};

Array.prototype.generateRows = function (numColumns, sameCount = false) {
	type Ret = ReturnType<Array<unknown>["generateRows"]>;
	const array = this as [];

	return array.reduce(
		(ret, curr, i) => {
			const n = i / numColumns;
			const isRound = n - Math.floor(n) === 0;
			if (isRound) {
				if (sameCount) ret.data.push(Array.from({ length: numColumns }, noop));
				else ret.data.push([]);
				ret.rows += 1;
			}

			if (sameCount) {
				const index = i % numColumns;
				ret.data[ret.rows][index] = curr;
			} else ret.data[ret.rows].push(curr);

			return ret;
		},
		{ data: [], rows: -1 } as Ret
	);
};

Array.prototype.mmap = function (callback) {
	const arr = this as unknown[];
	return arr.map((item, index) => {
		return callback({ item, ...arr.position(index) }, index);
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

Array.prototype.reorderIndex = function (fromIndex: number, toIndex: number) {
	const array = this.slice();
	if (fromIndex < 0 || fromIndex >= array.length) return array;
	if (toIndex < 0 || toIndex >= array.length) return array;
	const element = array[fromIndex];
	array.splice(fromIndex, 1);
	array.splice(toIndex, 0, element);
	return array;
};

String.prototype.humanize = Number.prototype.humanize = function (opts) {
	const num = parseFloat(this.toString());
	let bytes = Number.isNaN(num) ? 0 : num,
		indexUnit = -1;

	const {
		opMin,
		dp = 1,
		op = "B",
		si = true,
		units: replaceUnits,
	} = opts ?? {};
	const thresh = si ? 1000 : 1024;

	if (Math.abs(bytes) < thresh)
		return classNames(bytes.toFixed(dp), opMin || op);

	const rank = 10 ** dp;
	const units =
		replaceUnits ||
		(si
			? ["K", "M", "G", "T", "P", "E", "Z", "Y"]
			: ["Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi", "Yi"]);

	do {
		bytes /= thresh;
		++indexUnit;
	} while (
		Math.round(Math.abs(bytes) * rank) / rank >= thresh &&
		indexUnit < units.length - 1
	);

	return classNames(
		bytes.toFixed(dp),
		[units[indexUnit], op].filter(Boolean).join("")
	);
};

Number.prototype.getPercentage = function calculate(total = 0, dp = 0) {
	const current = this as number;
	return parseInt(((total / current) * 100).toFixed(dp));
};

Number.prototype.ratio = function (ratio) {
	ratio = ratio.replace(/\:/g, "/") as `${number}:${number}`;
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

String.prototype.snakeToPascal = function () {
	const pascalCase = this.split("_")
		.map((txt) => txt.ucfirst())
		.join("");
	return pascalCase;
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

String.prototype.getQueryParams = function <T extends string>() {
	const url = this as string;

	if (!url.validURL()) return null;

	const regex = /[?&]([^=#]+)=([^&#]*)/g;

	let match: null | RegExpExecArray,
		params = {} as Record<T, string>;

	while ((match = regex.exec(url))) {
		if (!match) continue;
		const [, key, value] = match;
		params[key as T] = value;
	}

	return params;
};

Math.randomInt = function (min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

Math.add = function (init, ...values) {
	return values.reduce<number>(
		(t, c) => t + parseFloat(c?.toString() ?? "0"),
		init
	);
};

Math.subtract = function (init, ...values) {
	return values.reduce<number>(
		(t, c) => t - parseFloat(c?.toString() ?? "0"),
		init
	);
};

Math.multiply = function (init, ...values) {
	return values.reduce<number>(
		(t, c) => t * parseFloat(c?.toString() ?? "0"),
		init
	);
};

Math.div = function (init, ...values) {
	return values.reduce<number>(
		(t, c) => t / parseFloat(c?.toString() ?? "0"),
		init
	);
};
