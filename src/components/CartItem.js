import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { cardImage, FALLBACK_IMG, formatVND } from '../utils';

// Một dòng trong bảng giỏ hàng
function CartItem({ item, onQtyChange, onRemove }) {
  return (
    <tr>
      <td style={{ width: 90 }}>
        <img
          src={cardImage(item.pokedexId)}
          alt={item.name}
          width='64'
          height='64'
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
      </td>
      <td>
        <Link to={`/card/${item.id}`} className='fw-bold text-decoration-none'>
          {item.name}
        </Link>
        <div className='text-body-secondary small'>Còn {item.stock} thẻ</div>
      </td>
      <td>{formatVND(item.price)}</td>
      <td style={{ width: 170 }}>
        <InputGroup size='sm'>
          <Button variant='outline-secondary' onClick={() => onQtyChange(item.id, item.qty - 1)} disabled={item.qty <= 1}>
            -
          </Button>
          <Form.Control
            type='number'
            min='1'
            max={item.stock}
            value={item.qty}
            onChange={(e) => onQtyChange(item.id, Number(e.target.value) || 1)}
            aria-label={`Số lượng ${item.name}`}
            className='text-center'
          />
          <Button
            variant='outline-secondary'
            onClick={() => onQtyChange(item.id, item.qty + 1)}
            disabled={item.qty >= item.stock}
          >
            +
          </Button>
        </InputGroup>
      </td>
      <td className='fw-bold'>{formatVND(item.price * item.qty)}</td>
      <td>
        <Button variant='outline-danger' size='sm' onClick={() => onRemove(item)}>
          Xóa
        </Button>
      </td>
    </tr>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    pokedexId: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    qty: PropTypes.number.isRequired,
  }).isRequired,
  onQtyChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CartItem;
