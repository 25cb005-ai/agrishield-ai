module {
  public type PesticideCategory = {
    #insecticide;
    #fungicide;
    #herbicide;
    #rodenticide;
    #biopesticide;
    #other;
  };

  public type Pesticide = {
    id : Text;
    name : Text;
    brand : Text;
    category : PesticideCategory;
    description : Text;
    price : Float;
    unit : Text;
    stock : Nat;
    image_url : Text;
    suitable_for : [Text];
    active_ingredient : Text;
    is_available : Bool;
  };
};
