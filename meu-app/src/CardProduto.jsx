import { useState } from "react";
import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";

// ─────────────────────────────────────────────
// Estilos Globais
// Injetamos fontes e reset básico via <Global />
// ─────────────────────────────────────────────
const globalStyles = css`
  @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500&display=swap");

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: "DM Sans", sans-serif;
    background: #f0ede8;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
`;

// ─────────────────────────────────────────────
// Styled Components — Estrutura do Card
// ─────────────────────────────────────────────

/** Wrapper externo do card — sombra e borda arredondada */
const CardWrapper = styled.article`
  background: #ffffff;
  border-radius: 16px;
  width: 280px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  /* Micro-interação: eleva o card no hover */
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.13);
  }
`;

/** Área superior colorida que substitui a imagem do produto */
const CardImagePlaceholder = styled.div`
  background: linear-gradient(135deg, #d4c5b0 0%, #b8a899 100%);
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  /* Emoji como ícone ilustrativo do produto */
`;

/** Container do conteúdo textual e botão */
const CardBody = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

/** Badge/etiqueta de categoria acima do nome */
const CardCategory = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9b8472;
`;

/** Nome do produto com fonte serifada para destaque */
const CardTitle = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
`;

/** Avaliação com estrelas */
const CardRating = styled.div`
  font-size: 0.82rem;
  color: #c8a96e;
  letter-spacing: 0.04em;
`;

/** Linha que divide preço e desconto */
const CardPriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin-top: 0.25rem;
`;

/** Preço principal em destaque */
const CardPrice = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
`;

/** Preço original riscado (de) */
const CardPriceOld = styled.span`
  font-size: 0.85rem;
  color: #b0a090;
  text-decoration: line-through;
`;

/**
 * Botão de ação — ESTILIZAÇÃO DINÂMICA com prop `adicionada`
 *
 * Quando `adicionada` é true  → fundo verde  (#198754)
 * Quando `adicionada` é false → fundo cinza  (#6c757d)
 *
 * Emotion interpola a prop diretamente no template literal.
 * O prefixo `$` (transient prop) evita que a prop chegue ao DOM.
 */
const BotaoCarrinho = styled.button`
  /* Cor de fundo dinâmica baseada na prop $adicionada */
  background-color: ${({ $adicionada }) =>
    $adicionada ? "#198754" : "#6c757d"};

  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-family: "DM Sans", sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.75rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  /* Transição suave ao mudar de estado */
  transition: background-color 0.3s ease, transform 0.15s ease, opacity 0.3s ease;

  &:hover {
    opacity: 0.88;
  }

  &:active {
    transform: scale(0.97);
  }

  /* Acessibilidade: indicador de foco visível */
  &:focus-visible {
    outline: 3px solid ${({ $adicionada }) =>
      $adicionada ? "#0d6e43" : "#495057"};
    outline-offset: 3px;
  }
`;

// ─────────────────────────────────────────────
// Dados estáticos de produtos
// ─────────────────────────────────────────────
const produtos = [
  {
    id: 1,
    emoji: "🕯️",
    categoria: "Casa & Decoração",
    nome: "Vela Aromática Sândalo",
    avaliacao: "★★★★★",
    preco: "R$ 89,90",
    precoAnterior: "R$ 119,90",
  },
  {
    id: 2,
    emoji: "🧴",
    categoria: "Beleza & Cuidados",
    nome: "Hidratante Corporal Premium",
    avaliacao: "★★★★☆",
    preco: "R$ 54,90",
    precoAnterior: "R$ 74,90",
  },
  {
    id: 3,
    emoji: "☕",
    categoria: "Gourmet",
    nome: "Café Especial Blend 250g",
    avaliacao: "★★★★★",
    preco: "R$ 42,00",
    precoAnterior: "R$ 58,00",
  },
];

// ─────────────────────────────────────────────
// Layout da vitrine
// ─────────────────────────────────────────────
const Vitrine = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
`;

// ─────────────────────────────────────────────
// Componente CardProduto
// ─────────────────────────────────────────────

/**
 * CardProduto
 * Recebe os dados do produto via props e gerencia
 * o estado `adicionada` internamente.
 */
function CardProduto({ emoji, categoria, nome, avaliacao, preco, precoAnterior }) {
  // Estado local: controla se o produto foi adicionado ao carrinho
  const [adicionada, setAdicionada] = useState(false);

  const handleClick = () => setAdicionada((prev) => !prev);

  return (
    <CardWrapper>
      {/* Placeholder visual do produto */}
      <CardImagePlaceholder aria-hidden="true">{emoji}</CardImagePlaceholder>

      <CardBody>
        <CardCategory>{categoria}</CardCategory>
        <CardTitle>{nome}</CardTitle>
        <CardRating aria-label={`Avaliação: ${avaliacao}`}>{avaliacao}</CardRating>

        <CardPriceRow>
          {/* Preço atual em destaque */}
          <CardPrice>{preco}</CardPrice>
          {/* Preço antigo riscado */}
          <CardPriceOld>{precoAnterior}</CardPriceOld>
        </CardPriceRow>

        {/*
          BotaoCarrinho recebe a transient prop `$adicionada`
          para controlar a cor dinamicamente via Emotion.
        */}
        <BotaoCarrinho
          $adicionada={adicionada}
          onClick={handleClick}
          aria-pressed={adicionada}
        >
          {adicionada ? "✓ Adicionado" : "+ Adicionar ao carrinho"}
        </BotaoCarrinho>
      </CardBody>
    </CardWrapper>
  );
}
