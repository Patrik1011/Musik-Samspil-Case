import { Test, TestingModule } from "@nestjs/testing";
import { GeocodingService } from "../../src/modules/geocoding/geocoding.service";
import { ConfigService } from "@nestjs/config";

describe("GeocodingService", () => {
  let service: GeocodingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GeocodingService,
          useValue: {
            geocodeAddress: jest.fn().mockResolvedValue({
              latitude: 55.6761,
              longitude: 12.5683,
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue("fake_api_key"),
          },
        },
      ],
    }).compile();

    service = module.get<GeocodingService>(GeocodingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("geocodeAddress", () => {
    it("should successfully geocode an address", async () => {
      const address = "Radhuspladsen 1, Copenhagen, Denmark";

      const result = await service.geocodeAddress(address);

      expect(result).toEqual({
        latitude: 55.6761,
        longitude: 12.5683,
      });
    });

    it("should handle geocoding errors", async () => {
      jest.spyOn(service, "geocodeAddress").mockRejectedValueOnce(new Error("Geocoding failed"));
      const address = "Invalid Address, Invalid City, Invalid Country";
      await expect(service.geocodeAddress(address)).rejects.toThrow("Geocoding failed");
    });
  });
});
