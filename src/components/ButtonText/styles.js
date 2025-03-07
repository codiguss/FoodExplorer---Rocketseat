import styled from "styled-components";

export const Container = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;

  font-family: "Poppins", sans-serif;
  font-size: 2.4rem;
  font-weight: 500;
  line-height: 140%;
  color: ${({ theme }) => theme.COLORS.WHITE};

  > svg {
    font-size: 3.2rem;
    color: ${({ theme }) => theme.COLORS.WHITE};
  }

  @media (min-width: 1024px) {
    font-weight: 700;
  }
`;
