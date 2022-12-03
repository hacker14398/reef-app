import React from "react";

const FormSelect = ({
  labelText,
  name,
  value,
  options,
  handleChange,
}: {
  labelText: string;
  name: string;
  value: string;
  options: string[];
  handleChange: (e: React.SyntheticEvent) => void;
}) => {
  return (
    <div className="form-row" style={{display: "flex", justifyContent: "space-between", fontSize: "16px", marginTop: "40px"}}>
      <label htmlFor={name} className="form-label" style={{marginBottom: "10px"}}>
        {labelText || name}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="form-select"
        style={{border: 'none', width: '60%', height: '32px', borderRadius: '5px 5px 0px 0px', outline: 'none'}}
      >
        {options.map((itemValue, index) => {
          return (
            <option key={index} value={itemValue}>
              {itemValue}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default FormSelect;
