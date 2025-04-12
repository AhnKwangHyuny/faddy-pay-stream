// toast.ts - 임시 토스트 유틸리티
// react-hot-toast 대신 사용할 간단한 토스트 구현

type ToastType = 'success' | 'error' | 'info' | 'warning';

const showToast = (message: string, type: ToastType = 'info') => {
  // 콘솔에 로깅
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // 간단한 alert 사용 (실제 환경에서는 더 좋은 UI로 대체 필요)
  if (type === 'error') {
    alert(`오류: ${message}`);
  } else if (type === 'success') {
    alert(`성공: ${message}`);
  } else {
    alert(message);
  }
};

export const toast = {
  success: (message: string) => showToast(message, 'success'),
  error: (message: string) => showToast(message, 'error'),
  info: (message: string) => showToast(message, 'info'),
  warning: (message: string) => showToast(message, 'warning')
};
