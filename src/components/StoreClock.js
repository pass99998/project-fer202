import React from 'react';
import PropTypes from 'prop-types';

// Class component minh họa vòng đời: mounting -> updating -> unmounting
class StoreClock extends React.Component {
  static propTypes = { label: PropTypes.string };
  static defaultProps = { label: 'Giờ cửa hàng' }; // giá trị mặc định cho props của class

  constructor(props) {
    super(props);
    this.state = { now: new Date() };
  }

  componentDidMount() {
    // chạy 1 lần sau khi hiện ra: bắt đầu đếm
    this.timer = setInterval(() => this.setState({ now: new Date() }), 1000);
  }

  componentWillUnmount() {
    // chạy trước khi bị gỡ: dọn dẹp timer
    clearInterval(this.timer);
  }

  render() {
    return (
      <small className='text-body-secondary'>
        {this.props.label}: {this.state.now.toLocaleTimeString('vi-VN')}
      </small>
    );
  }
}

export default StoreClock;
