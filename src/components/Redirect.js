import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Tự chuyển sang đường dẫn khác ngay khi component vừa hiện ra
function Redirect({ path }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(path, { replace: true });
  }, [navigate, path]);

  return null; // component này không hiển thị gì
}

Redirect.propTypes = { path: PropTypes.string.isRequired };

export default Redirect;
