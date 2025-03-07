import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1.3rem;
  
  padding: 1.6rem 0;

  > img {
    width: 7.2rem;
    height: auto;
  }

  > div {
    h2 {
      font-family: "Poppins", sans-serif;
      font-size: 2rem;
      font-weight: 500;
      line-height: 160%;
      
      color: ${({ theme }) => theme.COLORS.GRAY_200};
    }

    button {
      border: none;
      background: none;
      
      font-size: 1.2rem;
      line-height: 160%;
      
      color: ${({ theme }) => theme.COLORS.LIGHT_RED};
    }
  }

  @media (min-width: 1024px) {
    width: 23.1rem;
  }
`;
