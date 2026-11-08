import axios from 'axios';

// json-server chạy bằng lệnh: npm run server  (cổng 3001)
export const API_URL = 'http://localhost:3001';

const api = axios.create({ baseURL: API_URL });

// Đổi thông báo lỗi mạng sang tiếng Việt dễ hiểu
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = 'Không kết nối được server. Hãy chạy lệnh: npm run server';
    }
    return Promise.reject(error);
  }
);

// ---- Thẻ bài: đủ 4 thao tác REST (GET, POST, PUT, DELETE) ----
export const getCards = async () => (await api.get('/cards')).data;
export const getCard = async (id) => (await api.get(`/cards/${id}`)).data;
export const createCard = async (card) => (await api.post('/cards', card)).data;
export const updateCard = async (id, card) => (await api.put(`/cards/${id}`, card)).data;
export const deleteCard = async (id) => (await api.delete(`/cards/${id}`)).data;

// ---- Đơn hàng ----
export const getOrders = async () => (await api.get('/orders')).data;
export const createOrder = async (order) => (await api.post('/orders', order)).data;
export const patchOrder = async (id, data) => (await api.patch(`/orders/${id}`, data)).data;

// ---- Đăng nhập (chỉ dùng cho bài tập: mật khẩu lưu thẳng trong db.json, không an toàn) ----
export const loginRequest = async (username, password) => {
  const { data } = await api.get('/users', { params: { username, password } });
  return data[0] || null;
};
