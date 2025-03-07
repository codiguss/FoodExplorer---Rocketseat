import { Container, Brand, Copyright } from "./styles";
import brand from "../../assets/footer-brand.svg";

export function Footer() {
  return (
    <Container>
      <Brand>
        <img src={brand} alt="Logo da marca" aria-label="Logo da marca" />
      </Brand>

      <Copyright>
        © 2023 - Todos os direitos reservados.
      </Copyright>
    </Container>
  );
}
