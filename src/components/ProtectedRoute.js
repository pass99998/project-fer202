import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import { useAuth } from '../context/AuthContext';

// Route bảo vệ: chưa đăng nhập -> chuyển sang /login (nhớ trang định vào để quay lại sau).
// Có truyền `role` -> còn phải đúng vai trò (ví dụ 'admin').
function ProtectedRoute({ role }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  if (role && user.role !== role) {
    return <Alert variant='danger'>Bạn không có quyền truy cập trang này.</Alert>;
  }
  return <Outlet />; // hiện route con bên trong
}

ProtectedRoute.propTypes = { role: PropTypes.string };

export default ProtectedRoute;
