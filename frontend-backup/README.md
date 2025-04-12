# 토스 페이먼츠 통합 React+TypeScript 프론트엔드

토스 페이먼츠 API를 사용하여 결제 시스템을 구현한 React & TypeScript 기반의 프론트엔드 프로젝트입니다.

## 주요 기능

1. 상품 목록 및 상세 페이지 표시
2. 장바구니 기능
3. 결제 프로세스 (토스 페이먼츠 위젯 통합)
4. 결제 완료 및 실패 페이지
5. 구매 내역 조회

## 기술 스택

- React 18+
- TypeScript 5+
- React Router v6
- Tailwind CSS
- Framer Motion (애니메이션)
- Axios (HTTP 요청)
- React Query (상태 관리)
- Context API (장바구니 관리)

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm start
```

### 빌드

```bash
npm run build
```

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수를 설정하세요:

```
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_TOSS_PAYMENTS_CLIENT_KEY=your_toss_payments_client_key
REACT_APP_ENV=development
```

## 폴더 구조

```
src/
├── assets/                   # 이미지, 아이콘 등 정적 파일
├── components/               # 재사용 가능한 컴포넌트
│   ├── common/               # 공통 컴포넌트 (버튼, 인풋 등)
│   ├── layout/               # 레이아웃 관련 컴포넌트
│   ├── product/              # 상품 관련 컴포넌트
│   ├── cart/                 # 장바구니 관련 컴포넌트
│   ├── payment/              # 결제 관련 컴포넌트
│   └── order/                # 주문 관련 컴포넌트
├── pages/                    # 라우트별 페이지 컴포넌트
├── hooks/                    # 커스텀 훅
├── context/                  # Context API 관련 파일
├── services/                 # API 호출 및 비즈니스 로직
├── utils/                    # 유틸리티 함수
├── types/                    # TypeScript 타입 정의
├── config/                   # 환경 변수 및 설정
├── App.tsx                   # 메인 앱 컴포넌트
└── index.tsx                 # 진입점
```

## 테스트 결제 정보

개발 환경에서 테스트할 때 사용할 수 있는 카드 정보:

- 카드번호: 4111 1111 1111 1111
- 만료일: 12/25 (미래 날짜)
- 생년월일/사업자등록번호: 920101
- 비밀번호: 임의의 두 자리 숫자