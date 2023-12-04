import { useState, useRef, useMemo } from 'react';
import { useOutsideClick } from 'src/hooks/use-outside-click';

/**
 * Select component
 * @param {Object} props - Props
 * @param {string} props.initialSelectedOptionId - The ID of the initial selected option
 * @param {string} props.label - Label
 * @param {string} [props.error] - Error (optional)
 * @param {string} [props.placeholder] - Placeholder (optional)
 * @param {Array.<{id: string, value: string}>} props.options - Array of options
 * @param {Function} props.onOptionSelected - Callback function that is called when an option is selected, returning its ID
 * @returns {React.Component} A select component
 */
export const Select = ({
  label,
  error,
  placeholder,
  initialSelectedOptionId,
  options = [],
  onOptionSelected,
  ...otherProps
}) => {
  const [selectedOption, setSelectedOption] = useState(
    () => options.find((option) => option.id === initialSelectedOptionId) ?? null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [listVisible, setListVisible] = useState(false);
  const selectRef = useRef(null);

  useOutsideClick(selectRef, () => setListVisible(false));

  const handleSelectChange = (id) => {
    setSelectedOption(options.find((option) => option.id === id));
    setSearchTerm('');
    setListVisible(false);
    onOptionSelected?.(id);
  };

  const toggleList = () => {
    setListVisible(!listVisible);
  };

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        normalizeString(option.value).includes(normalizeString(searchTerm))
      ),
    [options, searchTerm]
  );

  return (
    <div className="br-select" ref={selectRef}>
      <div className="br-input">
        <label htmlFor="select-simple">{label}</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-search" aria-hidden="true"></i>
          </div>
          <input
            {...otherProps}
            id="select-simple"
            type="text"
            placeholder={selectedOption ? selectedOption.value : placeholder}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onClick={() => setListVisible(true)}
          />
        </div>
        <button
          className="br-button"
          type="button"
          aria-label="Exibir lista"
          tabIndex="-1"
          onClick={toggleList}
        >
          <i
            className={'fas ' + (listVisible ? 'fa-angle-up' : 'fa-angle-down')}
            aria-hidden="true"
          ></i>
        </button>
      </div>
      {error && (
        <span className="feedback danger" role="alert">
          <i className="fas fa-times-circle" aria-hidden="true"></i>
          Erro
        </span>
      )}
      <div className="br-list" tabIndex="0" {...(listVisible ? { expanded: '' } : {})}>
        {filteredOptions.map((option) => {
          const isSelected = option.id === selectedOption?.id;

          return (
            <div
              className="br-item"
              tabIndex="-1"
              key={option.id}
              onClick={() => handleSelectChange(option.id)}
            >
              <div className="br-radio">
                <input
                  id={option.id}
                  type="radio"
                  name="custom-select"
                  readOnly
                  value={option.id}
                />
                <label
                  htmlFor={option.id}
                  style={{
                    backgroundColor: isSelected ? '#2670e8' : undefined,
                    color: isSelected ? 'white' : undefined
                  }}
                >
                  {option.value}
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Utils

const normalizeString = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};
