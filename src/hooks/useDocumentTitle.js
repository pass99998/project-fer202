import { useEffect } from 'react';

// Đặt tiêu đề tab trình duyệt cho từng trang
function useDocumentTitle(title) {
  useEffect(() => {
    document.title = `${title} | Poké Card Shop`;
  }, [title]);
}

export default useDocumentTitle;
