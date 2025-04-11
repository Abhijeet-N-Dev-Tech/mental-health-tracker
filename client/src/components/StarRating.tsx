type Props = {
  label: string;
  value: number;
  onChange: (val: number) => void;
};

export default function StarRating({ label, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <label className="w-40 text-right">{label}:</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-xl ${value >= star ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => onChange(star)}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
}
