import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';

// Component Composition: nội dung bên trong <Panel>...</Panel> được truyền qua prop `children`
function Panel({ title, action, children }) {
  return (
    <Card className='mb-4'>
      {(title || action) && (
        <Card.Header className='d-flex justify-content-between align-items-center'>
          <span className='fw-bold'>{title}</span>
          {action}
        </Card.Header>
      )}
      <Card.Body>{children}</Card.Body>
    </Card>
  );
}

Panel.propTypes = {
  title: PropTypes.string,
  action: PropTypes.node, // node: chuỗi, số, element hoặc mảng đều được
  children: PropTypes.node.isRequired,
};

export default Panel;
