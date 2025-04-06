import { css } from 'styled-components';

// Flexbox 관련 mixin
export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const flexBetween = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

// 반응형 디자인을 위한 미디어 쿼리 mixin
export const media = {
  mobile: (styles: TemplateStringsArray) => css`
    @media (max-width: 767px) {
      ${css(styles)}
    }
  `,
  tablet: (styles: TemplateStringsArray) => css`
    @media (min-width: 768px) and (max-width: 1023px) {
      ${css(styles)}
    }
  `,
  desktop: (styles: TemplateStringsArray) => css`
    @media (min-width: 1024px) {
      ${css(styles)}
    }
  `,
};

// 텍스트 스타일 mixin
export const ellipsis = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Box shadow mixin
export const boxShadow = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
  const shadows = {
    light: '0 2px 5px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.12)',
    heavy: '0 8px 16px rgba(0, 0, 0, 0.15)',
  };
  
  return css`
    box-shadow: ${shadows[intensity]};
  `;
};
