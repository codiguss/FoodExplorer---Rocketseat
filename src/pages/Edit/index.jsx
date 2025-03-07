import { useState, useEffect } from 'react';
import { useMediaQuery } from "react-responsive";
import { useParams, useNavigate } from 'react-router-dom';

import { RxCaretLeft } from "react-icons/rx";
import { FiUpload } from "react-icons/fi";
import { RiArrowDownSLine } from "react-icons/ri";

import { api } from '../../services/api';
import { Container, Form, Image, Category } from "./styles";

import { Menu } from "../../components/Menu";
import { Header } from '../../components/Header';
import { ButtonText } from "../../components/ButtonText";
import { Section } from '../../components/Section';
import { Input } from '../../components/Input';
import { FoodItem } from '../../components/FoodItem';
import { Textarea } from '../../components/Textarea';
import { Button } from "../../components/Button";
import { Footer } from '../../components/Footer';

export function Edit({ isAdmin }) {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dish, setDish] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDish() {
      try {
        const response = await api.get(`/dishes/${params.id}`);
        setDish(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchDish();
  }, [params.id]);

  useEffect(() => {
    if (dish) {
      setFileName(dish.image);
      setImage(dish.image);
      setName(dish.name);
      setCategory(dish.category);
      setPrice(dish.price);
      setDescription(dish.description);
      setTags(dish.ingredients.map(ingredient => ingredient.name));
    }
  }, [dish]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setFileName(file.name);
    }
  }

  function handleAddTag() {
    if (newTag.trim()) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag("");
    }
  }

  function handleRemoveTag(deleted) {
    setTags(prev => prev.filter(tag => tag !== deleted));
  }

  async function handleEditDish() {
    if (!image || !name || !category || !tags.length || !price || !description) {
      return alert("Preencha todos os campos obrigatórios.");
    }
    if (newTag) {
      return alert("Adicione ou remova o ingrediente pendente.");
    }

    setLoading(true);
    try {
      const updatedDish = { name, category, price, description, ingredients: tags };
      if (typeof image !== "string") {
        const formData = new FormData();
        formData.append("image", image);
        await api.patch(`/dishes/${params.id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      }
      await api.patch(`/dishes/${params.id}`, updatedDish);
      alert("Prato atualizado com sucesso!");
      navigate(-1);
    } catch (error) {
      alert(error.response?.data.message || "Não foi possível atualizar o prato.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveDish() {
    if (window.confirm("Deseja realmente remover o prato?")) {
      setLoading(true);
      try {
        await api.delete(`/dishes/${params.id}`);
        navigate("/");
      } catch (error) {
        alert(error.response?.data.message || "Não foi possível excluir o prato.");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <Container>
      {!isDesktop && <Menu isAdmin={isAdmin} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}
      <Header isAdmin={isAdmin} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main>
        <Form>
          <header>
            <ButtonText onClick={() => navigate(-1)}>
              <RxCaretLeft /> voltar
            </ButtonText>
            <h1>Editar prato</h1>
          </header>
          <Section title="Imagem do prato">
            <Image>
              <label htmlFor="image">
                <FiUpload size={24} />
                <span>{fileName || "Selecione imagem"}</span>
                <input id="image" type="file" onChange={handleImageChange} />
              </label>
            </Image>
          </Section>
          <Section title="Nome">
            <Input placeholder="Ex.: Salada Ceasar" value={name} onChange={e => setName(e.target.value)} />
          </Section>
          <Section title="Categoria">
            <Category>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Selecionar</option>
                <option value="meal">Refeição</option>
                <option value="dessert">Sobremesa</option>
                <option value="beverage">Bebida</option>
              </select>
              <RiArrowDownSLine size={24} />
            </Category>
          </Section>
          <Section title="Ingredientes">
            <div className="tags">
              {tags.map((tag, index) => (
                <FoodItem key={index} value={tag} onClick={() => handleRemoveTag(tag)} />
              ))}
              <FoodItem isNew placeholder="Adicionar" value={newTag} onChange={e => setNewTag(e.target.value)} onClick={handleAddTag} />
            </div>
          </Section>
          <Section title="Preço">
            <Input placeholder="R$ 00,00" type="number" value={price} onChange={e => setPrice(e.target.value)} />
          </Section>
          <Section title="Descrição">
            <Textarea placeholder="Descrição do prato" value={description} onChange={e => setDescription(e.target.value)} />
          </Section>
          <div className="buttons">
            <Button title="Excluir prato" onClick={handleRemoveDish} loading={loading} />
            <Button title="Salvar alterações" onClick={handleEditDish} loading={loading} />
          </div>
        </Form>
      </main>
      <Footer />
    </Container>
  );
}
