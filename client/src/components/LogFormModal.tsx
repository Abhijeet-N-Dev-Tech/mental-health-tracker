import { useState } from 'react';
import axios from 'axios';
import Select, { MultiValue, SingleValue } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { API_BASE } from '../config';
import {
  moodOptions,
  sleepQualityOptions,
  activityTypeOptions,
  socialFrequencyOptions,
  Mood,
  SleepQuality,
  ActivityType,
  SocialFrequency,
} from '../constants';
import StarRating from './StarRating';
import useEscapeKey from '../../hooks/useEscapeKey'

type Option = { label: string; value: string };

type Props = {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
};

const toSelectOptions = (items: readonly string[]): Option[] =>
  items.map((item) => ({ label: item.charAt(0).toUpperCase() + item.slice(1), value: item }));

export default function LogFormModal({ show, onClose, onSave }: Props) {
  const [logDate, setLogDate] = useState<Date | null>(new Date());
  const [message, setMessage] = useState('');
  const [mood, setMood] = useState<Mood>(moodOptions[1]);
  const [anxiety, setAnxiety] = useState(0);
  const [stress, setStress] = useState(0);
  const [sleepHours, setSleepHours] = useState('');
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>(sleepQualityOptions[1]);
  const [selectedActivities, setSelectedActivities] = useState<Option[]>([]);
  const [activityDurations, setActivityDurations] = useState<Record<string, string>>({});
  const [socialFrequency, setSocialFrequency] = useState<SocialFrequency>(socialFrequencyOptions[2]);
  const [symptoms, setSymptoms] = useState('');
  const [error, setError] = useState('');

  useEscapeKey(() => {
    if (show) onClose();
  });

  const validate = () => {
    if (anxiety === 0 || stress === 0) {
      return 'Please rate anxiety and stress.';
    }
    for (const activity of selectedActivities) {
      const duration = Number(activityDurations[activity.value]);
      if (!duration || duration <= 0) {
        return `Duration required for activity: ${activity.label}`;
      }
    }
    return '';
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    const activities: { type: ActivityType; duration: number }[] = selectedActivities.map((a) => ({
      type: a.value as ActivityType,
      duration: parseFloat(activityDurations[a.value]),
    }));

    await axios.post(`${API_BASE}/logs`, {
      logDate: logDate?.toISOString().split('T')[0],
      message,
      mood,
      anxiety,
      stress,
      sleepHours: parseFloat(sleepHours),
      sleepQuality,
      activities,
      socialFrequency,
      symptoms: symptoms.split(',').map((s) => s.trim()),
    });

    setLogDate(new Date());
    setMessage('');
    setMood(moodOptions[0]);
    setAnxiety(0);
    setStress(0);
    setSleepHours('');
    setSleepQuality(sleepQualityOptions[1]);
    setSelectedActivities([]);
    setActivityDurations({});
    setSocialFrequency(socialFrequencyOptions[2]);
    setSymptoms('');
    setError('');
    onSave();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        className="bg-white p-6 rounded shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onSubmit={submit}
      >
        <h2 className="text-xl font-semibold mb-4">New Daily Log</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="w-40 text-right">Log Date:</label>
            <DatePicker
              selected={logDate}
              onChange={(date) => setLogDate(date)}
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              required
              className="flex-1 border rounded p-2"
            />
          </div>

          <textarea
            className="w-full border rounded p-2"
            placeholder="Write your notes..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={200}
          />

          <StarRating label="Anxiety" value={anxiety} onChange={setAnxiety} />
          <StarRating label="Stress" value={stress} onChange={setStress} />


          <div className="flex items-center gap-2">
            <label className="w-40 text-right">Mood:</label>
            <Select
              options={toSelectOptions(moodOptions)}
              value={{
                value: mood,
                label: mood.charAt(0).toUpperCase() + mood.slice(1),
              }}
              onChange={(opt: SingleValue<Option>) =>
                setSleepQuality((opt?.value as Mood) || moodOptions[0])
              }
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-40 text-right">Sleep Hours:</label>
            <input
              type="number"
              min={0}
              max={24}
              step="0.1"
              className="flex-1 border rounded p-2"
              placeholder="e.g. 7.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-40 text-right">Sleep Quality:</label>
            <Select
              options={toSelectOptions(sleepQualityOptions)}
              value={{
                value: sleepQuality,
                label: sleepQuality.charAt(0).toUpperCase() + sleepQuality.slice(1),
              }}
              onChange={(opt: SingleValue<Option>) =>
                setSleepQuality((opt?.value as SleepQuality) || sleepQualityOptions[1])
              }
              className="flex-1"
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <label className="w-40 text-right">Activities:</label>
              <Select
                isMulti
                options={toSelectOptions(activityTypeOptions)}
                value={selectedActivities}
                onChange={(opts: MultiValue<Option>) => setSelectedActivities(opts as Option[])}
                className="flex-1"
              />
            </div>
            <div className="space-y-2">
              {selectedActivities.map((activity) => (
                <div key={activity.value} className="flex items-center gap-2">
                  <span className="w-40 text-right">{activity.label} Duration (min):</span>
                  <input
                    type="number"
                    className="flex-1 border rounded p-2"
                    placeholder="e.g. 30"
                    value={activityDurations[activity.value] || ''}
                    onChange={(e) =>
                      setActivityDurations({
                        ...activityDurations,
                        [activity.value]: e.target.value,
                      })
                    }
                    min={0}
                    max={1440}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="w-40 text-right">Social Frequency:</label>
            <Select
              options={toSelectOptions(socialFrequencyOptions)}
              value={{
                value: socialFrequency,
                label: socialFrequency.charAt(0).toUpperCase() + socialFrequency.slice(1),
              }}
              onChange={(opt: SingleValue<Option>) =>
                setSocialFrequency((opt?.value as SocialFrequency) || socialFrequencyOptions[2])
              }
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-40 text-right">Symptoms:</label>
            <input
              type="text"
              className="flex-1 border rounded p-2"
              placeholder="e.g. self-injury, sadness"
              value={symptoms}
              maxLength={200}
              onChange={(e) => setSymptoms(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
