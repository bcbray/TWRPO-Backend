import { useEffect, useState } from 'react';
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
  preloaded?: T;
  needsLoad?: boolean;
  onReloadFailed?: (error: Error) => void;
  onReloadSuccess?: () => void;
}

export type LoadingResult<T> = [LoadingState<T, Error>, () => void, number];

export function useLoading<T>(
  input: RequestInfo,
  props: LoadingProps<T> = {}
): LoadingResult<T> {
  const { preloaded, needsLoad = true, onReloadFailed, onReloadSuccess } = props;
  const [getState, setState] = useGetSet<LoadingState<T, any>>(
    preloaded && needsLoad ? Success(preloaded) : Idle
  );
  const [loadCount, setLoadCount] = useState(0);
  const [lastLoadCount, setLastLoadCount] = useState<number | undefined>(undefined);
  const [lastLoad, setLastLoad] = useState<Date | null>(null);
  const [lastInput, setLastInput] = useState<RequestInfo>(input);
  useEffect(() => {
    if (!needsLoad || (preloaded !== undefined && loadCount === 0)) {
      return;
    }
    if (loadCount === lastLoadCount && input === lastInput) {
      return;
    }
    async function fetchAndCheck(): Promise<T> {
      const response = await fetch(input);
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return await response.json() as T;
    }
    async function performFetch(isReloadFromSuccess: boolean, isReloadFromFailure: boolean) {
      try {
        const result = await fetchAndCheck();
        if (isReloadFromSuccess || isReloadFromFailure) {
          onReloadSuccess?.();
        }
        setState(Success(result));
      } catch (error: any) {
        if (isReloadFromSuccess || isReloadFromFailure) {
          onReloadFailed?.(error);
        }
        if (!isReloadFromSuccess) {
          setState(Failure(error));
        }
      }
      setLastLoad(new Date());
    }
    const isInitialLoad = loadCount === 0 || input !== lastInput;
    const isReloadFromSuccess = !isInitialLoad && isSuccess(getState());
    const isReloadFromFailure = !isInitialLoad && isFailure(getState());
    if (!isReloadFromSuccess && !isReloadFromFailure) {
      setState(Loading);
    }
    setLastInput(input);
    setLastLoadCount(loadCount);
    performFetch(isReloadFromSuccess, isReloadFromFailure);
  }, [input, lastInput, loadCount, getState, setState, lastLoadCount, needsLoad, onReloadFailed, onReloadSuccess, preloaded]);

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
