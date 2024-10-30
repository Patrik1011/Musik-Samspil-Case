import React from "react";

interface AuthFormProps {
  title: string;
  fields: { name: string; type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }[];
  buttonText: string;
  onSubmit: (e: React.FormEvent) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, fields, buttonText, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <h2>{title}</h2>
    {fields.map((field) => (
      <input
        key={field.name}
        type={field.type}
        value={field.value}
        onChange={field.onChange}
        placeholder={field.placeholder}
        required
      />
    ))}
    <button type="submit">{buttonText}</button>
  </form>
);

export default AuthForm;
