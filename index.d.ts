import { AlertButton as AlertButtonRN } from "react-native";

type AlertButton = [
  text: string,
  onPress?: () => void,
  style?: AlertButtonRN["style"]
];

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
  type SizeProps<S> = Create<"size", S, number>;
  type ColorProps<C> = Create<"color", C>;
  type FontProps<F> = Create<"font", F>;
  type BGProps<C> = Create<"backgroundColor", C>;
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
  interface Array<T> {
    toRnStyle: () => T[];
    replace: (index: number, data: T) => T[];
    remove: (index: number,) => T[];
    mmap<U>(
      callback: (
        value: { item: T; isFirst: boolean; isLast: boolean },
        index: number
      ) => U
    ): U[];
  }

  interface Number {
    /**
     * @param si True to use metric (SI) units, aka powers of 1000. False to use binary (IEC), aka powers of 1024.
     * @param dp Number of decimal places to display.
     */
    humanFileSize(si?: boolean, dp?: number): string;
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
    getQueryParams(): Record<string, string>;
  }

  interface Math {
    randomInt: (min: number, max: number) => number;
  }

  interface Object {
    toQueryParams(obj: Record<string, unknown>): string;
  }

  function noop(): null;
  function noopVoid(): void;
  function animate(): Promise<void>;
  function Alert(
    ...params: [
      message: string,
      optionsOrTitle?:
        | string
        | {
            title?: string;
            cancelable?: boolean;
            buttons?: Partial<Tuple<AlertButton, 3>>;
            onDismiss?: () => void;
          }
    ]
  ): void;
  function BGMap<C extends MyObject>(props: BGProps<C>): string;
  function FontMap<F extends MyObject>(props: FontProps<F>): string;
  function ColorMap<C extends MyObject>(props: ColorProps<C>): string;
  function SizeMap<S extends MyObject<number>>(props: SizeProps<S>): number;
  function prettyConsole(...args: any[]): void;
  function prettyJSON(object: object): string;
  function uuid(): string;
}
