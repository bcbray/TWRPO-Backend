import { useEffect, useState, useRef } from 'react';
import { useInterval, useGetSet } from 'react-use';

interface Idle_ {
  type: 'Idle';
};

interface Loading_ {
  type: 'Loading';
};

interface Success_<T> {
  type: 'Success';
  data: T;
};

interface Failure_<E> {
  type: 'Failure';
  error: E;
};

type LoadingState<T, E> = Idle_ | Loading_ | Success_<T> | Failure_<E>;

export const Idle: Idle_ = { type: 'Idle' };
export const Loading: Loading_ = { type: 'Loading' };
export const Success = <T>(data: T): Success_<T> => ({ type: 'Success', data, });
export const Failure = <E>(error: E): Failure_<E> => ({ type: 'Failure', error, });

export const isIdle = <T,E>(state: LoadingState<T, E>): state is Idle_ =>
  state.type === 'Idle';

export const isLoading = <T,E>(state: LoadingState<T, E>): state is Loading_ =>
  state.type === 'Loading';

export const isSuccess = <T,E>(state: LoadingState<T, E>): state is Success_<T> =>
  state.type === 'Success';

export const isFailure = <T,E>(state: LoadingState<T, E>): state is Failure_<E> =>
  state.type === 'Failure';

export interface LoadingProps<T> {
  preloaded?: T | null;
  needsLoad?: boolean;
  ignoreReloadFailures?: boolean;
  onReloadFailed?: (error: Error) => void;
  onReloadSuccess?: () => void;
}

export class NotFoundError extends Error {
  constructor(public body?: any) {
    super();
  }
}

export type LoadingResult<T> = [LoadingState<T, Error>, () => void, number];

export async function fetchAndCheck<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    if (response.status === 404) {
      throw new NotFoundError(await response.json());
    }
    throw Error(response.statusText);
  }
  return await response.json() as T;
}

export function useLoading<T>(
  input: RequestInfo,
  props: LoadingProps<T> = {}
): LoadingResult<T> {
  const {
    preloaded,
    needsLoad = true,
    ignoreReloadFailures = true,
    onReloadFailed,
    onReloadSuccess,
  } = props;
  const [getState, setState] = useGetSet<LoadingState<T, any>>(
    preloaded !== undefined && needsLoad
      ? preloaded === null
        ? Failure(new NotFoundError())
        : Success(preloaded)
      : Idle
  );
  const [loadCount, setLoadCount] = useState(0);
  const [lastLoad, setLastLoad] = useState<Date | null>(null);
  const lastLoadCountRef = useRef<number | undefined>(undefined);
  const lastInputRef = useRef<RequestInfo>(input);
  useEffect(() => {
    if (!needsLoad) {
      return;
    }
    if (preloaded !== undefined && loadCount === 0 && input === lastInputRef.current) {
      if (isIdle(getState())) {
        if (preloaded === null) {
          setState(Failure(new NotFoundError()));
        } else {
          setState(Success(preloaded));
        }
      }
      return;
    }
    if (loadCount === lastLoadCountRef.current && input === lastInputRef.current) {
      return;
    }
    async function performFetch(isReloadFromSuccess: boolean, isReloadFromFailure: boolean) {
      try {
        const result = await fetchAndCheck<T>(input);
        if (isReloadFromSuccess || isReloadFromFailure) {
          onReloadSuccess?.();
        }
        setState(Success(result));
      } catch (error: any) {
        if (isReloadFromSuccess || isReloadFromFailure) {
          onReloadFailed?.(error);
        }
        if (!isReloadFromSuccess || !ignoreReloadFailures) {
          setState(Failure(error));
        }
      }
      setLastLoad(new Date());
    }
    const isInitialLoad = loadCount === 0 || input !== lastInputRef.current;
    const isReloadFromSuccess = !isInitialLoad && isSuccess(getState());
    const isReloadFromFailure = !isInitialLoad && isFailure(getState());
    if (!isReloadFromSuccess && !isReloadFromFailure) {
      setState(Loading);
    }
    lastInputRef.current = input;
    lastLoadCountRef.current = loadCount;
    performFetch(isReloadFromSuccess, isReloadFromFailure);
  }, [input, loadCount, getState, setState, needsLoad, ignoreReloadFailures, onReloadFailed, onReloadSuccess, preloaded]);

  return [getState(), () => setLoadCount(c => c + 1), lastLoad?.getTime() || 0];
}

const random = (min: number, max: number) => Math.floor(min + Math.random() * Math.floor(max-min));
const randomJitter = () => random(-2000, 2000);

export interface AutoReloadingProps<T> extends LoadingProps<T> {
  interval?: number;
}

export function useAutoReloading<T>(
  input: RequestInfo,
  props: AutoReloadingProps<T> = {}
): LoadingResult<T> {
  const { interval = 60 * 1000, ...rest } = props;
  const [loadState, onReload, lastLoad] = useLoading<T>(input, rest);
  const [jitter, setJitter] = useState(randomJitter());

  useInterval(() => {
    // TODO: Would be nice to not start the interval until
    // after the load _becomes_ a success
    if (isSuccess(loadState)) {
      onReload();
      setJitter(randomJitter());
    }
  }, interval + jitter);

  const outerOnReload = () => {
    onReload();
    // Reset the jitter which will restart the interval
    // (yeah, yeah, kinda funky, might make my own useInterval
    // with a reset capability?)
    setJitter(randomJitter());
  };

  return [loadState, outerOnReload, lastLoad];
}

export default LoadingState;
