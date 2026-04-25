import SeedTypes "../types/seed";
import SeedLib "../lib/seed";

mixin (seeds : SeedLib.State) {
  public shared query func getSeedBatch(batch_number : Text) : async ?SeedTypes.SeedBatch {
    SeedLib.getByBatchNumber(seeds, batch_number);
  };
};
