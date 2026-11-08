import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

// Higher-Order Component: nhận một component, trả về component mới
// biết hiện "đang tải" hoặc "lỗi" thay cho component gốc.
function withLoading(Component) {
  function WithLoading({ loading, error, onRetry, ...rest }) {
    if (loading) {
      return (
        <div className='text-center py-5'>
          <Spinner animation='border' role='status' />
          <p className='mt-2 mb-0'>Đang tải dữ liệu...</p>
        </div>
      );
    }
    if (error) {
      return (
        <Alert variant='danger'>
          <Alert.Heading>Không tải được dữ liệu</Alert.Heading>
          <p className='mb-2'>{error}</p>
          {onRetry && (
            <Button variant='outline-danger' size='sm' onClick={onRetry}>
              Thử lại
            </Button>
          )}
        </Alert>
      );
    }
    return <Component {...rest} />;
  }

  WithLoading.displayName = `withLoading(${Component.displayName || Component.name})`;
  WithLoading.propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.string,
    onRetry: PropTypes.func,
  };
  return WithLoading;
}

export default withLoading;
