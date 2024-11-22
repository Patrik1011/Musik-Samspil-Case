import { Test, TestingModule } from "@nestjs/testing";
import { EnsembleMembershipController } from "./ensemble-membership.controller";
import { EnsembleMembershipService } from "./ensemble-membership.service";

describe("EnsembleMembershipController", () => {
  let controller: EnsembleMembershipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnsembleMembershipController],
      providers: [EnsembleMembershipService],
    }).compile();

    controller = module.get<EnsembleMembershipController>(EnsembleMembershipController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
