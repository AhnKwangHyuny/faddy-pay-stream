// shared/utils/storage.ts

// Local Storage 유틸리티 함수들

/**
 * Local Storage에 데이터 저장
 * @param key 스토리지 키
 * @param value 저장할 값
 */
export const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Local Storage에서 데이터 가져오기
 * @param key 스토리지 키
 * @param defaultValue 기본값 (없을 경우 반환)
 * @returns 저장된 값 또는 기본값
 */
export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Local Storage에서 데이터 삭제
 * @param key 스토리지 키
 */
export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Local Storage 완전 비우기
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Session Storage 유틸리티 함수들

/**
 * Session Storage에 데이터 저장
 * @param key 스토리지 키
 * @param value 저장할 값
 */
export const setSessionStorage = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to sessionStorage:', error);
  }
};

/**
 * Session Storage에서 데이터 가져오기
 * @param key 스토리지 키
 * @param defaultValue 기본값 (없을 경우 반환)
 * @returns 저장된 값 또는 기본값
 */
export const getSessionStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedValue = sessionStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error('Error reading from sessionStorage:', error);
    return defaultValue;
  }
};

/**
 * Session Storage에서 데이터 삭제
 * @param key 스토리지 키
 */
export const removeSessionStorage = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from sessionStorage:', error);
  }
};

/**
 * Session Storage 완전 비우기
 */
export const clearSessionStorage = (): void => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
  }
};