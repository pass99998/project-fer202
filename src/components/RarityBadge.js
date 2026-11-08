import PropTypes from 'prop-types';
import Badge from 'react-bootstrap/Badge';
import { RARITIES } from '../utils';

const variants = {
  Common: 'secondary',
  Uncommon: 'success',
  Rare: 'primary',
  'Holo Rare': 'info',
  'Ultra Rare': 'warning',
  'Secret Rare': 'danger',
};

function RarityBadge({ rarity }) {
  const darkText = rarity === 'Holo Rare' || rarity === 'Ultra Rare';
  return (
    <Badge bg={variants[rarity] || 'secondary'} text={darkText ? 'dark' : undefined}>
      {rarity}
    </Badge>
  );
}

RarityBadge.propTypes = {
  rarity: PropTypes.oneOf(RARITIES).isRequired, // chỉ nhận một trong các độ hiếm đã khai báo
};

export default RarityBadge;
