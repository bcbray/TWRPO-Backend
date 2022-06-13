import { useEffect, useState } from 'react';

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

export const useLoading = <T>(input: RequestInfo, init?: RequestInit) => {
  const [state, setState] = useState<LoadingState<T, any>>(Idle);
  useEffect(() => {
    async function fetchAndCheck(): Promise<T> {
      const response = await fetch(input, init);
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
        setState(Failure(error));
      }
    }
    setState(Loading);
    performFetch();
  }, [input, init]);

  return [state];
}

export default LoadingState;
