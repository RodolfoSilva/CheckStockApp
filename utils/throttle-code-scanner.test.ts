import type { Code } from "react-native-vision-camera";
import { throttleCodeScanner } from "./throttle-code-scanner";

describe("throttleCodeScanner", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const createCode = (value: string, type: Code["type"] = "qr"): Code => ({
    type,
    value,
  });

  describe("disparo após leituras consecutivas", () => {
    it("deve disparar listener após 3 leituras consecutivas do mesmo código", () => {
      const scanner = throttleCodeScanner(3, 3000);
      const listener = jest.fn();
      scanner.addListener(listener);

      const code = createCode("123456");

      scanner.process(code);
      scanner.process(code);
      scanner.process(code);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(code);
    });

    it("não deve disparar antes de atingir o mínimo de leituras", () => {
      const scanner = throttleCodeScanner(3, 3000);
      const listener = jest.fn();
      scanner.addListener(listener);

      const code = createCode("123456");

      scanner.process(code);
      expect(listener).not.toHaveBeenCalled();

      scanner.process(code);
      expect(listener).not.toHaveBeenCalled();

      scanner.process(code);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("deve permitir múltiplas validações do mesmo código", () => {
      const scanner = throttleCodeScanner(3, 3000);
      const listener = jest.fn();
      scanner.addListener(listener);

      const code = createCode("123456");

      scanner.process(code);
      scanner.process(code);
      scanner.process(code);
      expect(listener).toHaveBeenCalledTimes(1);

      scanner.process(code);
      scanner.process(code);
      scanner.process(code);
      expect(listener).toHaveBeenCalledTimes(2);
    });
  });

  describe("reset quando código muda", () => {
    it("deve resetar contador quando um código diferente é lido", () => {
      const scanner = throttleCodeScanner(3, 3000);
      const listener = jest.fn();
      scanner.addListener(listener);

      const code1 = createCode("123456");
      const code2 = createCode("789012");

      scanner.process(code1);
      scanner.process(code1);
      scanner.process(code2);
      scanner.process(code2);
      scanner.process(code2);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(code2);
    });

    it("deve resetar e começar a contar novamente quando código muda", () => {
      const scanner = throttleCodeScanner(3, 3000);
      const listener = jest.fn();
      scanner.addListener(listener);

      const code1 = createCode("123456");
      const code2 = createCode("789012");

      scanner.process(code1);
      scanner.process(code1);
      scanner.process(code2);
      scanner.process(code2);
      expect(listener).not.toHaveBeenCalled();

      scanner.process(code2);
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe("fallback após timeout", () => {
    it("deve disparar listener após timeout se condição não foi atingida", () => {
      const scanner = throttleCodeScanner(3, 1000);
      const listener = jest.fn();
      scanner.addListener(listener);

      const code = createCode("123456");

      scanner.process(code);
      scanner.process(code);

      expect(listener).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(code);
    });

    it("não deve disparar fallback se condição já foi atingida", () => {
      const scanner = throttleCodeScanner(3, 1000);
      const listener = jest.fn();
      scanner.addListener(listener);

      const code = createCode("123456");

      scanner.process(code);
      scanner.process(code);
      scanner.process(code);

      expect(listener).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1000);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("deve resetar timer quando nova leitura é feita", () => {
      const scanner = throttleCodeScanner(3, 1000);
      const listener = jest.fn();
      scanner.addListener(listener);

      const code = createCode("123456");

      scanner.process(code);
      jest.advanceTimersByTime(500);

      scanner.process(code);
      jest.advanceTimersByTime(500);

      expect(listener).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe("múltiplos listeners", () => {
    it("deve disparar todos os listeners quando condição é atingida", () => {
      const scanner = throttleCodeScanner(3, 3000);
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      const listener3 = jest.fn();

      scanner.addListener(listener1);
      scanner.addListener(listener2);
      scanner.addListener(listener3);

      const code = createCode("123456");

      scanner.process(code);
      scanner.process(code);
      scanner.process(code);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(listener3).toHaveBeenCalledTimes(1);
    });

    it("deve disparar todos os listeners no fallback", () => {
      const scanner = throttleCodeScanner(3, 1000);
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      scanner.addListener(listener1);
      scanner.addListener(listener2);

      const code = createCode("123456");

      scanner.process(code);
      scanner.process(code);

      jest.advanceTimersByTime(1000);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe("remoção de listeners", () => {
    it("deve remover listener quando função de remoção é chamada", () => {
      const scanner = throttleCodeScanner(3, 3000);
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      const removeListener1 = scanner.addListener(listener1);
      scanner.addListener(listener2);

      const code = createCode("123456");

      removeListener1();

      scanner.process(code);
      scanner.process(code);
      scanner.process(code);

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it("deve permitir remover e adicionar listeners dinamicamente", () => {
      const scanner = throttleCodeScanner(3, 3000);
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      const removeListener1 = scanner.addListener(listener1);
      removeListener1();

      scanner.addListener(listener2);

      const code = createCode("123456");

      scanner.process(code);
      scanner.process(code);
      scanner.process(code);

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe("comparação por value", () => {
    it("deve comparar códigos pelo value, não por referência do objeto", () => {
      const scanner = throttleCodeScanner(3, 3000);
      const listener = jest.fn();

      scanner.addListener(listener);

      const code1 = createCode("123456");
      const code2 = createCode("123456");
      const code3 = createCode("123456");

      scanner.process(code1);
      scanner.process(code2);
      scanner.process(code3);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(code3);
    });

    it("deve tratar objetos diferentes com mesmo value como o mesmo código", () => {
      const scanner = throttleCodeScanner(2, 3000);
      const listener = jest.fn();

      scanner.addListener(listener);

      const code1 = { type: "qr" as const, value: "123456" };
      const code2 = { type: "code-128" as const, value: "123456" };

      scanner.process(code1);
      scanner.process(code2);

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe("códigos sem value", () => {
    it("deve ignorar códigos sem value", () => {
      const scanner = throttleCodeScanner(3, 3000);
      const listener = jest.fn();

      scanner.addListener(listener);

      const codeWithValue = createCode("123456");
      const codeWithoutValue: Code = { type: "qr", value: undefined };

      scanner.process(codeWithoutValue);
      scanner.process(codeWithValue);
      scanner.process(codeWithValue);
      scanner.process(codeWithValue);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(codeWithValue);
    });

    it("não deve resetar contador quando código sem value é processado", () => {
      const scanner = throttleCodeScanner(3, 3000);
      const listener = jest.fn();

      scanner.addListener(listener);

      const code = createCode("123456");
      const codeWithoutValue: Code = { type: "qr", value: undefined };

      scanner.process(code);
      scanner.process(code);
      scanner.process(codeWithoutValue);
      scanner.process(code);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(code);
    });
  });

  describe("configuração customizada", () => {
    it("deve respeitar minReadings customizado", () => {
      const scanner = throttleCodeScanner(5, 3000);
      const listener = jest.fn();

      scanner.addListener(listener);

      const code = createCode("123456");

      scanner.process(code);
      scanner.process(code);
      scanner.process(code);
      scanner.process(code);
      expect(listener).not.toHaveBeenCalled();

      scanner.process(code);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("deve respeitar fallbackTimeout customizado", () => {
      const scanner = throttleCodeScanner(3, 2000);
      const listener = jest.fn();

      scanner.addListener(listener);

      const code = createCode("123456");

      scanner.process(code);
      scanner.process(code);

      jest.advanceTimersByTime(1000);
      expect(listener).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe("cenários complexos", () => {
    it("deve lidar com sequência de códigos diferentes e timeouts", () => {
      const scanner = throttleCodeScanner(3, 1000);
      const listener = jest.fn();

      scanner.addListener(listener);

      const code1 = createCode("111");
      const code2 = createCode("222");
      const code3 = createCode("333");

      scanner.process(code1);
      scanner.process(code1);
      jest.advanceTimersByTime(1000);
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenLastCalledWith(code1);

      scanner.process(code2);
      scanner.process(code2);
      scanner.process(code2);
      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenLastCalledWith(code2);

      scanner.process(code3);
      scanner.process(code3);
      jest.advanceTimersByTime(1000);
      expect(listener).toHaveBeenCalledTimes(3);
      expect(listener).toHaveBeenLastCalledWith(code3);
    });

    it("deve resetar estado corretamente após múltiplas validações", () => {
      const scanner = throttleCodeScanner(2, 1000);
      const listener = jest.fn();

      scanner.addListener(listener);

      const code = createCode("123456");

      scanner.process(code);
      scanner.process(code);
      expect(listener).toHaveBeenCalledTimes(1);

      scanner.process(code);
      scanner.process(code);
      expect(listener).toHaveBeenCalledTimes(2);

      const newCode = createCode("789012");
      scanner.process(newCode);
      scanner.process(newCode);
      expect(listener).toHaveBeenCalledTimes(3);
      expect(listener).toHaveBeenLastCalledWith(newCode);
    });
  });
});
