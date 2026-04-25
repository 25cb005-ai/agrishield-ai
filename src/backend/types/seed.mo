module {
  public type CropCategory = {
    #cereal;
    #vegetable;
    #fruit;
    #pulse;
    #oilseed;
    #fiber;
    #spice;
    #other;
  };

  public type QualityGrade = { #aplus; #a; #b; #c; #rejected };

  public type HealthStatus = { #certified; #treated; #untreated; #contaminated };

  public type SeedBatch = {
    id : Text;
    batch_number : Text;
    seed_type : Text;
    crop_category : CropCategory;
    manufacturer : Text;
    germination_rate : Nat;
    purity_percentage : Nat;
    quality_grade : QualityGrade;
    health_status : HealthStatus;
    certified_date : Int;
  };
};
