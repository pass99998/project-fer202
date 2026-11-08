import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import FadeLoader from 'react-spinners/FadeLoader';
import AppNavbar from './AppNavbar';
import ErrorBoundary from './ErrorBoundary';
import StoreClock from './StoreClock';

// Khung chung của mọi trang: Navbar + nội dung (Outlet) + Footer
function Layout() {
  const location = useLocation();

  return (
    <div className='d-flex flex-column min-vh-100'>
      <AppNavbar />

      <main className='container py-4 flex-grow-1'>
        {/* key đổi theo đường dẫn: sang trang khác thì ErrorBoundary được làm mới */}
        <ErrorBoundary key={location.pathname}>
          {/* Suspense: trong lúc tải bundle của trang lazy sẽ hiện vòng xoay */}
          <Suspense
            fallback={
              <div className='d-flex justify-content-center py-5'>
                <FadeLoader color='#E3350D' />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      <footer className='site-footer py-3'>
        <div className='container d-flex flex-wrap justify-content-between gap-2'>
          <small className='text-body-secondary'>
            Bài tập React - dữ liệu và hình ảnh chỉ mang tính minh họa. Pokémon thuộc sở hữu của Nintendo, Game Freak
            và The Pokémon Company.
          </small>
          <StoreClock />
        </div>
      </footer>
    </div>
  );
}

export default Layout;
