import PesticideTypes "../types/pesticide";
import PesticideLib "../lib/pesticide";

mixin (pesticides : PesticideLib.State) {
  public shared query func listPesticides() : async [PesticideTypes.Pesticide] {
    PesticideLib.list(pesticides);
  };

  public shared query func getPesticide(id : Text) : async ?PesticideTypes.Pesticide {
    PesticideLib.getById(pesticides, id);
  };
};
