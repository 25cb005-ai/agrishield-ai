import Time "mo:core/Time";
import DiagnosisTypes "../types/diagnosis";
import DiagnosisLib "../lib/diagnosis";

mixin (diagnoses : DiagnosisLib.State) {
  public shared query ({ caller }) func listDiagnosesByUser() : async [DiagnosisTypes.CropDiagnosis] {
    DiagnosisLib.listByUser(diagnoses, caller.toText());
  };

  public shared query ({ caller }) func getDiagnosis(id : Text) : async ?DiagnosisTypes.CropDiagnosis {
    switch (DiagnosisLib.getById(diagnoses, id)) {
      case (?d) { if (d.user_id == caller.toText()) ?d else null };
      case null { null };
    };
  };

  public shared ({ caller }) func createDiagnosis(data : DiagnosisTypes.CreateDiagnosisInput) : async DiagnosisTypes.CropDiagnosis {
    DiagnosisLib.create(diagnoses, data, caller.toText(), Time.now());
  };

  public shared ({ caller }) func deleteDiagnosis(id : Text) : async Bool {
    DiagnosisLib.delete(diagnoses, id, caller.toText());
  };
};
