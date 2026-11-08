import { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Panel from '../components/Panel';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { selectCartItems, selectCartSubtotal } from '../store/cartSlice';
import { placeOrder, resetOrder } from '../store/ordersSlice';
import { formatVND } from '../utils';

const SHIPPING = {
  standard: { label: 'Giao tiêu chuẩn (3-5 ngày)', fee: 30000 },
  express: { label: 'Giao nhanh (1-2 ngày)', fee: 60000 },
};
const FREE_SHIP_FROM = 1000000; // đơn từ mức này được miễn phí giao tiêu chuẩn

const calcFee = (method, subtotal) => (method === 'standard' && subtotal >= FREE_SHIP_FROM ? 0 : SHIPPING[method].fee);

// State khởi tạo cho useReducer (tham số thứ 3 của useReducer)
function init(subtotal) {
  const fee = calcFee('standard', subtotal);
  return {
    values: { fullName: '', phone: '', address: '', note: '', payment: 'cod' },
    shipping: 'standard',
    subtotal,
    fee,
    total: subtotal + fee, // total phụ thuộc subtotal và fee, nên được tính ngay trong reducer
    submitted: false,
  };
}

// Reducer: một nơi duy nhất cập nhật state của cả form, kể cả các giá trị phụ thuộc nhau
function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, values: { ...state.values, [action.name]: action.value } };
    case 'SET_SHIPPING': {
      const fee = calcFee(action.method, state.subtotal);
      return { ...state, shipping: action.method, fee, total: state.subtotal + fee };
    }
    case 'SUBMIT':
      return { ...state, submitted: true };
    default:
      return state;
  }
}

function validate(values) {
  const errors = {};
  if (values.fullName.trim().length < 2) errors.fullName = 'Hãy nhập họ tên (ít nhất 2 ký tự)';
  if (!/^(0|\+84)\d{9,10}$/.test(values.phone.trim())) errors.phone = 'Số điện thoại không hợp lệ (ví dụ 0912345678)';
  if (values.address.trim().length < 8) errors.address = 'Địa chỉ quá ngắn, hãy ghi rõ số nhà, đường, quận';
  return errors;
}

function Checkout() {
  useDocumentTitle('Thanh toán');
  const dispatch = useDispatch();
  const { user } = useAuth();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const order = useSelector((state) => state.orders);

  const [state, dispatchForm] = useReducer(reducer, subtotal, init);
  const errors = validate(state.values);
  const showError = (field) => state.submitted && Boolean(errors[field]);

  // Dọn dẹp khi rời trang: đặt lại trạng thái đơn hàng
  useEffect(() => {
    return () => {
      dispatch(resetOrder());
    };
  }, [dispatch]);

  const handleChange = (e) => dispatchForm({ type: 'SET_FIELD', name: e.target.name, value: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault(); // chặn trình duyệt tải lại trang
    dispatchForm({ type: 'SUBMIT' });
    if (Object.keys(errors).length > 0) return;

    const { fullName, phone, address, note, payment } = state.values;
    dispatch(
      placeOrder({
        userId: user.id,
        customer: { fullName: fullName.trim(), phone: phone.trim(), address: address.trim(), note },
        payment,
        shipping: state.shipping,
        fee: state.fee,
        total: state.total,
      })
    );
  };

  // Đặt hàng thành công (giỏ đã được xóa trong thunk)
  if (order.status === 'done' && order.lastOrder) {
    return (
      <Alert variant='success'>
        <Alert.Heading>Đặt hàng thành công!</Alert.Heading>
        <p>
          Mã đơn hàng của bạn là <strong>#{order.lastOrder.id}</strong>, tổng thanh toán{' '}
          <strong>{formatVND(order.lastOrder.total)}</strong>. Cảm ơn bạn đã mua thẻ tại Poké Card Shop.
        </p>
        <Button as={Link} to='/cards' variant='success'>
          Tiếp tục mua sắm
        </Button>
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <Alert variant='info'>
        Giỏ hàng đang trống. <Alert.Link as={Link} to='/cards'>Chọn thẻ để mua</Alert.Link>
      </Alert>
    );
  }

  return (
    <>
      <h1 className='h2 mb-4'>Thanh toán</h1>
      {order.status === 'error' && <Alert variant='danger'>Đặt hàng thất bại: {order.error}</Alert>}

      <Row className='g-4'>
        <Col lg={7}>
          <Panel title='Thông tin giao hàng'>
            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className='mb-3' controlId='fullName'>
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control
                  name='fullName'
                  value={state.values.fullName}
                  onChange={handleChange}
                  isInvalid={showError('fullName')}
                />
                <Form.Control.Feedback type='invalid'>{errors.fullName}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className='mb-3' controlId='phone'>
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  name='phone'
                  inputMode='tel'
                  value={state.values.phone}
                  onChange={handleChange}
                  isInvalid={showError('phone')}
                />
                <Form.Control.Feedback type='invalid'>{errors.phone}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className='mb-3' controlId='address'>
                <Form.Label>Địa chỉ nhận hàng</Form.Label>
                <Form.Control
                  name='address'
                  value={state.values.address}
                  onChange={handleChange}
                  isInvalid={showError('address')}
                />
                <Form.Control.Feedback type='invalid'>{errors.address}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className='mb-3' controlId='note'>
                <Form.Label>Ghi chú (không bắt buộc)</Form.Label>
                <Form.Control as='textarea' rows={2} name='note' value={state.values.note} onChange={handleChange} />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>Cách giao hàng</Form.Label>
                {Object.entries(SHIPPING).map(([method, info]) => (
                  <Form.Check
                    key={method}
                    type='radio'
                    id={`ship-${method}`}
                    name='shipping'
                    label={`${info.label} - ${formatVND(calcFee(method, state.subtotal))}`}
                    checked={state.shipping === method}
                    onChange={() => dispatchForm({ type: 'SET_SHIPPING', method })}
                  />
                ))}
              </Form.Group>

              <Form.Group className='mb-4'>
                <Form.Label>Thanh toán</Form.Label>
                <Form.Check
                  type='radio'
                  id='pay-cod'
                  name='payment'
                  value='cod'
                  label='Trả tiền khi nhận hàng (COD)'
                  checked={state.values.payment === 'cod'}
                  onChange={handleChange}
                />
                <Form.Check
                  type='radio'
                  id='pay-bank'
                  name='payment'
                  value='bank'
                  label='Chuyển khoản ngân hàng'
                  checked={state.values.payment === 'bank'}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button type='submit' variant='primary' size='lg' disabled={order.status === 'loading'}>
                {order.status === 'loading' && <Spinner as='span' animation='border' size='sm' className='me-2' />}
                Đặt hàng
              </Button>
            </Form>
          </Panel>
        </Col>

        <Col lg={5}>
          <Panel title='Đơn hàng của bạn'>
            <ul className='list-unstyled mb-3'>
              {items.map((item) => (
                <li key={item.id} className='d-flex justify-content-between'>
                  <span>
                    {item.name} x {item.qty}
                  </span>
                  <span>{formatVND(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <hr />
            <div className='d-flex justify-content-between'>
              <span>Tạm tính</span>
              <span>{formatVND(state.subtotal)}</span>
            </div>
            <div className='d-flex justify-content-between'>
              <span>Phí giao hàng</span>
              <span>{state.fee === 0 ? 'Miễn phí' : formatVND(state.fee)}</span>
            </div>
            <div className='d-flex justify-content-between fs-5 fw-bold mt-2'>
              <span>Tổng cộng</span>
              <span className='text-primary'>{formatVND(state.total)}</span>
            </div>
          </Panel>
        </Col>
      </Row>
    </>
  );
}

export default Checkout;
