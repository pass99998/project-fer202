import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import CardListContainer from '../components/CardListContainer';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { selectCards } from '../store/cardsSlice';
import { cardImage, RARITIES } from '../utils';

const slides = [
  { pokedexId: 6, title: 'Charizard Holo', text: 'Lá bài huyền thoại của bộ Base Set', to: '/card/1', color: '#E3350D' },
  { pokedexId: 25, title: 'Pikachu và những người bạn', text: 'Thẻ hệ Điện giá chỉ từ 150.000 ₫', to: '/cards/Electric', color: '#E0A800' },
  { pokedexId: 150, title: 'Mewtwo Ultra Rare', text: 'Chỉ còn 2 lá trong kho, săn ngay kẻo hết', to: '/card/6', color: '#B04FBF' },
];

const features = [
  { title: 'Thẻ chọn lọc', text: 'Mỗi lá bài đều có độ hiếm, bộ thẻ và tồn kho rõ ràng.' },
  { title: 'Giao hàng linh hoạt', text: 'Miễn phí giao tiêu chuẩn cho đơn từ 1.000.000 ₫.' },
  { title: 'Thanh toán dễ dàng', text: 'Hỗ trợ trả tiền khi nhận hàng hoặc chuyển khoản.' },
];

function Home() {
  useDocumentTitle('Trang chủ');
  const items = useSelector(selectCards);
  const [index, setIndex] = useState(0); // Carousel dạng controlled: state giữ slide đang hiện

  // useMemo: chỉ tính lại khi danh sách thẻ đổi. Lấy 4 thẻ hiếm nhất, hiếm bằng nhau thì xét giá.
  const featured = useMemo(
    () =>
      [...items]
        .sort((a, b) => RARITIES.indexOf(b.rarity) - RARITIES.indexOf(a.rarity) || b.price - a.price)
        .slice(0, 4),
    [items]
  );

  return (
    <>
      <Carousel activeIndex={index} onSelect={setIndex} interval={5000} className='hero mb-5'>
        {slides.map((s) => (
          <Carousel.Item key={s.title}>
            <div className='hero-slide' style={{ '--hero-color': s.color }}>
              <div className='hero-slide__text'>
                <h1 className='display-5 fw-extrabold'>{s.title}</h1>
                <p className='lead'>{s.text}</p>
                <Button as={Link} to={s.to} variant='light'>
                  Xem ngay
                </Button>
              </div>
              <img src={cardImage(s.pokedexId)} alt={s.title} className='hero-slide__img' />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <Row xs={1} md={3} className='g-3 mb-5'>
        {features.map((f) => (
          <Col key={f.title}>
            <Card className='h-100 border-0 bg-body-tertiary'>
              <Card.Body>
                <Card.Title>{f.title}</Card.Title>
                <Card.Text>{f.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className='d-flex justify-content-between align-items-end mb-3'>
        <h2 className='h3 mb-0'>Thẻ hiếm nổi bật</h2>
        <Link to='/cards'>Xem tất cả</Link>
      </div>
      <CardListContainer cards={featured} />
    </>
  );
}

export default Home;
