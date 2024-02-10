/* eslint-disable react/prop-types */
export default function CustomTextField({
  autoFocus,
  label,
  name,
  value,
  required,
  onChange,
}) {
  return (
    <input
      autoFocus={autoFocus}
      className="w-full p-2 border rounded-md"
      id={name}
      name={name}
      value={value}
      required={required}
      onChange={onChange}
      type="text"
      placeholder={label}
    />
  );
}
