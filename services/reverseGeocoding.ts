// src/services/geocodingService.ts
export async function getCityName(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      {
        headers: {
          "User-Agent": "Weather-App",
        },
      },
    );
    const data = await response.json();

    console.log("data:", data);

    const city =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.municipality;
    return city || "Localização Desconhecida";
  } catch (error) {
    console.error("Erro no reverse geocoding:", error);
    return "Localização Atual";
  }
}
