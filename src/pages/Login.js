import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

function Login() {
  useDocumentTitle('Đăng nhập');
  const { user, login } = useAuth(); // lấy dữ liệu và hàm login từ Context
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/'; // trang người dùng định vào trước khi bị chuyển sang đây

  const [form, setForm] = useState({ username: '', password: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Đã đăng nhập rồi thì không cần ở trang này nữa
  if (user) return <Navigate to={from} replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!form.username.trim() || !form.password) return;

    setLoading(true);
    setError('');
    try {
      await login(form.username.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className='mx-auto' style={{ maxWidth: 420 }}>
      <Card>
        <Card.Body>
          <Card.Title as='h1' className='h3 mb-3'>
            Đăng nhập
          </Card.Title>

          {error && <Alert variant='danger'>{error}</Alert>}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className='mb-3' controlId='username'>
              <Form.Label>Tên đăng nhập</Form.Label>
              <Form.Control
                name='username'
                value={form.username}
                onChange={handleChange}
                isInvalid={submitted && !form.username.trim()}
                autoFocus
              />
              <Form.Control.Feedback type='invalid'>Hãy nhập tên đăng nhập</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='mb-3' controlId='password'>
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type='password'
                name='password'
                value={form.password}
                onChange={handleChange}
                isInvalid={submitted && !form.password}
              />
              <Form.Control.Feedback type='invalid'>Hãy nhập mật khẩu</Form.Control.Feedback>
            </Form.Group>

            <div className='d-grid'>
              <Button type='submit' variant='primary' disabled={loading}>
                {loading && <Spinner as='span' animation='border' size='sm' className='me-2' />}
                Đăng nhập
              </Button>
            </div>
          </Form>

          <hr />
          <p className='small text-body-secondary mb-1'>Tài khoản thử nghiệm:</p>
          <ul className='small text-body-secondary mb-0'>
            <li>Khách hàng: user / user123</li>
            <li>Quản trị: admin / admin123</li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
