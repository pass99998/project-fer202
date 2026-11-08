import { useState } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { CARD_TYPES, RARITIES } from '../utils';

const EMPTY = {
  name: '',
  pokedexId: '',
  type: 'Fire',
  rarity: 'Common',
  set: '',
  hp: '',
  price: '',
  stock: '',
  description: '',
};

function validate(form) {
  const errors = {};
  const dex = Number(form.pokedexId);
  if (!form.name.trim()) errors.name = 'Hãy nhập tên thẻ';
  if (!Number.isInteger(dex) || dex < 1 || dex > 1025) errors.pokedexId = 'Số Pokédex từ 1 đến 1025';
  if (!(Number(form.hp) > 0)) errors.hp = 'HP phải lớn hơn 0';
  if (!(Number(form.price) > 0)) errors.price = 'Giá phải lớn hơn 0';
  if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) errors.stock = 'Tồn kho là số nguyên không âm';
  return errors;
}

// Modal thêm/sửa thẻ. Cha chỉ render component này khi cần mở, nên mỗi lần mở là một state mới.
function CardFormModal({ card, onSave, onClose }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...card }));
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const errors = validate(form);
  const isEdit = Boolean(card && card.id);

  // Một handler dùng chung cho mọi ô nhập, phân biệt nhau bằng thuộc tính name
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    setError('');
    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        pokedexId: Number(form.pokedexId),
        hp: Number(form.hp),
        price: Number(form.price),
        stock: Number(form.stock),
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  // Hiện lỗi cho từng ô sau khi bấm Lưu lần đầu
  const bad = (field) => submitted && Boolean(errors[field]);

  return (
    <Modal show onHide={onClose} size='lg' backdrop='static'>
      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? `Sửa thẻ: ${card.name}` : 'Thêm thẻ mới'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Row className='g-3'>
            <Col md={8}>
              <Form.Label htmlFor='name'>Tên thẻ</Form.Label>
              <Form.Control id='name' name='name' value={form.name} onChange={handleChange} isInvalid={bad('name')} />
              <Form.Control.Feedback type='invalid'>{errors.name}</Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label htmlFor='pokedexId'>Số Pokédex</Form.Label>
              <Form.Control
                id='pokedexId'
                name='pokedexId'
                type='number'
                value={form.pokedexId}
                onChange={handleChange}
                isInvalid={bad('pokedexId')}
              />
              <Form.Control.Feedback type='invalid'>{errors.pokedexId}</Form.Control.Feedback>
            </Col>

            <Col md={4}>
              <Form.Label htmlFor='type'>Hệ</Form.Label>
              <Form.Select id='type' name='type' value={form.type} onChange={handleChange}>
                {CARD_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label htmlFor='rarity'>Độ hiếm</Form.Label>
              <Form.Select id='rarity' name='rarity' value={form.rarity} onChange={handleChange}>
                {RARITIES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label htmlFor='set'>Bộ thẻ (set)</Form.Label>
              <Form.Control id='set' name='set' value={form.set} onChange={handleChange} />
            </Col>

            <Col md={4}>
              <Form.Label htmlFor='hp'>HP</Form.Label>
              <Form.Control
                id='hp'
                name='hp'
                type='number'
                value={form.hp}
                onChange={handleChange}
                isInvalid={bad('hp')}
              />
              <Form.Control.Feedback type='invalid'>{errors.hp}</Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label htmlFor='price'>Giá bán</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  id='price'
                  name='price'
                  type='number'
                  value={form.price}
                  onChange={handleChange}
                  isInvalid={bad('price')}
                />
                <InputGroup.Text>₫</InputGroup.Text>
                <Form.Control.Feedback type='invalid'>{errors.price}</Form.Control.Feedback>
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Label htmlFor='stock'>Tồn kho</Form.Label>
              <Form.Control
                id='stock'
                name='stock'
                type='number'
                value={form.stock}
                onChange={handleChange}
                isInvalid={bad('stock')}
              />
              <Form.Control.Feedback type='invalid'>{errors.stock}</Form.Control.Feedback>
            </Col>

            <Col xs={12}>
              <Form.Label htmlFor='description'>Mô tả</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                id='description'
                name='description'
                value={form.description}
                onChange={handleChange}
              />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={onClose} disabled={saving}>
            Hủy
          </Button>
          <Button type='submit' variant='primary' disabled={saving}>
            {saving && <Spinner as='span' animation='border' size='sm' className='me-2' />}
            Lưu thẻ
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

CardFormModal.propTypes = {
  card: PropTypes.object, // null/undefined = thêm mới
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CardFormModal;
