import { api } from "../../services/api";
import { Container } from "./styles";

export function Favorite({ data, removeFavorite }) {
  const imageUrl = `${api.defaults.baseURL}/files/${data.image}`;

  return (
    <Container>
      <img src={imageUrl} alt="Imagem do prato." />
      
      <div>
        <h2>{data.name}</h2>
        <button onClick={() => removeFavorite(data.id)}>
          Remover dos Favoritos
        </button>
      </div>
    </Container>
  );
}
