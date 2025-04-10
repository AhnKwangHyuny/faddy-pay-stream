import { v4 as uuidv4 } from 'uuid';

// 문자열을 유효한 UUID로 변환하는 함수
// 유효한 UUID가 아닌 경우 새 UUID 생성
export const ensureUuid = (id: string): string => {
  // UUID v4 정규식 패턴
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (uuidPattern.test(id)) {
    return id; // 이미 유효한 UUID
  }
  
  try {
    // 해시와 유사한 일관된 방식으로 문자열을 UUID로 변환
    let uuid = '';
    
    // 단순화된 해시 함수
    const hash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 32비트 정수로 변환
      }
      return Math.abs(hash).toString(16);
    };
    
    const idHash = hash(id);
    
    // 문자열 hash와 랜덤 UUID를 섞어서 새로운 UUID 생성
    uuid = uuidv4().replace(/[0-9a-f]{8}/, idHash.padEnd(8, '0').substring(0, 8));
    
    return uuid;
  } catch (e) {
    console.error('UUID 변환 실패:', e);
    return uuidv4(); // 실패 시 완전히 랜덤한 UUID 반환
  }
};