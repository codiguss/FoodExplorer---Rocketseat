import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from "react-responsive";
import { Container, Content } from "./styles";
import { api } from '../../services/api';
import { Menu } from "../../components/Menu";
import { Header } from '../../components/Header';
import { Section } from '../../components/Section';
import { Food } from "../../components/Food";
import { Footer } from '../../components/Footer';
import bannerMobile from "../../assets/banner-mobile.png";
import homeBanner from "../../assets/home-banner.png";
import { register } from 'swiper/element/bundle';

register();

export function Home({ isAdmin, user_id }) {
  const swiperElRef1 = useRef(null);
  const swiperElRef2 = useRef(null);
  const swiperElRef3 = useRef(null);

  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dishes, setDishes] = useState({ meals: [], desserts: [], beverages: [] });
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const handleDetails = (id) => navigate(`/dish/${id}`);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dishesResponse, favoritesResponse] = await Promise.all([
          api.get(`/dishes?search=${search}`),
          api.get("/favorites")
        ]);

        const dishes = dishesResponse.data;
        const meals = dishes.filter(dish => dish.category === "meal");
        const desserts = dishes.filter(dish => dish.category === "dessert");
        const beverages = dishes.filter(dish => dish.category === "beverage");

        const favorites = favoritesResponse.data.map(favorite => favorite.dish_id);

        setDishes({ meals, desserts, beverages });
        setFavorites(favorites);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [search]);

  const updateFavorite = async (isFavorite, dishId) => {
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${dishId}`);
        setFavorites(prevFavorites => prevFavorites.filter(favorite => favorite !== dishId));
      } else {
        await api.post('/favorites', { dish_id: dishId });
        setFavorites(prevFavorites => [...prevFavorites, dishId]);
      }
    } catch (error) {
      console.log('Erro ao atualizar favoritos:', error);
    }
  };

  const SwiperSection = ({ title, dishes }) => (
    <Section title={title}>
      <swiper-container
        space-between={isDesktop ? "27" : "16"}
        slides-per-view="auto"
        navigation={isDesktop ? "true" : "false"}
        loop="true"
        grab-cursor="true"
      >
        {dishes.map(dish => (
          <swiper-slide key={String(dish.id)}>
            <Food
              isAdmin={isAdmin}
              data={dish}
              isFavorite={favorites.includes(dish.id)}
              updateFavorite={updateFavorite}
              user_id={user_id}
              handleDetails={handleDetails}
            />
          </swiper-slide>
        ))}
      </swiper-container>
    </Section>
  );

  return (
    <Container>
      {!isDesktop && <Menu isAdmin={isAdmin} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} setSearch={setSearch} />}
      <Header isAdmin={isAdmin} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} setSearch={setSearch} />
      <main>
        <div>
          <header>
            <img src={isDesktop ? homeBanner : bannerMobile} alt="Banner de pratos deliciosos." />
            <div>
              <h1>Sabores inigualáveis</h1>
              <p>Sinta o cuidado do preparo com ingredientes selecionados</p>
            </div>
          </header>
          <Content>
            <SwiperSection title="Refeições" dishes={dishes.meals} />
            <SwiperSection title="Sobremesas" dishes={dishes.desserts} />
            <SwiperSection title="Bebidas" dishes={dishes.beverages} />
          </Content>
        </div>
      </main>
      <Footer />
    </Container>
  );
}
