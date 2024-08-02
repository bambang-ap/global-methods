export {};

type ClassValue =
	| ClassArray
	| ClassDictionary
	| string
	| number
	| null
	| boolean
	| undefined;
type ClassDictionary = Record<string, any>;
type ClassArray = ClassValue[];

declare module "react" {
	function forwardRef<T, P = {}>(
		render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
	): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

declare global {
	type Noop = typeof noop;
	type NoopVoid = typeof noopVoid;
	type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
	type Tuple<T, N extends number = 1> = N extends N
		? number extends N
			? T[]
			: _TupleOf<T, N, []>
		: never;
	type _TupleOf<
		T,
		N extends number,
		R extends unknown[]
	> = R["length"] extends N ? R : _TupleOf<T, N, [T, ...R]>;
	type OptionalUnion<A, B> = A | (B & { key?: any });
	type TypeProp<A extends {}, B = string> =
		| keyof A
		| (B extends string ? "" : B & { property?: B });
	type GetProps<
		C extends (...args: any) => unknown,
		Exclude extends string | false = false
	> = Exclude extends string
		? Omit<Parameters<C>[0], Exclude>
		: Parameters<C>[0];
	type MyObject<T = string> = Record<string, T>;
	type Dict<V = string, K extends string = string> = Record<K, V>;
	type Create<K extends string, A, B = string> = { [Q in K as `${Q}s`]?: A } & {
		[Q in K]?: TypeProp<A, B>;
	};
	type NestedKeyOf<
		ObjectType extends object,
		Delimiter extends string = "-"
	> = {
		[Key in keyof ObjectType &
			(string | number)]: ObjectType[Key] extends object
			? never | `${Key}${Delimiter}${NestedKeyOf<ObjectType[Key], Delimiter>}`
			: `${Key}`;
	}[keyof ObjectType & (string | number)];
	type LiteralUnion<T extends U, U = string> = T | (U & { property?: never });
	type ToString<R extends string, L extends string = ""> = `${L}${R}`;
	type CamelCase<
		Separator extends string,
		S extends string
	> = S extends `${infer P1}${Separator}${infer P2}${infer P3}`
		? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<Separator, P3>}`
		: Lowercase<S>;
	type KeysToCamelCase<S extends string, T> = {
		[K in keyof T as CamelCase<S, string & K>]: T[K] extends {}
			? KeysToCamelCase<S, T[K]>
			: T[K];
	};
	type ObjFromTuple<
		T extends string,
		S extends string = "",
		Type = boolean,
		Separator extends string = "-"
	> = KeysToCamelCase<Separator, Record<ToString<T, S>, Type>>;
	type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
	type TheValue<C, S, F> = {
		colors?: C;
		sizes?: S;
		fonts?: F;
	};
	type UnionToIntersection<U> = (
		U extends any ? (k: U) => void : never
	) extends (k: infer I) => void
		? I
		: never;

	type MMapValue<T> = { item: T; isFirst: boolean; isLast: boolean };
	type MMapCallback<T, U> = (value: MMapValue<T>, index: number) => U;

	type ObjKeyof<T extends {}> = Extract<keyof T, string>;

	type NonArrayObject<T> = T extends object
		? {
				[K in keyof T]: T[K] extends object
					? NonArrayObject<T[K]> extends any[]
						? NonArrayObject<NonArrayObject<T[K]>[number]>
						: NonArrayObject<T[K]>
					: T[K];
		  }
		: T;

	type ObjectNonArray<T> = T extends Array<infer V>
		? ObjectNonArray<V>
		: T extends object
		? { [K in keyof T]: ObjectNonArray<T[K]> }
		: T;

	type Entries<T> = {
		[K in keyof T]: [K, T[K]];
	}[keyof T][];

	type UcWords<T> = T extends string ? Capitalize<T> : never;
	type PickIncludes<TObj, K extends keyof TObj> = {
		[P in keyof TObj as UcWords<P> extends `${infer Beginning}${UcWords<K>}${infer Rest}`
			? P
			: never]: TObj[P];
	};

	type OmitIncludes<TObj, K extends keyof TObj> = {
		[P in keyof TObj as UcWords<P> extends `${infer Beginning}${UcWords<K>}${infer Rest}`
			? never
			: P]: TObj[P];
	};

	type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
	type PartialOne<T, K extends keyof T> = AtLeast<T, Exclude<keyof T, K>>;

	interface Array<T> {
		/**
		 * Sort an array in place based on order parameter
		 * @param order (number | string)[]
		 * @param callback (value: T) => V
		 * 
		 * @example
		 * console.log([{ prop: 1 }, { prop: 2 }, { prop: 3 }].sort([2, 3, 1], v => v.prop))
		 * // [{ prop: 2 }, { prop: 3 }, { prop: 1 }]
		 */
		sortOrder<V extends number | string, J extends (value: T) => V>(
			order: V[],
			callback: J
		): T[];
		/**
		 * Replace array of index n with data
		 * @param index number
		 * @param data T
		 */
		replace(index: number, data: T): T[];
		/**
		 * Replace array of index n with callback data
		 * @param index number
		 * @param callback (data: T) => T
		 */
		replace(index: number, callback: (data: T) => T): T[];
		toRnStyle: () => T[];
		/** Remove array of index n */
		remove: (index: number) => T[];
		/**
		 * Generate multidimensional array for generating rows
		 * @param numColumns number
		 * @param sameCount boolean
		 * 
		 * @example
		 * [1,2,3,4,5].generateRows(3) -> [[1, 2, 3], [4, 5]]
		 * [1,2,3,4,5].generateRows(3, true) -> [[1, 2, 3], [4, 5, null]]
		 */
		generateRows(
			numColumns: number,
			sameCount?: boolean
		): { data: T[][]; rows: number };
		/**
		 * Regular mapping array with more callback value
		 * @param callback 
		 */
		mmap<U>(callback: MMapCallback<T, U>): U[];
		/**
		 * Change the array structure, this method is suitable for generating submenus
		 * @param nestProperty 
		 * @param nestId 
		 * @param nestForeignId 
		 * 
		 * @example
		 * [{ id: "123", parent_id: null, }, { parent_id: "123", id: "111", }].nest('subMenu', 'id', 'parent_id')
		 * // [{"id":"123","parent_id":null,"subMenu":[{"parent_id":"123","id":"111"}]}]
		 */
		nest<NP extends string, K extends keyof T, FK extends Exclude<keyof T, K>>(
			nestProperty: NP,
			nestId: K,
			nestForeignId: FK
		): Record<NP, T[]> & T extends infer U ? U[] : never
		/**
		 * 
		 * @param fromIndex number
		 * @param toIndex number
		 */
		reorderIndex(
			fromIndex: number,
			toIndex: number
		): T[];
	}


	interface Number {
		/** Convert number to readable value */
		humanize(opts?: {
			/**
			 * @param si True to use metric (SI) units, aka powers of 1000. False to use binary (IEC), aka powers of 1024.
			 */
			si?: boolean;
			/**
			 * @param dp Number of decimal places to display.
			 */
			dp?: number;
			/**
			 * @param op String | False @default 'B' as Byte. Set to False if you want to hide operator
			 */
			op?: string | false;
			/**
			 * @param opMin String operator for bellow threshold
			 */
			opMin?: string;
			/**
			 * @param units String[] @default ["K", "M", "G", "T", "P", "E", "Z", "Y"]
			 */
			units?: string[];
		}): string;
		/** Get percentage of current number of total */
		getPercentage(total?: number, decimalPoint?: number): number;
		/**
		 * An number utility to get width & height using aspectRatio
		 * @param aspectRatio 
		 */
		ratio(aspectRatio: `${number}:${number}`): { width: number; height: number };
		/** Convert number to roman number
		 * @example 1 -> I, 2 -> II
		 */
		toRoman(): string;
		/**
		 * You can use this to cover number to alphabet
		 * @example 1 -> a, 2 -> b, 27 -> aa
		 */
		toAlphabet(): string;
	}

	interface String {
		/** Convert number to readable value */
		humanize: Number["humanize"];
		/**
		 * Extract number from string
		 * @example "1a2b3c" -> 123
		 */
		extractNumber(): number;
		/**
		 * Convert pascal case to space case
		 * @example "PascalCase" -> "Pascal Case"
		 */
		pascalToSpace(): string;
		/**
		 * Convert kebab case to camel case
		 * @example "kebab-case" -> "kebabCase"
		 */
		kebabToCamel(): string;
		/**
		 * Convert snake case to camel case
		 * @example "snake_case" -> "snakeCase"
		 */
		snakeToCamel(): string;
		/**
		 * Convert camel case to snake case
		 * @example "camelCase" -> "camel_case"
		 */
		camelToSnake(): string;
		/**
		 * Convert camel case to camel case
		 * @example "camelCase" -> "camel-Case"
		 */
		camelToKebab(): string;
		/** Uppercase first @example "abc def" -> "Abc def" */
		ucfirst(): string;
		/** Uppercase first @example "ABC DEF" -> "aBC DEF" */
		lcfirst(): string;
		/** Uppercase first @example "abc def" -> "Abc Def" */
		ucwords(): string;
		/** Trim spaces @example "this   is   my       world" -> "this is my world" */
		trimSpaces(): string;
		/** Check if the string is base64 files */
		isBase64File(): boolean;
		/** Remove special characters @example "a&b(c:d>12(**4" -> "abcd1234" */
		removeSpecialChar(): string;
		/** Check if the string is valid url */
		validURL(): boolean;
		/** Extract raw Url and remove all queryParam @example "https://google.com?image=1&type=2" -> "https://google.com" */
		getRawUrl(): string | false;
		/** Extract query param from an Url @example "https://google.com?image=1&type=2" -> { image: 1, type: 2 } */
		getQueryParams<T extends string>(): null | Record<T, string>;
	}

	interface Math {
		/** Randomize integer */
		randomInt(min: number, max: number): number;
		/** Addition n + n */
		add(
			initValue: number,
			...values: (number | string | undefined | null)[]
		): number;
		/** Subtraction n - n */
		subtract: Math["add"];
		/** Multiplication n x n */
		multiply: Math["add"];
		/** Division n ÷ n */
		div: Math["add"];
	}

	/**
	 * Method to covert an object of string to queryParam string
	 * @param obj
	 * @returns string
	 * 
	 * @example
	 * toQueryParam({ param1: 123, param2: 123 }) -> "param1=123&param2=123"
	 */
	function toQueryParams(obj: Record<string, string>): string;
	/**
	 * Method to execute code after timeout after finished typing.
	 * For every user type, it will abort previous action.
	 * 
	 * @param callback any Function to execute after timeout
	 * @param timeout number
	 */
	function typingDebounce(callback: NoopVoid, timeout?: number): void;
	/**
	 * A simple utility for conditionally joining classNames together.
	 * @param args ClassValue
	 * @returns string
	 */
	function classNames(...inputs: ClassValue[]): string;
	/**
	 * Generate uuid v4 string
	 */
	function uuid(): string;
	/**
	 * An No Operation function
	 * @returns null
	 */
	function noop(): null;
	/**
	 * An No Operation function
	 * @returns undefined
	 */
	function noopVoid(): void;
	/** An typed Object.entries method */
	function entries<T extends object>(obj?: T): Entries<T>;
	/** JSON.stringify with formatted tabs */
	function prettyJSON(object: object): string;
	/** JSON.stringify with formatted tabs and console it */
	function prettyConsole(...args: any[]): void;
}
