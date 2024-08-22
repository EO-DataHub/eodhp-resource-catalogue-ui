import './styles.scss';

type TestFilterProps = {
  placeholder: string;
  onFilterChange: (value: string) => void;
  value?: string;
};

const TextFilter = ({ placeholder, onFilterChange, value }: TestFilterProps) => {
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
