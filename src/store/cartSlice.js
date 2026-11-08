import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    // payload: { card, qty }
    addToCart: (state, action) => {
      const { card, qty = 1 } = action.payload;
      const found = state.items.find((item) => item.id === card.id);
      if (found) {
        found.qty = Math.min(found.qty + qty, card.stock); // không vượt quá tồn kho
      } else {
        state.items.push({
          id: card.id,
          name: card.name,
          pokedexId: card.pokedexId,
          price: card.price,
          stock: card.stock,
          qty: Math.min(qty, card.stock),
        });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    // payload: { id, qty }
    setQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.qty = Math.max(1, Math.min(qty, item.stock));
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, setQty, clearCart } = cartSlice.actions;

// ---- Selectors ----
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.qty, 0);
export const selectCartSubtotal = (state) => state.cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);

export default cartSlice.reducer;
