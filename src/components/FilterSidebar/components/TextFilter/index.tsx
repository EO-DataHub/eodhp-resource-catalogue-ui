import "./styles.scss";

const TextFilter: React.FC<{
  placeholder: string;
  onFilterChange: (value: string) => void;
  value?: string;
}> = ({ placeholder, onFilterChange, value }) => {
  return (
    <div className="text-filter">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onFilterChange(e.target.value)}
        value={value}
      />
    </div>
  );
};

export default TextFilter;
