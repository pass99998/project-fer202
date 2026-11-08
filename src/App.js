import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Redirect from './components/Redirect';

// Code splitting: mỗi trang là một bundle riêng, chỉ tải khi người dùng vào trang đó.
// (Suspense nằm trong Layout, bao quanh <Outlet />)
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const CardDetail = lazy(() => import('./pages/CardDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Routes>
      {/* Route cha: Layout (Navbar + Outlet + Footer). Các route con hiện ở <Outlet /> */}
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />

        {/* /cards và /cards/Fire dùng chung một trang (tham số :type là tùy chọn) */}
        <Route path='cards'>
          <Route index element={<Shop />} />
          <Route path=':type' element={<Shop />} />
        </Route>

        {/* Route có tham số: /card/3 */}
        <Route path='card/:id' element={<CardDetail />} />
        <Route path='cart' element={<Cart />} />
        <Route path='login' element={<Login />} />

        {/* Cần đăng nhập */}
        <Route element={<ProtectedRoute />}>
          <Route path='checkout' element={<Checkout />} />
        </Route>

        {/* Cần đăng nhập và có vai trò admin */}
        <Route element={<ProtectedRoute role='admin' />}>
          <Route path='admin' element={<Admin />} />
        </Route>

        <Route path='home' element={<Redirect path='/' />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
