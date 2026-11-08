import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Pagination from 'react-bootstrap/Pagination';
import CardListContainer from '../components/CardListContainer';
import FilterBar from '../components/FilterBar';
import useDebounce from '../hooks/useDebounce';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { selectCards } from '../store/cardsSlice';
import { RARITIES } from '../utils';

const PAGE_SIZE = 8;

const sorters = {
  name: (a, b) => a.name.localeCompare(b.name),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rarity: (a, b) => RARITIES.indexOf(b.rarity) - RARITIES.indexOf(a.rarity),
};

function Shop() {
  useDocumentTitle('Cửa hàng');

  // Tham số tùy chọn trên đường dẫn: /cards  hoặc  /cards/Fire
  const { type = 'all' } = useParams();
  // Query string: /cards?q=pika&rarity=Rare&sort=price-asc
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const items = useSelector(selectCards);

  const q = searchParams.get('q') || '';
  const rarity = searchParams.get('rarity') || 'all';
  const sort = searchParams.get('sort') || 'name';

  const [text, setText] = useState(q); // nội dung ô tìm kiếm (đổi theo từng phím gõ)
  const debouncedText = useDebounce(text, 400); // chỉ đổi khi ngừng gõ 0,4 giây
  const [page, setPage] = useState(1);
  const searchRef = useRef(null);

  // Khi người dùng ngừng gõ thì mới ghi từ khóa lên URL
  useEffect(() => {
    if (debouncedText === q) return;
    const next = new URLSearchParams(searchParams);
    if (debouncedText) next.set('q', debouncedText);
    else next.delete('q');
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText]);

  // Đổi bộ lọc thì quay về trang 1
  useEffect(() => {
    setPage(1);
  }, [type, q, rarity, sort]);

  // useMemo: lọc + sắp xếp chỉ chạy lại khi dữ liệu hoặc bộ lọc đổi
  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return items
      .filter((c) => type === 'all' || c.type === type)
      .filter((c) => rarity === 'all' || c.rarity === rarity)
      .filter((c) => c.name.toLowerCase().includes(keyword))
      .sort(sorters[sort] || sorters.name);
  }, [items, type, rarity, q, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  const handleTypeChange = (value) =>
    navigate({ pathname: value === 'all' ? '/cards' : `/cards/${value}`, search: searchParams.toString() });

  const handleReset = () => {
    setText('');
    navigate('/cards');
    searchRef.current?.focus(); // useRef: đưa con trỏ về ô tìm kiếm
  };

  return (
    <>
      <h1 className='h2 mb-3'>Cửa hàng thẻ bài {type !== 'all' && <small className='text-body-secondary'>/ hệ {type}</small>}</h1>

      <FilterBar
        search={text}
        onSearchChange={setText}
        type={type}
        onTypeChange={handleTypeChange}
        rarity={rarity}
        onRarityChange={(value) => updateParam('rarity', value)}
        sort={sort}
        onSortChange={(value) => updateParam('sort', value)}
        onReset={handleReset}
        searchRef={searchRef}
      />

      <p className='text-body-secondary'>Tìm thấy {filtered.length} thẻ</p>

      <CardListContainer cards={pageItems} />

      {totalPages > 1 && (
        <Pagination className='justify-content-center mt-4'>
          <Pagination.Prev disabled={page === 1} onClick={() => setPage((p) => p - 1)} />
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Pagination.Item key={n} active={n === page} onClick={() => setPage(n)}>
              {n}
            </Pagination.Item>
          ))}
          <Pagination.Next disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} />
        </Pagination>
      )}
    </>
  );
}

export default Shop;
