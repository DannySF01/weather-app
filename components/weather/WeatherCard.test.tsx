import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import WeatherCard from "./WeatherCard";

// 1. Mock da função utilitária para isolar o teste do componente
jest.mock("../../util/getWeatherIcon", () => ({
  __esModule: true,
  default: jest.fn(() => <span>☀️</span>),
}));

describe("WeatherCard", () => {
  const mockProps = {
    today: {
      temperature: 25,
      weather_code: 1,
    },
    location: "Lisboa",
  };

  test("deve renderizar a localização e a temperatura corretamente", () => {
    render(<WeatherCard {...mockProps} />);

    // Verifica se o nome da cidade aparece
    expect(screen.getByText("Lisboa")).toBeInTheDocument();

    // Verifica se a temperatura aparece com o símbolo de graus
    expect(screen.getByText("25°")).toBeInTheDocument();
  });

  test("deve exibir o ícone retornado pela função getWeatherIcon", () => {
    render(<WeatherCard {...mockProps} />);

    // Verifica se o ícone (que definimos no mock como ☀️) aparece
    expect(screen.getByText("☀️")).toBeInTheDocument();
  });

  test("deve lidar com dados em falta usando optional chaining", () => {
    // @ts-ignore - Testando caso onde 'today' é undefined apesar da tipagem
    render(<WeatherCard location="Porto" today={undefined} />);

    expect(screen.getByText("Porto")).toBeInTheDocument();
    // O span da temperatura ficará apenas com "°" devido ao {today?.temperature}°
    expect(screen.getByText("°")).toBeInTheDocument();
  });
});
