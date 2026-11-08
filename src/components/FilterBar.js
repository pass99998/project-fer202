import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { CARD_TYPES, RARITIES } from '../utils';

// Toàn bộ ô nhập là "controlled": giá trị nằm ở state của cha, FilterBar chỉ hiển thị và báo thay đổi.
function FilterBar({
  search,
  onSearchChange,
  type,
  onTypeChange,
  rarity,
  onRarityChange,
  sort,
  onSortChange,
  onReset,
  searchRef,
}) {
  return (
    <Form onSubmit={(e) => e.preventDefault()} className='mb-4'>
      <Row className='g-3 align-items-end'>
        <Col md={5}>
          <Form.Label htmlFor='search'>Tìm kiếm</Form.Label>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              id='search'
              ref={searchRef}
              type='search'
              placeholder='Nhập tên thẻ, ví dụ: Pikachu'
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </InputGroup>
        </Col>

        <Col sm={6} md={3}>
          <Form.Label htmlFor='rarity'>Độ hiếm</Form.Label>
          <Form.Select id='rarity' value={rarity} onChange={(e) => onRarityChange(e.target.value)}>
            <option value='all'>Tất cả</option>
            {RARITIES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col sm={6} md={3}>
          <Form.Label htmlFor='sort'>Sắp xếp</Form.Label>
          <Form.Select id='sort' value={sort} onChange={(e) => onSortChange(e.target.value)}>
            <option value='name'>Tên A-Z</option>
            <option value='price-asc'>Giá tăng dần</option>
            <option value='price-desc'>Giá giảm dần</option>
            <option value='rarity'>Độ hiếm cao nhất</option>
          </Form.Select>
        </Col>

        <Col md={1} className='d-grid'>
          <Button variant='outline-secondary' onClick={onReset}>
            Xóa lọc
          </Button>
        </Col>
      </Row>

      <div className='mt-3 d-flex flex-wrap gap-2'>
        <ToggleButtonGroup type='radio' name='card-type' value={type} onChange={onTypeChange}>
          <ToggleButton id='type-all' value='all' variant='outline-dark' size='sm'>
            Tất cả hệ
          </ToggleButton>
          {CARD_TYPES.map((t) => (
            <ToggleButton key={t} id={`type-${t}`} value={t} variant='outline-dark' size='sm'>
              {t}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
    </Form>
  );
}

FilterBar.propTypes = {
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  onTypeChange: PropTypes.func.isRequired,
  rarity: PropTypes.string.isRequired,
  onRarityChange: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  searchRef: PropTypes.shape({ current: PropTypes.any }),
};

export default FilterBar;
