import List "mo:core/List";
import Int "mo:core/Int";
import DiagnosisTypes "../types/diagnosis";
import Common "../types/common";

module {
  public type State = List.List<DiagnosisTypes.CropDiagnosis>;

  public func listByUser(
    state : State,
    user_id : Common.UserId,
  ) : [DiagnosisTypes.CropDiagnosis] {
    state.filter(func(d) { d.user_id == user_id }).toArray();
  };

  public func getById(
    state : State,
    id : Text,
  ) : ?DiagnosisTypes.CropDiagnosis {
    state.find(func(d) { d.id == id });
  };

  public func create(
    state : State,
    input : DiagnosisTypes.CreateDiagnosisInput,
    user_id : Common.UserId,
    created_at : Common.Timestamp,
  ) : DiagnosisTypes.CropDiagnosis {
    let id = user_id # "-" # created_at.toText();
    let diagnosis : DiagnosisTypes.CropDiagnosis = {
      id;
      image_url = input.image_url;
      crop_name = input.crop_name;
      disease_name = input.disease_name;
      confidence = input.confidence;
      severity = input.severity;
      quality_status = input.quality_status;
      consult_expert = input.consult_expert;
      symptoms = input.symptoms;
      treatment = input.treatment;
      fertilizer_recommendation = input.fertilizer_recommendation;
      pesticide_recommendation = input.pesticide_recommendation;
      notes = input.notes;
      created_at;
      user_id;
    };
    state.add(diagnosis);
    diagnosis;
  };

  public func delete(
    state : State,
    id : Text,
    user_id : Common.UserId,
  ) : Bool {
    let sizeBefore = state.size();
    let filtered = state.filter(func(d) { not (d.id == id and d.user_id == user_id) });
    if (filtered.size() < sizeBefore) {
      state.clear();
      state.append(filtered);
      true;
    } else {
      false;
    };
  };
};
