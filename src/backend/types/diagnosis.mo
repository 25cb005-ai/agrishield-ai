import Common "common";

module {
  public type Severity = { #low; #moderate; #high; #critical };

  public type CropDiagnosis = {
    id : Text;
    image_url : Text;
    crop_name : Text;
    disease_name : Text;
    confidence : Nat;
    severity : Severity;
    quality_status : Text;
    consult_expert : Bool;
    symptoms : [Text];
    treatment : Text;
    fertilizer_recommendation : Text;
    pesticide_recommendation : Text;
    notes : Text;
    created_at : Common.Timestamp;
    user_id : Common.UserId;
  };

  public type CreateDiagnosisInput = {
    image_url : Text;
    crop_name : Text;
    disease_name : Text;
    confidence : Nat;
    severity : Severity;
    quality_status : Text;
    consult_expert : Bool;
    symptoms : [Text];
    treatment : Text;
    fertilizer_recommendation : Text;
    pesticide_recommendation : Text;
    notes : Text;
  };
};
