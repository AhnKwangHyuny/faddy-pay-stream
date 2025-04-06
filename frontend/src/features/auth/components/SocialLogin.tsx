import React from 'react';
import styled from 'styled-components';

const SocialLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SocialButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`;

const SocialButton = styled.button<{ bgColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${props => props.bgColor};
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const SocialIcon = styled.img`
  width: 28px;
  height: 28px;
`;

const SocialText = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
`;

export const SocialLogin: React.FC = () => {
  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // 실제 구현에서는 여기에 소셜 로그인 로직을 추가합니다.
  };

  return (
    <SocialLoginContainer>
      <SocialText>간편 로그인</SocialText>
      <SocialButtonsContainer>
        <SocialButton 
          bgColor="#03C75A" 
          onClick={() => handleSocialLogin('naver')}
          aria-label="네이버 로그인"
        >
          <SocialIcon 
            src="https://raw.githubusercontent.com/project-yourname/project-icons/main/naver.png"
            alt="네이버"
          />
        </SocialButton>
        
        <SocialButton 
          bgColor="#FEE500"
          onClick={() => handleSocialLogin('kakao')}
          aria-label="카카오 로그인"
        >
          <SocialIcon
            src="https://raw.githubusercontent.com/project-yourname/project-icons/main/kakao.png"
            alt="카카오"
          />
        </SocialButton>
        
        <SocialButton 
          bgColor="#4285F4"
          onClick={() => handleSocialLogin('google')}
          aria-label="구글 로그인"
        >
          <SocialIcon
            src="https://raw.githubusercontent.com/project-yourname/project-icons/main/google.png"
            alt="구글"
          />
        </SocialButton>
        
        <SocialButton 
          bgColor="#E4405F"
          onClick={() => handleSocialLogin('instagram')}
          aria-label="인스타그램 로그인"
        >
          <SocialIcon
            src="https://raw.githubusercontent.com/project-yourname/project-icons/main/instagram.png"
            alt="인스타그램"
          />
        </SocialButton>
      </SocialButtonsContainer>
    </SocialLoginContainer>
  );
}; 