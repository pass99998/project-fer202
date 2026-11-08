import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { selectCartCount } from '../store/cartSlice';
import { CARD_TYPES } from '../utils';

function AppNavbar() {
  const cartCount = useSelector(selectCartCount); // đọc dữ liệu từ Redux store
  const { user, logout, isAdmin } = useAuth(); // đọc dữ liệu từ Context
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar expand='lg' className='navbar-poke' data-bs-theme='dark' sticky='top'>
      <Container>
        <Navbar.Brand as={Link} to='/' className='fw-bold d-flex align-items-center gap-2'>
          <span className='pokeball' aria-hidden='true' />
          Poké Card Shop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='main-nav' />

        <Navbar.Collapse id='main-nav'>
          <Nav className='me-auto'>
            <Nav.Link as={NavLink} to='/' end>
              Trang chủ
            </Nav.Link>
            <Nav.Link as={NavLink} to='/cards' end>
              Cửa hàng
            </Nav.Link>
            <NavDropdown title='Theo hệ' id='type-dropdown'>
              {CARD_TYPES.map((t) => (
                <NavDropdown.Item key={t} as={Link} to={`/cards/${t}`}>
                  {t}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>

          <Nav className='align-items-lg-center gap-lg-2'>
            <Nav.Link as={NavLink} to='/cart'>
              Giỏ hàng{' '}
              <Badge bg='warning' text='dark' pill>
                {cartCount}
              </Badge>
            </Nav.Link>

            <Button variant='outline-light' size='sm' onClick={toggleTheme} aria-label='Đổi giao diện sáng tối'>
              {theme === 'light' ? 'Tối' : 'Sáng'}
            </Button>

            {user ? (
              <NavDropdown title={`Chào, ${user.name}`} id='user-dropdown' align='end'>
                {isAdmin && (
                  <NavDropdown.Item as={Link} to='/admin'>
                    Trang quản trị
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item as={Link} to='/cart'>
                  Giỏ hàng của tôi
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={NavLink} to='/login'>
                Đăng nhập
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
