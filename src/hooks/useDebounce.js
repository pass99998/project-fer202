import { useState, useEffect } from 'react';

// Trả về giá trị "chậm lại": chỉ đổi sau khi người dùng ngừng gõ `delay` mili-giây.
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // dọn dẹp: hủy timer cũ mỗi khi value đổi hoặc component bị gỡ
  }, [value, delay]);

  return debounced;
}

export default useDebounce;
