import { v4 as uuidv4 } from 'uuid';

// 문자열을 유효한 UUID로 변환하는 함수
// 유효한 UUID가 아닌 경우 새 UUID 생성
export const ensureUuid = (id: string | undefined): string => {
  // id가 undefined이거나 null이면 새 UUID 생성
  if (!id) {
    return uuidv4();
  }
  
  // 하이픈이 없는 UUID인 경우 하이픈 추가 (32자 문자열을 UUID 형식으로 변환)
  if (/^[0-9a-f]{32}$/i.test(id)) {
    return `${id.substring(0, 8)}-${id.substring(8, 12)}-${id.substring(12, 16)}-${id.substring(16, 20)}-${id.substring(20)}`;
  }
  
  // 정규 UUID v4 패턴
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (uuidPattern.test(id)) {
    return id; // 이미 유효한 UUID
  }
  
  try {
    // 해시와 유사한 일관된 방식으로 문자열을 UUID로 변환
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
    const uuid = uuidv4().replace(/[0-9a-f]{8}/, idHash.padEnd(8, '0').substring(0, 8));
    
    console.log(`UUID 변환: ${id} → ${uuid}`);
    return uuid;
  } catch (e) {
    console.error('UUID 변환 실패:', e);
    return uuidv4(); // 실패 시 완전히 랜덤한 UUID 반환
  }
};