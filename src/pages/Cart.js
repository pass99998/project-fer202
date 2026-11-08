import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import CartItem from '../components/CartItem';
import ConfirmModal from '../components/ConfirmModal';
import Panel from '../components/Panel';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { clearCart, removeFromCart, selectCartItems, selectCartSubtotal, setQty } from '../store/cartSlice';
import { formatVND } from '../utils';

function Cart() {
  useDocumentTitle('Giỏ hàng');
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  const [itemToRemove, setItemToRemove] = useState(null); // thẻ đang chờ xác nhận xóa
  const [showClear, setShowClear] = useState(false);

  if (items.length === 0) {
    return (
      <Alert variant='info'>
        Giỏ hàng đang trống. <Alert.Link as={Link} to='/cards'>Xem các thẻ đang bán</Alert.Link>
      </Alert>
    );
  }

  const handleQtyChange = (id, qty) => dispatch(setQty({ id, qty }));

  return (
    <>
      <h1 className='h2 mb-4'>Giỏ hàng ({items.length} loại thẻ)</h1>

      <Row className='g-4'>
        <Col lg={8}>
          <Table responsive className='align-middle'>
            <thead>
              <tr>
                <th></th>
                <th>Thẻ</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <CartItem key={item.id} item={item} onQtyChange={handleQtyChange} onRemove={setItemToRemove} />
              ))}
            </tbody>
          </Table>
        </Col>

        <Col lg={4}>
          <Panel title='Tóm tắt đơn hàng'>
            <div className='d-flex justify-content-between mb-2'>
              <span>Tạm tính</span>
              <strong>{formatVND(subtotal)}</strong>
            </div>
            <p className='text-body-secondary small'>Phí giao hàng được tính ở bước thanh toán.</p>
            <div className='d-grid gap-2'>
              <Button as={Link} to='/checkout' variant='primary'>
                Tiến hành thanh toán
              </Button>
              <Button variant='outline-danger' onClick={() => setShowClear(true)}>
                Xóa toàn bộ giỏ
              </Button>
            </div>
          </Panel>
        </Col>
      </Row>

      <ConfirmModal
        show={itemToRemove !== null}
        title='Xóa khỏi giỏ hàng'
        message={`Bạn muốn xóa "${itemToRemove?.name}" khỏi giỏ hàng?`}
        confirmText='Xóa'
        onConfirm={() => {
          dispatch(removeFromCart(itemToRemove.id));
          setItemToRemove(null);
        }}
        onCancel={() => setItemToRemove(null)}
      />

      <ConfirmModal
        show={showClear}
        title='Xóa toàn bộ giỏ hàng'
        message='Tất cả thẻ trong giỏ sẽ bị xóa. Bạn chắc chắn chứ?'
        confirmText='Xóa hết'
        onConfirm={() => {
          dispatch(clearCart());
          setShowClear(false);
        }}
        onCancel={() => setShowClear(false)}
      />
    </>
  );
}

export default Cart;
