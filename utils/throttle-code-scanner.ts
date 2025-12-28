import type { Code } from "react-native-vision-camera";

/**
 * Cria um throttle de scanner de código que dispara os listeners
 * apenas quando o mesmo código for lido pelo menos 3 vezes consecutivas.
 * Se após 3 segundos nenhuma leitura for feita e a condição não foi atingida,
 * dispara os listeners como fallback.
 *
 * @param minReadings - Número mínimo de leituras consecutivas (padrão: 3)
 * @param fallbackTimeout - Tempo em milissegundos para o fallback (padrão: 3000)
 * @returns Objeto com função para processar leituras, adicionar listeners e remover listeners
 */
export function throttleCodeScanner(
  minReadings: number = 3,
  fallbackTimeout: number = 3000
): {
  process: (code: Code) => void;
  addListener: (listener: (code: Code) => void) => () => void;
} {
  let currentCodeValue: string | null = null;
  let lastCode: Code | null = null;
  let consecutiveCount: number = 0;
  let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
  const listeners = new Set<(code: Code) => void>();

  const clearFallbackTimer = (): void => {
    if (fallbackTimer !== null) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
  };

  const setFallbackTimer = (code: Code): void => {
    clearFallbackTimer();
    fallbackTimer = setTimeout(() => {
      if (
        consecutiveCount > 0 &&
        consecutiveCount < minReadings &&
        lastCode !== null
      ) {
        listeners.forEach((listener) => listener(lastCode!));
        currentCodeValue = null;
        lastCode = null;
        consecutiveCount = 0;
      }
      fallbackTimer = null;
    }, fallbackTimeout);
  };

  const process = (code: Code): void => {
    const codeValue = code.value;

    if (!codeValue) {
      return;
    }

    if (currentCodeValue === codeValue) {
      consecutiveCount += 1;
    } else {
      currentCodeValue = codeValue;
      consecutiveCount = 1;
    }

    lastCode = code;

    if (consecutiveCount >= minReadings) {
      clearFallbackTimer();
      listeners.forEach((listener) => listener(code));
      consecutiveCount = 0;
      currentCodeValue = null;
      lastCode = null;
    } else {
      setFallbackTimer(code);
    }
  };

  const addListener = (listener: (code: Code) => void): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    process,
    addListener,
  };
}
