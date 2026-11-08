import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';

// Class component: React vẫn chỉ cho phép bắt lỗi render của component con bằng class,
// thông qua các phương thức vòng đời getDerivedStateFromError và componentDidCatch.
class ErrorBoundary extends React.Component {
  static propTypes = { children: PropTypes.node.isRequired };

  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error, info) {
    console.error('Lỗi giao diện:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant='danger'>
          <Alert.Heading>Đã có lỗi xảy ra</Alert.Heading>
          <p className='mb-0'>{this.state.message}</p>
        </Alert>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
