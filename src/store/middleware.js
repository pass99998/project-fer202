// Middleware = đoạn code chạy SAU khi dispatch(action) và TRƯỚC khi action tới reducer.

// 1) logger: in mọi action và state mới ra console (chỉ khi đang phát triển)
export const logger = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'production') return next(action);

  console.group(action.type);
  console.log('payload:', action.payload);
  const result = next(action); // cho action đi tiếp tới reducer
  console.log('state mới:', store.getState());
  console.groupEnd();
  return result;
};

// 2) cartPersist: mỗi lần giỏ hàng đổi thì lưu vào localStorage để F5 không mất giỏ
const CART_KEY = 'pokeshop_cart';

export const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch (error) {
    return undefined;
  }
};

export const cartPersist = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type.startsWith('cart/')) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(store.getState().cart));
    } catch (error) {
      // bỏ qua: trình duyệt chặn localStorage thì chỉ mất tính năng lưu giỏ
    }
  }
  return result;
};
