import Map "mo:core/Map";
import SeedTypes "../types/seed";

module {
  public type State = Map.Map<Text, SeedTypes.SeedBatch>;

  public func getByBatchNumber(
    state : State,
    batch_number : Text,
  ) : ?SeedTypes.SeedBatch {
    state.get(batch_number);
  };
};
