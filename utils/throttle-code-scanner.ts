import type { Code } from "react-native-vision-camera";

type CodeListener = (code: Code) => void;

/**
 * Cria um throttle de scanner de código que dispara os listeners
 * apenas quando o mesmo código for lido pelo menos minReadings vezes consecutivas.
 * Após disparar, aplica um TTL para evitar notificações repetidas do mesmo código.
 *
 * @param minReadings - Número mínimo de leituras consecutivas (padrão: 6)
 * @param ttl - Tempo em milissegundos para bloquear novas notificações do mesmo código após disparo (padrão: 3000)
 * @returns Objeto com função para processar leituras, adicionar listeners e remover listeners
 */
export function throttleCodeScanner(minReadings = 6, ttl = 3000) {
  let currentCode: Code | null = null;
  let consecutiveCount: number = 0;
  let lastNotifiedCode: Code | null = null;
  let lastNotificationTime: number = 0;
  const listeners = new Set<CodeListener>();

  const isWithinTTL = (code: Code) => {
    if (lastNotifiedCode?.value !== code.value) return false;
    return Date.now() - lastNotificationTime < ttl;
  };

  const process = (code: Code) => {
    const codeValue = code.value;
    if (!codeValue || isWithinTTL(code)) return;

    if (currentCode?.value === codeValue) {
      consecutiveCount += 1;
    } else {
      currentCode = code;
      consecutiveCount = 1;
    }

    if (consecutiveCount >= minReadings) {
      listeners.forEach((listener) => listener(code));
      lastNotifiedCode = code;
      lastNotificationTime = Date.now();
      consecutiveCount = 0;
      currentCode = null;
    }
  };

  const addListener = (listener: CodeListener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return { process, addListener };
}
