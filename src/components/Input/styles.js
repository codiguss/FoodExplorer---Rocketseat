import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start; 

  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_300};

  > input {
    height: 4.8rem;
    width: 100%;
    padding: 1.2rem 1.4rem;
    color: ${({ theme }) => theme.COLORS.WHITE};
    background: transparent;
    border: 0;
    border-radius: 0.5rem;

    &::placeholder {
      color: ${({ theme }) => theme.COLORS.GRAY_300};
    }

    &:focus {
      outline: none;
      border: 1px solid ${({ theme }) => theme.COLORS.WHITE};
      box-shadow: 0 0 5px ${({ theme }) => theme.COLORS.WHITE};
    }
  }
`;
