# Poké Card Shop - Assignment React

Website bán thẻ bài Pokémon, viết bằng **React 18 (Create React App)** và tổng hợp lại hầu hết kiến thức của khóa học: từ ES6, JSX, Bootstrap, component, Hooks, Router, lazy/Suspense đến Redux Toolkit, Thunk và gọi REST API.

> Dữ liệu thẻ, giá và tồn kho là dữ liệu mẫu để làm bài tập. Hình ảnh Pokémon lấy từ kho ảnh của PokeAPI, thương hiệu Pokémon thuộc sở hữu của Nintendo, Game Freak và The Pokémon Company.

## 1. Chức năng của website

**Khách hàng**

- Trang chủ: Carousel giới thiệu, các thẻ hiếm nổi bật.
- Cửa hàng: tìm kiếm theo tên (có debounce), lọc theo hệ / độ hiếm, sắp xếp, phân trang. Bộ lọc nằm trên URL nên có thể sao chép đường dẫn để chia sẻ.
- Chi tiết thẻ: thông tin, chọn số lượng, thêm vào giỏ hoặc mua ngay, gợi ý thẻ cùng hệ.
- Giỏ hàng: tăng giảm số lượng (không vượt tồn kho), xóa từng thẻ hoặc xóa hết (có hộp thoại xác nhận). Giỏ hàng được lưu lại khi tải lại trang.
- Thanh toán (cần đăng nhập): form có kiểm tra dữ liệu, chọn cách giao hàng (phí tự đổi, miễn phí giao tiêu chuẩn từ 1.000.000 ₫), chọn cách thanh toán, đặt hàng.
- Đăng nhập / đăng xuất, giao diện sáng / tối.

**Quản trị viên** (`/admin`)

- Thống kê nhanh: doanh thu, số đơn chờ xử lý, số thẻ sắp hết hàng.
- Thêm, sửa, xóa thẻ bài.
- Xem đơn hàng và đổi trạng thái đơn.

## 2. Cách chạy

Yêu cầu: **Node.js 18 trở lên**.

```bash
npm install
```

Mở **2 cửa sổ Terminal** trong thư mục dự án:

```bash
# Terminal 1: server dữ liệu giả (json-server, cổng 3001)
npm run server

# Terminal 2: ứng dụng React (cổng 3000)
npm start
```

Mở `http://localhost:3000`. Nếu quên chạy server, ứng dụng sẽ hiện thông báo lỗi kèm nút "Thử lại".

| Tài khoản | Tên đăng nhập | Mật khẩu | Vai trò |
| --- | --- | --- | --- |
| Khách hàng | `user` | `user123` | user |
| Quản trị | `admin` | `admin123` | admin |

Muốn đưa dữ liệu về ban đầu: sao lưu rồi sửa lại file `db.json` (mảng `orders` để rỗng, `stock` của từng thẻ về giá trị cũ).

## 3. Kịch bản demo gợi ý (khi báo cáo)

1. Mở trang chủ: Carousel, lưới thẻ responsive (thu nhỏ cửa sổ để thấy số cột đổi).
2. Vào **Cửa hàng**, gõ "pi" vào ô tìm kiếm: URL đổi sau khi ngừng gõ (debounce). Thử lọc hệ, độ hiếm, sắp xếp, chuyển trang.
3. Bấm **Thêm vào giỏ** ngay trên thẻ: hiện thông báo mà không chuyển sang trang chi tiết (nhờ `stopPropagation`). Bấm vào thẻ để xem chi tiết.
4. Mở **Giỏ hàng**, đổi số lượng, thử xóa (hộp thoại xác nhận), tải lại trang (F5) để thấy giỏ vẫn còn.
5. Bấm **Thanh toán**: chưa đăng nhập nên bị chuyển sang `/login`, đăng nhập xong được đưa quay lại trang thanh toán.
6. Bỏ trống form rồi đặt hàng để thấy báo lỗi, sau đó điền đúng và đặt hàng. Tồn kho của thẻ giảm đi.
7. Đăng xuất, đăng nhập `admin`, vào **Trang quản trị**: thêm / sửa / xóa thẻ, đổi trạng thái đơn.
8. Bấm nút **Tối / Sáng** để đổi giao diện, mở một đường dẫn sai (ví dụ `/abc`) để thấy trang 404.
9. Mở Console của trình duyệt: mỗi action Redux đều được middleware `logger` ghi lại.

## 4. Cấu trúc thư mục

```text
pokemon-card-shop/
├─ db.json                     Dữ liệu cho json-server: cards, users, orders
├─ package.json
├─ public/index.html
└─ src/
   ├─ index.js                 Điểm khởi động: Provider, Router, Context
   ├─ App.js                   Khai báo route + trang lazy
   ├─ App.css                  Giao diện riêng (màu, thẻ bài, hero)
   ├─ utils.js                 Hàm và hằng số dùng chung
   ├─ api/api.js               Gọi REST API bằng Axios
   ├─ store/                   Redux Toolkit: cardsSlice, cartSlice, ordersSlice, middleware, store
   ├─ context/                 ThemeContext, AuthContext
   ├─ hooks/                   useLocalStorage, useDebounce, useDocumentTitle, useEnsureCards
   ├─ hoc/withLoading.js       Higher-Order Component
   ├─ components/              Navbar, Layout, PokemonCard, CardList, CardListContainer, FilterBar,
   │                           CartItem, ConfirmModal, CardFormModal, Panel, RarityBadge,
   │                           ErrorBoundary, StoreClock, ProtectedRoute, Redirect
   └─ pages/                   Home, Shop, CardDetail, Cart, Checkout, Login, Admin, NotFound
```

## 5. Đối chiếu kiến thức đã học với mã nguồn

| Phần kiến thức (Slot) | Được dùng ở đâu |
| --- | --- |
| **Slot 1**: Node.js, npm, Create React App, Git | `package.json` (scripts `start`, `build`, `server`), `.gitignore`, cách chạy ở mục 2 |
| **Slot 2-3**: ES6 | Arrow function, destructuring, spread, template literal, `map` / `filter` / `reduce`, module `import` / `export` khắp dự án. Rest `...rest` trong `hoc/withLoading.js`, `AuthContext.js`. Default parameter trong `ConfirmModal.js`, `useDebounce.js` |
| **Slot 2-3**: JSX | `map` + `key` (`CardList.js`), Fragment `<>`, điều kiện `&&` và `? :`, thuộc tính `style` là object (`PokemonCard.js`), component viết hoa chữ đầu |
| **Slot 4-5**: Bootstrap | Lưới 12 cột và breakpoint (`Row xs sm lg`, `Col md`), class tiện ích (`d-flex`, `gap-2`, `mb-4`...), responsive, dark mode `data-bs-theme` (`ThemeContext.js`), Navbar thu gọn |
| **Slot 6**: Component | Class component có vòng đời: `StoreClock.js` (`componentDidMount`, `componentWillUnmount`), `ErrorBoundary.js` (`componentDidCatch`). Function component ở mọi nơi khác. HOC: `hoc/withLoading.js`. Composition: `Panel.js` dùng `children` |
| **Slot 7**: React-Bootstrap | `Navbar`, `Nav`, `NavDropdown`, `Carousel`, `Card`, `Form`, `InputGroup`, `ToggleButtonGroup` (controlled), `Modal`, `Alert`, `Toast`, `Tabs`, `Table`, `Pagination`, `Spinner` |
| **Slot 8**: Props, State, Context | Props + giá trị mặc định (`StoreClock.js`), container và component hiển thị (`CardListContainer.js` / `CardList.js`), Context: `ThemeContext.js`, `AuthContext.js` |
| **Slot 9-10**: Hooks | `useState` (mọi trang), `useEffect` có dọn dẹp (`CardDetail.js`, `useDebounce.js`), `useContext` (`useAuth`, `useTheme`), `useReducer` (`pages/Checkout.js`), `useRef` (`Shop.js`), `useMemo` (`Shop.js`, `Home.js`, `Admin.js`), custom hook: `hooks/` |
| **Slot 11-12**: Sự kiện, Render và Commit, State snapshot | `onClick`, `onChange`, `onSubmit` + `preventDefault`, `stopPropagation` (`PokemonCard.js`), truyền tham số bằng hàm mũi tên, cập nhật state bằng hàm `setQty((q) => ...)` (`CardDetail.js`), `key` của `ErrorBoundary` trong `Layout.js` để làm mới khi đổi trang |
| **Slot 13**: PropTypes | Khai báo `propTypes` cho hầu hết component: `PokemonCard`, `CartItem`, `FilterBar`, `CardFormModal`, `ConfirmModal`, `RarityBadge`... (dùng `shape`, `oneOf`, `node`, `arrayOf`, `isRequired`) |
| **Slot 14**: React Router | `Routes` / `Route`, route cha + `Outlet` + `index` (`App.js`, `Layout.js`), tham số `:id` + `useParams` (`CardDetail.js`), tham số tùy chọn `/cards/:type` và query string `useSearchParams` (`Shop.js`), `Link` / `NavLink`, `useNavigate`, `Navigate`, `useLocation`, route bảo vệ (`ProtectedRoute.js`), `Redirect.js`, trang 404 (`path='*'`) |
| **Slot 15**: Code splitting | `React.lazy` cho từng trang trong `App.js`, `Suspense` + `FadeLoader` trong `Layout.js` |
| **Slot 16-17**: Redux | `configureStore`, `createSlice` (3 slice), `Provider`, `useSelector`, `useDispatch`, middleware tự viết (`store/middleware.js`: `logger`, `cartPersist`), Redux Thunk (`fetchCards`, `saveCard`, `removeCard`, `placeOrder` có dùng `getState`) |
| **Slot 18**: Client-Server, REST | `json-server` + `db.json`, đủ GET / POST / PUT / PATCH / DELETE (`api/api.js`), xử lý mã trạng thái 404 (`CardDetail.js`), dữ liệu JSON |
| **Slot 19**: Promise, async/await, fetch, Axios | Axios có `interceptors` (`api/api.js`), `fetch` + `AbortController` (`CardDetail.js`), `async/await` + `try/catch/finally` (`Login.js`, `Admin.js`), `Promise.all` (`Admin.js`, `ordersSlice.js`), lưu đệm dữ liệu thẻ trong Redux store để khỏi gọi lại (`useEnsureCards.js`) |
| **Slot 20**: Next.js, Tailwind | Không nằm trong dự án này vì là công cụ khác, xem mục 7 |

## 6. Các API dùng trong dự án (json-server, `http://localhost:3001`)

| Phương thức | Đường dẫn | Dùng cho |
| --- | --- | --- |
| GET | `/cards` | Tải danh sách thẻ |
| GET | `/cards/:id` | Chi tiết một thẻ |
| POST | `/cards` | Thêm thẻ (quản trị) |
| PUT | `/cards/:id` | Sửa thẻ, trừ tồn kho khi có đơn |
| DELETE | `/cards/:id` | Xóa thẻ (quản trị) |
| GET | `/users?username=&password=` | Đăng nhập |
| GET | `/orders` | Danh sách đơn (quản trị) |
| POST | `/orders` | Tạo đơn hàng khi thanh toán |
| PATCH | `/orders/:id` | Đổi trạng thái đơn |

## 7. Next.js và Tailwind CSS (Slot 20) - hướng mở rộng

Hai công cụ này dùng để tạo một dự án riêng, không trộn chung với Create React App. Nếu giảng viên yêu cầu làm thêm, có thể làm theo các bước:

1. Tạo dự án: `npx create-next-app@13.5.1 pokemon-shop-next` (chọn Yes cho Tailwind CSS và App Router).
2. Chuyển trang danh sách thẻ thành `app/cards/page.js` (render trên server, đọc dữ liệu từ `http://localhost:3001/cards`) và trang chi tiết `app/card/[id]/page.js`.
3. Viết lại giao diện thẻ bằng class Tailwind, ví dụ: `rounded-2xl border-2 p-4 shadow hover:-translate-y-1`.

## 8. Lưu ý

- Mật khẩu trong `db.json` để dạng chữ thường chỉ vì đây là bài tập. Ứng dụng thật phải xác thực ở backend và băm mật khẩu.
- Server giả không kiểm tra quyền, nên trang quản trị chỉ được chặn ở phía giao diện.
- Một vài ảnh Pokémon cần có Internet để tải. Nếu ảnh lỗi, giao diện tự hiện ảnh thay thế.
- Gợi ý commit Git theo từng chặng: `init project`, `add redux store`, `add shop pages`, `add checkout and admin`, `write readme`.
