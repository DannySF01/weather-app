export async function getLocationDetails(
  lat: number,
  lon: number,
): Promise<{ city: string; country: string }> {
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
    const country = data.address.country;
    return { city, country };
  } catch (error) {
    console.error("Erro no reverse geocoding:", error);
    return { city: "", country: "" };
  }
}
