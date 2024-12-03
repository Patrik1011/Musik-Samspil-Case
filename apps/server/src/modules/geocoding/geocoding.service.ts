import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class GeocodingService {
  private readonly apiKey = process.env.OPENCAGE_API_KEY;

  async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }> {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${this.apiKey}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch geocoding data");
      }

      const data = await response.json();

      if (data.results.length === 0) {
        throw new Error("No results found for the given address");
      }

      const { lat, lng } = data.results[0].geometry;
      return { latitude: lat, longitude: lng };
    } catch (error) {
      throw new InternalServerErrorException("Failed to geocode address", { cause: error });
    }
  }
}
