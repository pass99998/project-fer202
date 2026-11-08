import { useState, useEffect } from 'react';

// Custom Hook: giống useState nhưng tự lưu giá trị vào localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // bỏ qua nếu không ghi được
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
