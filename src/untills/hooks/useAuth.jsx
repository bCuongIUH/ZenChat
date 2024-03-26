import { useContext, useEffect, useState } from 'react';
import { getAuthUser } from '../api';
import { AuthContext } from '../context/AuthContext';
export function useAuth() {

  const [loading, setLoading] = useState(true);
  const { user, updateAuthUser } = useContext(AuthContext);
  const controller = new AbortController();
  useEffect(() => {
    getAuthUser()
      .then(({ data }) => {
        updateAuthUser(data.auth);

        setTimeout(() => setLoading(false), 3000)

      })
      .catch((err) => {

        setTimeout(() => setLoading(false), 3000)
      });
    return () => {
      controller.abort();
    }
  }, []);
  return { user, loading };
}