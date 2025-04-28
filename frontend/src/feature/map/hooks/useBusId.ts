// hooks/useBusId.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../../../constant';
import { useNotification } from '../../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export function useBusId(email: string | undefined) {
  const [busId, setBusId] = useState<string | null>(null);
  const { notify } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusId = async () => {
      if (!email) return;

      try {
        const response = await axios.get(`${URL}/api/dashboard/getBusByEmail?email=${email}`);
        if (response.data.busId) {
          setBusId(response.data.busId);
          notify(`Bus ID: ${response.data.busId} fetched successfully!`, 'success');
        } else {
          notify(response.data.message || 'Failed to fetch busId.', 'error');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching busId:', error);
        notify('Error fetching busId.', 'error');
        navigate('/');
      }
    };

    fetchBusId();
  }, [email]);

  return busId;
}
