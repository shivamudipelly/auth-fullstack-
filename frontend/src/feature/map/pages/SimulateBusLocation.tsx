// SimulateBusLocation.tsx
import { useAuth } from '../../../context/AuthContext';
import { useBusId } from '../hooks/useBusId';
import { useBusTracking } from '../hooks/useBusTracking';

export default function SimulateBusLocation() {
  const { user } = useAuth();
  const busId = useBusId(user?.email);
  const { tracking, toggleTracking } = useBusTracking(busId);

  return (
    <div className='h-[calc(100vh-148px)] flex items-center justify-center'>
      <div className="bg-white p-4 flex flex-col items-center rounded shadow z-50 border ">
        <div className="mb-2 font-bold text-gray-800">
          {tracking ? 'Tracking Bus Location…' : 'Bus Location Tracking Stopped'}
        </div>
        <button
          onClick={toggleTracking}
          className={`px-4 py-2 rounded text-white ${tracking ? 'bg-red-500' : 'bg-green-500'}`}
          disabled={!busId}
        >
          {tracking ? 'Stop Tracking' : 'Start Tracking'}
        </button>
      </div>
    </div>
  );
}
