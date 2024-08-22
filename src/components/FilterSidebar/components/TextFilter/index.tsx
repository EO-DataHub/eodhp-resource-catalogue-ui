import './styles.scss';

const TextFilter: React.FC<{
  placeholder: string;
  onFilterChange: (value: string) => void;
  value?: string;
}> = ({ placeholder, onFilterChange, value }) => {
  return (
    <div className="text-filter">
      <input
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={(e) => onFilterChange(e.target.value)}
      />
    </div>
  );
};

export default TextFilter;
