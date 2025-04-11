import { Log } from '../types';

interface Props {
  log: Log;
}

export default function LogCard({ log }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 transition hover:shadow-xl">
      <div className="mb-2">
        <h3 className="text-xl font-semibold text-gray-800 break-words">
          {log.message}
        </h3>
        <div className="text-right">
          <span className="text-sm text-gray-500">{log.logDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
        <p><span className="font-medium">Mood:</span> {log.mood}</p>
        <p><span className="font-medium">Anxiety:</span> {log.anxiety} / 5</p>
        <p><span className="font-medium">Stress:</span> {log.stress} / 5</p>
        <p><span className="font-medium">Sleep:</span> {log.sleepHours} hrs ({log.sleepQuality})</p>
        <p><span className="font-medium">Social:</span> {log.socialFrequency}</p>
        <p><span className="font-medium">Symptoms:</span> {JSON.parse(log?.symptoms).join(', ') || 'None'}</p>
      </div>

      <div className="mt-3">
        <p className="font-medium text-sm text-gray-800 mb-1">Activities:</p>
        {log.activities?.length > 0 ? (
          <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
            {log.activities.map((activity, index) => (
              <li key={index}>
                {activity.type} ({activity.duration} min)
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 ml-2">None</p>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-right">
        Logged at: {new Date(log.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
