import { formatDay, formatHour } from "./formatDate";

describe("Date Utilities", () => {
  describe("formatHour", () => {
    test("deve extrair a hora e minutos de uma string ISO", () => {
      const iso = "2024-05-20T12:00:00Z";
      expect(formatHour(iso)).toBe("12:00");
    });
  });

  describe("formatDay", () => {
    test('deve retornar "Hoje" se a data for o dia atual', () => {
      const hoje = new Date().toISOString();
      expect(formatDay(hoje)).toBe("Hoje");
    });

    test("deve retornar o dia da semana abreviado para datas futuras", () => {
      const dataFixa = "2025-12-25T10:00:00Z"; // Quinta-feira
      const resultado = formatDay(dataFixa);

      // Resultado esperado: "Quinta"
      expect(resultado).toMatch(/quinta/);
    });
  });
});
