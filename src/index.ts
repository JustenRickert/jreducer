import { Reducer, Action } from "redux";

export const createReducer = <T extends any>(initial: T) => {
  const symbol = Symbol("reducer");

  const actionCreator = (update: (t: T) => T) => ({
    type: symbol,
    update
  });

  const reducer: Reducer<T, ReturnType<typeof actionCreator>> = (
    state = initial,
    action
  ) => {
    if (action.type === symbol) return action.update(state);
    return state;
  };

  return [reducer, actionCreator] as [typeof reducer, typeof actionCreator];
};

export const createRecordReducer = <T extends {}, K extends string>(
  initial: Record<K, T>
) => {
  const symbol = Symbol("record-reducer");

  const actionCreator = <J extends K | K[]>(
    key: J,
    update: T | ((t: T, k?: J extends K[] ? K : never) => T)
  ) => ({
    type: symbol,
    key: typeof key === "string" ? (key as K) : (key as K[]),
    update: update instanceof Function ? update : () => update
  });

  const reducer: Reducer<Record<K, T>, ReturnType<typeof actionCreator>> = (
    state = initial,
    action
  ) => {
    if (action.type === symbol)
      return Object.assign(
        {},
        state,
        typeof action.key === "string"
          ? {
              [action.key]: action.update(state[action.key])
            }
          : action.key.reduce(
              (o, k) => ({
                ...o,
                [k]: action.update(state[k], k)
              }),
              {}
            )
      );
    return state;
  };

  return [reducer, actionCreator] as [typeof reducer, typeof actionCreator];
};

type Inside<T> = T extends (infer U)[] ? U : never;

const createArrayReducer = <T, I extends number>(initial: T[]) => {
  const symbol = Symbol("array-reducer");

  const actionCreator = (index: I, update: (t: T) => T) => ({
    type: symbol,
    index,
    update
  });

  const reducer: Reducer<T[], ReturnType<typeof actionCreator>> = (
    state = initial,
    action
  ) => {
    if (action.type === symbol)
      return state.map((s, i) => (i === action.index ? action.update(s) : s));
    return state;
  };

  return [reducer, actionCreator];
};
