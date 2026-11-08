import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import RarityBadge from './RarityBadge';
import { cardImage, FALLBACK_IMG, formatVND, typeColor } from '../utils';

// Component chỉ hiển thị (presentational): nhận dữ liệu qua props, báo sự kiện lên cha qua onAdd
function PokemonCard({ card, onAdd }) {
  const navigate = useNavigate();
  const soldOut = card.stock === 0;

  const openDetail = () => navigate(`/card/${card.id}`);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') openDetail();
  };

  // Nút nằm bên trong thẻ có onClick: dùng stopPropagation để bấm nút KHÔNG mở trang chi tiết
  const handleAdd = (e) => {
    e.stopPropagation();
    onAdd(card);
  };

  return (
    <Card
      className='pokemon-card h-100'
      style={{ '--type-color': typeColor[card.type] }}
      role='button'
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={handleKeyDown}
    >
      <div className='pokemon-card__art'>
        <Card.Img
          variant='top'
          src={cardImage(card.pokedexId)}
          alt={card.name}
          loading='lazy'
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
        <Badge bg='dark' className='pokemon-card__hp'>
          HP {card.hp}
        </Badge>
      </div>

      <Card.Body className='d-flex flex-column'>
        <Card.Title className='mb-1'>{card.name}</Card.Title>
        <Card.Subtitle className='text-body-secondary mb-2'>
          {card.type} - {card.set}
        </Card.Subtitle>
        <div>
          <RarityBadge rarity={card.rarity} />
        </div>

        <div className='mt-auto pt-3 d-flex justify-content-between align-items-center gap-2'>
          <strong>{formatVND(card.price)}</strong>
          <Button size='sm' variant={soldOut ? 'secondary' : 'primary'} disabled={soldOut} onClick={handleAdd}>
            {soldOut ? 'Hết hàng' : 'Thêm vào giỏ'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

PokemonCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    pokedexId: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    rarity: PropTypes.string.isRequired,
    set: PropTypes.string,
    hp: PropTypes.number,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
  }).isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default PokemonCard;
