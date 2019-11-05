import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function LandingPage() {
  const history = useHistory();

  useEffect(() => {
    history.replace('/auth/login');
  }, []);

  return null;
}

export default LandingPage;
