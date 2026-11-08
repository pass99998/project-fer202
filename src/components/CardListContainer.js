import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import CardList from './CardList';
import withLoading from '../hoc/withLoading';
import useEnsureCards from '../hooks/useEnsureCards';
import { fetchCards } from '../store/cardsSlice';
import { addToCart } from '../store/cartSlice';

// HOC bọc CardList: tự hiện spinner / thông báo lỗi
const CardListWithLoading = withLoading(CardList);

// Container component: lo việc LẤY dữ liệu và XỬ LÝ hành động, còn việc HIỂN THỊ giao cho CardList.
// Nếu cha truyền `cards` (đã lọc/sắp xếp) thì dùng, không thì hiện toàn bộ thẻ trong store.
function CardListContainer({ cards }) {
  const dispatch = useDispatch();
  const { items, loading, loaded, error } = useEnsureCards();
  const [toast, setToast] = useState({ show: false, name: '' });

  const handleAdd = (card) => {
    dispatch(addToCart({ card, qty: 1 }));
    setToast({ show: true, name: card.name });
  };

  return (
    <>
      <CardListWithLoading
        loading={loading || (!loaded && !error)}
        error={error}
        onRetry={() => dispatch(fetchCards())}
        cards={cards || items}
        onAdd={handleAdd}
      />

      <ToastContainer position='bottom-end' className='p-3 position-fixed'>
        <Toast
          show={toast.show}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
          delay={2000}
          autohide
          bg='success'
        >
          <Toast.Body className='text-white'>Đã thêm {toast.name} vào giỏ hàng</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

CardListContainer.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
};

export default CardListContainer;
