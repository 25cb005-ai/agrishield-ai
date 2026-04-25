import Map "mo:core/Map";
import PesticideTypes "../types/pesticide";

module {
  public type State = Map.Map<Text, PesticideTypes.Pesticide>;

  public func list(state : State) : [PesticideTypes.Pesticide] {
    state.values()
      .filter(func(p : PesticideTypes.Pesticide) : Bool { p.is_available })
      .toArray();
  };

  public func getById(
    state : State,
    id : Text,
  ) : ?PesticideTypes.Pesticide {
    state.get(id);
  };
};
