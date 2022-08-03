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

export interface LoadingProps {
  needsLoad?: boolean;
}

export function useLoading<T>(
  input: RequestInfo,
  props: LoadingProps = {}
): [LoadingState<T, Error>, () => void, number] {
  const { needsLoad = true } = props;
  const [getState, setState] = useGetSet<LoadingState<T, any>>(Idle);
  const [loadCount, setLoadCount] = useState(0);
  const [lastLoadCount, setLastLoadCount] = useState<number | undefined>(undefined);
  const [lastLoad, setLastLoad] = useState<Date | null>(null);
  const [lastInput, setLastInput] = useState<RequestInfo>(input);
  useEffect(() => {
    if (!needsLoad) {
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
    async function performFetch() {
      try {
        const result = await fetchAndCheck();
        setState(Success(result));
      } catch (error: any) {
        // TODO: If this is a reload, it would be nice
        // to maybe still give the previous value somehow?
        setState(Failure(error));
      }
      setLastLoad(new Date());
    }
    if (loadCount === 0 || isFailure(getState()) || input !== lastInput) {
      setState(Loading);
    }
    setLastInput(input);
    setLastLoadCount(loadCount);
    performFetch();
  }, [input, lastInput, loadCount, getState, setState, lastLoadCount, needsLoad]);

  return [getState(), () => setLoadCount(c => c + 1), lastLoad?.getTime() || 0];
}

const random = (min: number, max: number) => Math.floor(min + Math.random() * Math.floor(max-min));
const randomJitter = () => random(-2000, 2000);

export function useAutoReloading<T>(input: RequestInfo, { interval } = { interval: 60 * 1000 }): [LoadingState<T, Error>, () => void, number] {
  const [loadState, onReload, lastLoad] = useLoading<T>(input);
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
