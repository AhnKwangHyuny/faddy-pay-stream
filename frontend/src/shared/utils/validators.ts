// shared/utils/validators.ts

// 이메일 검증
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// 전화번호 검증 (한국 형식)
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  return phoneRegex.test(phoneNumber);
};

// 우편번호 검증 (한국 5자리)
export const isValidZipCode = (zipCode: string): boolean => {
  const zipCodeRegex = /^\d{5}$/;
  return zipCodeRegex.test(zipCode);
};

// 비밀번호 강도 검증
// 최소 8자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자
export const isStrongPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

// 필수 입력값 검증
export const isRequired = (value: string): boolean => {
  return value.trim() !== '';
};

// 최소 길이 검증
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

// 최대 길이 검증
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

// 숫자만 포함하는지 검증
export const isNumeric = (value: string): boolean => {
  return /^\d+$/.test(value);
};

// 한글 이름 검증 (2~5자)
export const isValidKoreanName = (name: string): boolean => {
  const nameRegex = /^[가-힣]{2,5}$/;
  return nameRegex.test(name);
};

// 신용카드 번호 검증
export const isValidCreditCardNumber = (cardNumber: string): boolean => {
  const cardNumberRegex = /^(\d{4}-){3}\d{4}$|^\d{16}$/;
  return cardNumberRegex.test(cardNumber);
};