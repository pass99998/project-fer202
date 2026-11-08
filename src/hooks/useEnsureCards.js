import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards } from '../store/cardsSlice';

// Custom Hook kết hợp useSelector + useDispatch + useEffect:
// nếu danh sách thẻ chưa được tải thì gọi API (qua thunk), còn lại trả về state hiện tại.
function useEnsureCards() {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.cards);
  const { loaded, loading, error } = state;

  useEffect(() => {
    if (!loaded && !loading && !error) dispatch(fetchCards());
  }, [dispatch, loaded, loading, error]);

  return state;
}

export default useEnsureCards;
