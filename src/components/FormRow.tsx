import React from "react";

const FormRow = ({
  type,
  name,
  value,
  labelText,
  handleChange,
}: {
  type: string;
  name: string;
  value: string;
  labelText: string;
  handleChange: (e: React.SyntheticEvent) => void;
}) => {
  return (
    <div className="form-row" style={{display: "flex", justifyContent: "space-between", fontSize: "16px", marginTop: "20px"}}>
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        type={type}
        onChange={handleChange}
        value={value}
        name={name}
        className="form-input"
        style={{border: 'none', width: '60%', height: '32px', borderRadius: '5px 5px 0px 0px', outline: 'none' }}
      />
    </div>
  );
};

export default FormRow;
