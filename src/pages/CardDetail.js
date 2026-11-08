import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import RarityBadge from '../components/RarityBadge';
import { API_URL } from '../api/api';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useEnsureCards from '../hooks/useEnsureCards';
import { addToCart } from '../store/cartSlice';
import { cardImage, FALLBACK_IMG, formatVND, typeColor } from '../utils';

function CardDetail() {
  const { id } = useParams(); // lấy :id từ đường dẫn /card/:id
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useEnsureCards();

  const [card, setCard] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ok | notfound | error
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useDocumentTitle(card ? card.name : 'Chi tiết thẻ');

  // Dùng fetch + AbortController: nếu người dùng đổi sang thẻ khác (hoặc rời trang)
  // trước khi server trả lời thì hủy request cũ, tránh cập nhật state sai.
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setStatus('loading');
      setAdded(false);
      try {
        const res = await fetch(`${API_URL}/cards/${id}`, { signal: controller.signal });
        if (res.status === 404) {
          setStatus('notfound');
          return;
        }
        if (!res.ok) throw new Error(`Lỗi HTTP ${res.status}`);
        setCard(await res.json());
        setQty(1);
        setStatus('ok');
      } catch (err) {
        if (err.name !== 'AbortError') setStatus('error');
      }
    }

    load();
    return () => controller.abort(); // hàm dọn dẹp
  }, [id]);

  const related = useMemo(
    () => (card ? items.filter((c) => c.type === card.type && c.id !== card.id).slice(0, 4) : []),
    [items, card]
  );

  if (status === 'loading') {
    return (
      <div className='text-center py-5'>
        <Spinner animation='border' />
      </div>
    );
  }
  if (status === 'notfound') {
    return (
      <Alert variant='warning'>
        Không tìm thấy thẻ này. <Alert.Link as={Link} to='/cards'>Quay lại cửa hàng</Alert.Link>
      </Alert>
    );
  }
  if (status === 'error') {
    return <Alert variant='danger'>Không tải được thông tin thẻ. Hãy kiểm tra json-server (npm run server).</Alert>;
  }

  const soldOut = card.stock === 0;

  // Dùng hàm cập nhật (prev) => ... để luôn dựa trên giá trị mới nhất của state
  const increase = () => setQty((q) => Math.min(card.stock, q + 1));
  const decrease = () => setQty((q) => Math.max(1, q - 1));

  const handleAdd = () => {
    dispatch(addToCart({ card, qty }));
    setAdded(true);
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ card, qty }));
    navigate('/cart');
  };

  return (
    <>
      <Button variant='link' className='px-0 mb-3' onClick={() => navigate(-1)}>
        ← Quay lại
      </Button>

      <Row className='g-4'>
        <Col md={5}>
          <div className='detail-art' style={{ '--type-color': typeColor[card.type] }}>
            <img
              src={cardImage(card.pokedexId)}
              alt={card.name}
              className='img-fluid'
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMG;
              }}
            />
          </div>
        </Col>

        <Col md={7}>
          <h1 className='h2'>{card.name}</h1>
          <p className='mb-3'>
            <RarityBadge rarity={card.rarity} />
          </p>
          <p>{card.description}</p>

          <Table size='sm' className='w-auto'>
            <tbody>
              <tr>
                <th className='pe-4'>Hệ</th>
                <td>{card.type}</td>
              </tr>
              <tr>
                <th>Bộ thẻ</th>
                <td>{card.set}</td>
              </tr>
              <tr>
                <th>HP</th>
                <td>{card.hp}</td>
              </tr>
              <tr>
                <th>Số Pokédex</th>
                <td>#{card.pokedexId}</td>
              </tr>
              <tr>
                <th>Tồn kho</th>
                <td>{soldOut ? 'Hết hàng' : `${card.stock} thẻ`}</td>
              </tr>
            </tbody>
          </Table>

          <p className='h3 text-primary'>{formatVND(card.price)}</p>

          {added && (
            <Alert variant='success' dismissible onClose={() => setAdded(false)}>
              Đã thêm vào giỏ hàng. <Alert.Link as={Link} to='/cart'>Xem giỏ hàng</Alert.Link>
            </Alert>
          )}

          <div className='d-flex flex-wrap gap-2 align-items-center'>
            <InputGroup style={{ width: 150 }}>
              <Button variant='outline-secondary' onClick={decrease} disabled={soldOut || qty <= 1}>
                -
              </Button>
              <Form.Control readOnly value={qty} className='text-center' aria-label='Số lượng' />
              <Button variant='outline-secondary' onClick={increase} disabled={soldOut || qty >= card.stock}>
                +
              </Button>
            </InputGroup>
            <Button variant='primary' onClick={handleAdd} disabled={soldOut}>
              Thêm vào giỏ
            </Button>
            <Button variant='outline-primary' onClick={handleBuyNow} disabled={soldOut}>
              Mua ngay
            </Button>
          </div>
        </Col>
      </Row>

      {related.length > 0 && (
        <section className='mt-5'>
          <h2 className='h4'>Thẻ cùng hệ {card.type}</h2>
          <ul className='list-inline'>
            {related.map((c) => (
              <li key={c.id} className='list-inline-item me-3'>
                <Link to={`/card/${c.id}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

export default CardDetail;
