import { Test, TestingModule } from "@nestjs/testing";
import { EnsembleMembershipService } from "./ensemble-membership.service";

describe("EnsembleMembershipService", () => {
  let service: EnsembleMembershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnsembleMembershipService],
    }).compile();

    service = module.get<EnsembleMembershipService>(EnsembleMembershipService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
