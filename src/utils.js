// Hàm tiện ích và hằng số dùng chung (ES6 modules: export / import)

export const formatVND = (n) => `${Number(n).toLocaleString('vi-VN')} ₫`;

// Ảnh minh họa lấy theo số Pokédex từ kho ảnh PokeAPI
export const cardImage = (pokedexId) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokedexId}.png`;

const placeholderSvg =
  "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>" +
  "<rect width='100%' height='100%' fill='#dee2e6'/>" +
  "<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6c757d' font-size='22'>Không có ảnh</text>" +
  '</svg>';
export const FALLBACK_IMG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(placeholderSvg)}`;

export const CARD_TYPES = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Fighting', 'Darkness', 'Colorless'];

// Thứ tự độ hiếm tăng dần
export const RARITIES = ['Common', 'Uncommon', 'Rare', 'Holo Rare', 'Ultra Rare', 'Secret Rare'];

export const typeColor = {
  Fire: '#E3350D',
  Water: '#2F80ED',
  Grass: '#3A9D5D',
  Electric: '#E0A800',
  Psychic: '#B04FBF',
  Fighting: '#A85B32',
  Darkness: '#3B3B4F',
  Colorless: '#8A8D91',
};

export const ORDER_STATUSES = ['Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'];
