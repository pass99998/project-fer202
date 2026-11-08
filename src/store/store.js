import { configureStore } from '@reduxjs/toolkit';
import cardsReducer from './cardsSlice';
import cartReducer from './cartSlice';
import ordersReducer from './ordersSlice';
import { logger, cartPersist, loadCart } from './middleware';

const savedCart = loadCart();

const store = configureStore({
  // Mỗi "lát" (slice) quản lý một phần của cây state: state.cards, state.cart, state.orders
  reducer: {
    cards: cardsReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
  preloadedState: savedCart ? { cart: savedCart } : undefined,
  // getDefaultMiddleware đã có sẵn Redux Thunk; ta nối thêm 2 middleware tự viết
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger, cartPersist),
});

export default store;
