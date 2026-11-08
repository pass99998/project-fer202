import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PokemonCard from './PokemonCard';

// Grid Bootstrap: 1 cột trên điện thoại, 2 cột từ sm, 4 cột từ lg
function CardList({ cards, onAdd }) {
  if (cards.length === 0) {
    return <Alert variant='warning'>Không tìm thấy thẻ phù hợp. Hãy đổi bộ lọc hoặc từ khóa khác.</Alert>;
  }

  return (
    <Row xs={1} sm={2} lg={4} className='g-4'>
      {cards.map((card) => (
        <Col key={card.id}>
          <PokemonCard card={card} onAdd={onAdd} />
        </Col>
      ))}
    </Row>
  );
}

CardList.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default CardList;
