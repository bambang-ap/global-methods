import { Dispatch, useEffect, useRef, useState, SetStateAction } from "react";

export * from "./useTicker";

type UseToggleRet = [
  boolean,
  (callback: boolean | ((state: boolean) => boolean)) => void
];

export const useToggle = (initState: boolean = false): UseToggleRet => {
  const [toggle, setToggle] = useState(initState);
  return [
    toggle,
    (callback) => {
      if (typeof callback === "function") {
        const newState = callback(toggle);
        setToggle(newState);
      } else {
        setToggle(callback);
      }
    },
  ];
};

export const useStateObject = <S extends MyObject<unknown>>(
  initState: S
): [state: S, dispatch: (newState: Partial<S>) => void] => {
  const keys = Object.keys(initState);
  let states = keys.reduce((ret, k) => {
    ret[k] = useState(initState[k]);
    return ret;
  }, {} as MyObject<ReturnType<typeof useState>>);
  const values = keys.reduce((ret, k) => {
    ret[k] = states[k][0];
    return ret;
  }, {} as MyObject<unknown>);
  const dispatch = keys.reduce((ret, k) => {
    ret[k] = states[k][1];
    return ret;
  }, {} as MyObject<Dispatch<unknown>>);
  const setters = (newState: Partial<S>) => {
    const keys = Object.keys(newState);
    keys.forEach((k) => {
      const value = newState[k];
      const dispathcer = dispatch[k];
      if (![value, dispathcer].includes(undefined)) dispatch[k](value);
    });
  };
  return [values as S, setters];
};

export const useStateArray = <S>(
  initState: S[] = [] as S[]
): [
  S[],
  /**
   * To replace current state value
   * @valueOrIndex You can pass value or index of array.
   * If value, its will be added to current state
   * If index, value of that index will be removed.
   * @index Replace value in that index
   */
  (valueOrIndex: S | S[], index?: number) => void,
  /**
   * Init or replace your current state with the new one
   * @overrideValue The value to replace all
   */
  (overrideValue: S[]) => void
] => {
  const [state, setState] = useState(initState || []);
  return [
    state,
    (valueOrIndex, indexOrPush) => {
      let newState = state.slice();
      if (Array.isArray(valueOrIndex)) {
        newState = [...newState, ...valueOrIndex];
      } else {
        if (typeof indexOrPush === "number") {
          newState[indexOrPush] = valueOrIndex;
        } else {
          newState.push(valueOrIndex);
        }
      }
      setState(newState);
    },
    (override) => setState(override),
  ];
};

type UseArrayRet<T> = [
  T[],
  {
    push: (data: T | T[]) => void;
    remove: (index: number) => void;
    replace: (index: number, data: T) => void;
    initialize: (newData: T[]) => void;
  }
];

export const useObject = <S extends MyObject<unknown>>(
	initState = {} as S,
): [S, (newState: Partial<S>) => void, Dispatch<SetStateAction<S>>] => {
	const [state, _setState] = useState<S>(initState);

	const setState = (newState: Partial<S> | ((prevState: S) => Partial<S>)) => {
		if (typeof newState === 'function') {
			const stateNew = newState(state);
			return _setState(prevState => ({...prevState, ...stateNew}));
		}

		return _setState(prevState => ({...prevState, ...newState}));
	};

	return [state, setState, _setState];
};

export const useArray = <T>(initialState: T[] = []): UseArrayRet<T> => {
  type Manager = UseArrayRet<T>[1];
  const [state, setState] = useState<T[]>(initialState);

  const initialize: Manager["initialize"] = (newData) => {
    setState(newData);
  };

  const push: Manager["push"] = (data) => {
    if (Array.isArray(data)) setState([...state, ...data]);
    else setState([...state, data]);
  };

  const replace: Manager["replace"] = (index, data) => {
    setState(state.replace(index, data));
  };

  const remove: Manager["remove"] = (index) => {
    setState(state.remove(index));
  };

  return [state, { replace, push, remove, initialize }];
};

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<typeof callback>();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay !== null) {
      let id = setInterval(() => {
        savedCallback?.current?.();
      }, delay);
      return () => clearInterval(id);
    }
    return noop;
  }, [delay]);
};
