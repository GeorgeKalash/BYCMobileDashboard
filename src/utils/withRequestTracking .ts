import { useAppDispatch } from '@/Redux/Hooks';
import { incrementRequests, decrementRequests } from '@/Redux/Reducers/RequestSlice';

export const withRequestTracking = async <T>(
  dispatch: ReturnType<typeof useAppDispatch>,
  requestFn: () => Promise<T>
): Promise<T> => {
  dispatch(incrementRequests());

  try {
    return await requestFn();
  } finally {
    dispatch(decrementRequests());
  }
};
