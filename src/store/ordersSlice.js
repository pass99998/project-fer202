import { createSlice } from '@reduxjs/toolkit';
import { createOrder } from '../api/api';
import { clearCart } from './cartSlice';
import { saveCard } from './cardsSlice';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { status: 'idle', lastOrder: null, error: null }, // idle | loading | done | error
  reducers: {
    orderStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    orderSuccess: (state, action) => {
      state.status = 'done';
      state.lastOrder = action.payload;
    },
    orderFailure: (state, action) => {
      state.status = 'error';
      state.error = action.payload;
    },
    resetOrder: (state) => {
      state.status = 'idle';
      state.lastOrder = null;
      state.error = null;
    },
  },
});

export const { orderStart, orderSuccess, orderFailure, resetOrder } = ordersSlice.actions;

// Thunk dùng cả dispatch lẫn getState.
// Các bước: tạo đơn -> trừ tồn kho (Promise.all chạy song song) -> xóa giỏ -> báo thành công.
export const placeOrder = (info) => async (dispatch, getState) => {
  dispatch(orderStart());
  try {
    const { items } = getState().cart;
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    const order = {
      ...info, // userId, customer, payment, shipping, fee, total
      items: items.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
      subtotal,
      status: 'Chờ xử lý',
      createdAt: new Date().toISOString(),
    };
    const saved = await createOrder(order);

    await Promise.all(
      items.map((item) => {
        const card = getState().cards.items.find((c) => c.id === item.id);
        if (!card) return null;
        return dispatch(saveCard({ ...card, stock: Math.max(0, card.stock - item.qty) }));
      })
    );

    dispatch(clearCart());
    dispatch(orderSuccess(saved));
  } catch (error) {
    dispatch(orderFailure(error.message));
  }
};

export default ordersSlice.reducer;
