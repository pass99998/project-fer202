import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Tabs from 'react-bootstrap/Tabs';
import CardFormModal from '../components/CardFormModal';
import ConfirmModal from '../components/ConfirmModal';
import RarityBadge from '../components/RarityBadge';
import { getCards, getOrders, patchOrder } from '../api/api';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { fetchSuccess, removeCard, saveCard, selectCards } from '../store/cardsSlice';
import { cardImage, FALLBACK_IMG, formatVND, ORDER_STATUSES } from '../utils';

function Admin() {
  useDocumentTitle('Quản trị');
  const dispatch = useDispatch();
  const cards = useSelector(selectCards);

  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | error
  const [errorText, setErrorText] = useState('');
  const [editing, setEditing] = useState(null); // null = đóng form; {} = thêm mới; card = sửa
  const [toDelete, setToDelete] = useState(null);
  const [message, setMessage] = useState(null); // { variant, text }

  // Tải thẻ và đơn hàng SONG SONG bằng Promise.all
  useEffect(() => {
    let cancelled = false; // tránh cập nhật state nếu component đã bị gỡ

    async function load() {
      try {
        const [cardsData, ordersData] = await Promise.all([getCards(), getOrders()]);
        if (cancelled) return;
        dispatch(fetchSuccess(cardsData));
        setOrders(ordersData);
        setStatus('ok');
      } catch (err) {
        if (cancelled) return;
        setErrorText(err.message);
        setStatus('error');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const stats = useMemo(
    () => ({
      revenue: orders.filter((o) => o.status !== 'Đã hủy').reduce((sum, o) => sum + o.total, 0),
      pending: orders.filter((o) => o.status === 'Chờ xử lý').length,
      lowStock: cards.filter((c) => c.stock <= 2).length,
    }),
    [orders, cards]
  );

  const handleSave = async (data) => {
    await dispatch(saveCard(data)); // lỗi (nếu có) được ném cho CardFormModal hiển thị
    setMessage({ variant: 'success', text: data.id ? `Đã cập nhật thẻ ${data.name}` : `Đã thêm thẻ ${data.name}` });
    setEditing(null);
  };

  const handleDelete = async () => {
    try {
      await dispatch(removeCard(toDelete.id));
      setMessage({ variant: 'success', text: `Đã xóa thẻ ${toDelete.name}` });
    } catch (err) {
      setMessage({ variant: 'danger', text: `Không xóa được: ${err.message}` });
    } finally {
      setToDelete(null);
    }
  };

  const handleStatusChange = async (order, newStatus) => {
    try {
      const updated = await patchOrder(order.id, { status: newStatus }); // PATCH: chỉ sửa trường status
      setOrders((list) => list.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      setMessage({ variant: 'danger', text: `Không cập nhật được đơn: ${err.message}` });
    }
  };

  if (status === 'loading') {
    return (
      <div className='text-center py-5'>
        <Spinner animation='border' />
      </div>
    );
  }
  if (status === 'error') {
    return <Alert variant='danger'>Không tải được dữ liệu quản trị: {errorText}</Alert>;
  }

  return (
    <>
      <h1 className='h2 mb-4'>Trang quản trị</h1>

      <Row xs={1} md={3} className='g-3 mb-4'>
        <Col>
          <Card body>
            <div className='text-body-secondary'>Doanh thu (trừ đơn đã hủy)</div>
            <div className='h4 mb-0'>{formatVND(stats.revenue)}</div>
          </Card>
        </Col>
        <Col>
          <Card body>
            <div className='text-body-secondary'>Đơn chờ xử lý</div>
            <div className='h4 mb-0'>{stats.pending}</div>
          </Card>
        </Col>
        <Col>
          <Card body>
            <div className='text-body-secondary'>Thẻ sắp hết hàng (còn từ 2 trở xuống)</div>
            <div className='h4 mb-0'>{stats.lowStock}</div>
          </Card>
        </Col>
      </Row>

      {message && (
        <Alert variant={message.variant} dismissible onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Tabs defaultActiveKey='cards' className='mb-3'>
        <Tab eventKey='cards' title={`Thẻ bài (${cards.length})`}>
          <div className='mb-3'>
            <Button variant='primary' onClick={() => setEditing({})}>
              + Thêm thẻ mới
            </Button>
          </div>

          <Table striped hover responsive className='align-middle'>
            <thead>
              <tr>
                <th></th>
                <th>Tên</th>
                <th>Hệ</th>
                <th>Độ hiếm</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cards.map((c) => (
                <tr key={c.id}>
                  <td style={{ width: 56 }}>
                    <img
                      src={cardImage(c.pokedexId)}
                      alt={c.name}
                      width='40'
                      height='40'
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMG;
                      }}
                    />
                  </td>
                  <td className='fw-bold'>{c.name}</td>
                  <td>{c.type}</td>
                  <td>
                    <RarityBadge rarity={c.rarity} />
                  </td>
                  <td>{formatVND(c.price)}</td>
                  <td className={c.stock <= 2 ? 'text-danger fw-bold' : ''}>{c.stock}</td>
                  <td className='text-nowrap'>
                    <Button size='sm' variant='outline-primary' className='me-2' onClick={() => setEditing(c)}>
                      Sửa
                    </Button>
                    <Button size='sm' variant='outline-danger' onClick={() => setToDelete(c)}>
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey='orders' title={`Đơn hàng (${orders.length})`}>
          {orders.length === 0 ? (
            <Alert variant='info'>Chưa có đơn hàng nào. Hãy đăng nhập tài khoản khách và đặt thử một đơn.</Alert>
          ) : (
            <Table striped responsive className='align-middle'>
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Khách hàng</th>
                  <th>Thời gian</th>
                  <th>Sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {[...orders].reverse().map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>
                      {o.customer.fullName}
                      <div className='small text-body-secondary'>{o.customer.phone}</div>
                    </td>
                    <td>{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
                    <td>{o.items.map((i) => `${i.name} x${i.qty}`).join(', ')}</td>
                    <td>{formatVND(o.total)}</td>
                    <td style={{ minWidth: 150 }}>
                      <Form.Select
                        size='sm'
                        value={o.status}
                        onChange={(e) => handleStatusChange(o, e.target.value)}
                        aria-label={`Trạng thái đơn ${o.id}`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </Form.Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
      </Tabs>

      {/* Chỉ render khi cần mở: mỗi lần mở form có state mới */}
      {editing && <CardFormModal card={editing} onSave={handleSave} onClose={() => setEditing(null)} />}

      <ConfirmModal
        show={toDelete !== null}
        title='Xóa thẻ'
        message={`Xóa vĩnh viễn thẻ "${toDelete?.name}" khỏi cửa hàng?`}
        confirmText='Xóa'
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

export default Admin;
