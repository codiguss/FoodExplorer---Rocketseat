import { Container } from "./styles";

export function Input({ icon: Icon, label, id, placeholder, size = "2.4rem", ...rest }) {
  return (
    <Container>
      {Icon && <Icon size={size} />}
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        placeholder={placeholder}
        aria-label={label || placeholder}
        {...rest}
      />
    </Container>
  );
}
