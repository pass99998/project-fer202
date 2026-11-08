import { createSlice } from '@reduxjs/toolkit';
import { getCards, createCard, updateCard, deleteCard } from '../api/api';

const cardsSlice = createSlice({
  name: 'cards',
  initialState: { items: [], loading: false, loaded: false, error: null },
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    cardAdded: (state, action) => {
      state.items.push(action.payload);
    },
    cardUpdated: (state, action) => {
      const index = state.items.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    cardRemoved: (state, action) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, cardAdded, cardUpdated, cardRemoved } = cardsSlice.actions;

// ---- Redux Thunk: action creator trả về một HÀM async ----
export const fetchCards = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await getCards();
    dispatch(fetchSuccess(data));
  } catch (error) {
    dispatch(fetchFailure(error.message));
  }
};

// Thêm mới (chưa có id) hoặc cập nhật (đã có id). Lỗi được ném ra cho nơi gọi tự xử lý.
export const saveCard = (card) => async (dispatch) => {
  if (card.id) {
    const saved = await updateCard(card.id, card);
    dispatch(cardUpdated(saved));
    return saved;
  }
  const created = await createCard(card);
  dispatch(cardAdded(created));
  return created;
};

export const removeCard = (id) => async (dispatch) => {
  await deleteCard(id);
  dispatch(cardRemoved(id));
};

// ---- Selectors ----
export const selectCards = (state) => state.cards.items;

export default cardsSlice.reducer;
