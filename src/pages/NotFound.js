import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import useDocumentTitle from '../hooks/useDocumentTitle';

// Route "*": bắt mọi đường dẫn không khớp route nào
function NotFound() {
  useDocumentTitle('Không tìm thấy trang');

  return (
    <div className='text-center py-5'>
      <p className='display-1 fw-bold text-primary mb-0'>404</p>
      <h1 className='h3'>Pokémon hoang dã này đã chạy mất!</h1>
      <p className='text-body-secondary'>Đường dẫn bạn mở không tồn tại trong cửa hàng.</p>
      <Button as={Link} to='/' variant='primary'>
        Về trang chủ
      </Button>
    </div>
  );
}

export default NotFound;
