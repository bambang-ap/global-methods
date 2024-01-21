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

  interface Array<T> {
    replace(index: number, data: T): T[];
    replace(index: number, callback: (data: T) => T): T[];
    toRnStyle: () => T[];
    remove: (index: number) => T[];
    generateRows(
      numColumns: number,
      sameCount?: boolean
    ): { data: T[][]; rows: number };
    mmap<U>(callback: MMapCallback<T, U>): U[];
    nest<K extends keyof T>(
      nestProperty: string,
      nestId: K,
      nestForeignId: K
    ): T[];
  }

  interface Number {
    /**
     * @param si True to use metric (SI) units, aka powers of 1000. False to use binary (IEC), aka powers of 1024.
     * @param dp Number of decimal places to display.
     * @param op String | False @default 'B' as Byte. Set to False if you want to hide operator
     */
    humanize(opts?: { si?: boolean; dp?: number; op?: string | false }): string;
    getPercentage(total?: number, dp?: number): number;
    ratio(ratio: string): { width: number; height: number };
    toRoman(): string;
    toAlphabet(): string;
  }

  interface String {
    extractNumber(): number;
    pascalToSpace(): string;
    kebabToCamel(): string;
    snakeToCamel(): string;
    camelToSnake(): string;
    camelToKebab(): string;
    ucfirst(): string;
    lcfirst(): string;
    ucwords(): string;
    trimSpaces(): string;
    isBase64File(): boolean;
    removeSpecialChar(): string;
    validURL(): boolean;
    getRawUrl(): string | false;
    getQueryParams(): MyObject;
    toStringFromQueryParams(): MyObject;
  }

  interface Math {
    randomInt: (min: number, max: number) => number;
  }

  interface Object {
    toQueryParams(obj: Record<string, string>): string;
  }

  function typingDebounce(callback: NoopVoid, timeout?: number): void;
  function classNames(...inputs: ClassValue[]): string;
  function uuid(): string;
  function noop(): null;
  function noopVoid(): void;
  function prettyJSON(object: object): string;
  function entries<T extends object>(obj?: T): Entries<T>;
  function prettyConsole(...args: any[]): void;
  function reorderArrayIndex<T>(
    array: T[],
    fromIndex: number,
    toIndex: number
  ): T[];
}
