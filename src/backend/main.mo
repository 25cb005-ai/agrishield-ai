import List "mo:core/List";
import Map "mo:core/Map";
import DiagnosisTypes "types/diagnosis";
import OrderTypes "types/order";
import PesticideTypes "types/pesticide";
import SeedTypes "types/seed";
import DiagnosisLib "lib/diagnosis";
import OrderLib "lib/order";
import PesticideLib "lib/pesticide";
import SeedLib "lib/seed";
import DiagnosisMixin "mixins/diagnosis-api";
import OrderMixin "mixins/order-api";
import PesticideMixin "mixins/pesticide-api";
import SeedMixin "mixins/seed-api";

actor {
  let diagnoses : DiagnosisLib.State = List.empty<DiagnosisTypes.CropDiagnosis>();
  let orders : OrderLib.State = List.empty<OrderTypes.Order>();
  let pesticides : PesticideLib.State = Map.empty<Text, PesticideTypes.Pesticide>();
  let seeds : SeedLib.State = Map.empty<Text, SeedTypes.SeedBatch>();

  // Seed sample data on first deploy
  if (pesticides.isEmpty()) {
    let samplePesticides : [PesticideTypes.Pesticide] = [
      {
        id = "pest-001";
        name = "Cypermethrin 25 EC";
        brand = "Rallis India";
        category = #insecticide;
        description = "A broad-spectrum pyrethroid insecticide effective against sucking and chewing pests. Widely used in cotton, rice, and vegetable crops.";
        price = 320.0;
        unit = "500 ml";
        stock = 150;
        image_url = "";
        suitable_for = ["Cotton", "Rice", "Wheat", "Vegetables", "Pulses"];
        active_ingredient = "Cypermethrin 25% EC";
        is_available = true;
      },
      {
        id = "pest-002";
        name = "Mancozeb 75 WP";
        brand = "Indofil Industries";
        category = #fungicide;
        description = "Contact fungicide with multi-site activity. Highly effective against early and late blight, downy mildew, and leaf spots in various crops.";
        price = 280.0;
        unit = "1 kg";
        stock = 200;
        image_url = "";
        suitable_for = ["Potato", "Tomato", "Grapes", "Onion", "Groundnut"];
        active_ingredient = "Mancozeb 75% WP";
        is_available = true;
      },
      {
        id = "pest-003";
        name = "Glyphosate 41 SL";
        brand = "Monsanto India";
        category = #herbicide;
        description = "Non-selective, systemic herbicide for control of annual and perennial weeds. Suitable for pre-sowing and post-harvest weed management.";
        price = 450.0;
        unit = "1 litre";
        stock = 120;
        image_url = "";
        suitable_for = ["Orchards", "Tea Gardens", "Plantation Crops", "Non-crop Areas"];
        active_ingredient = "Glyphosate 41% SL";
        is_available = true;
      },
      {
        id = "pest-004";
        name = "Imidacloprid 17.8 SL";
        brand = "Bayer CropScience";
        category = #insecticide;
        description = "Systemic neonicotinoid insecticide highly effective against piercing-sucking insects. Controls whitefly, aphids, jassids, and thrips.";
        price = 560.0;
        unit = "250 ml";
        stock = 180;
        image_url = "";
        suitable_for = ["Rice", "Cotton", "Sugarcane", "Tomato", "Chilli"];
        active_ingredient = "Imidacloprid 17.8% SL";
        is_available = true;
      },
      {
        id = "pest-005";
        name = "Trichoderma viride";
        brand = "T Stanes";
        category = #biopesticide;
        description = "Bio-fungicide based on Trichoderma viride strain for soil-borne disease management. Controls root rot, collar rot, and damping-off in various crops.";
        price = 180.0;
        unit = "500 g";
        stock = 300;
        image_url = "";
        suitable_for = ["Vegetables", "Pulses", "Oilseeds", "Cereals", "Flowers"];
        active_ingredient = "Trichoderma viride 1.5% WP (min. 2x10^6 CFU/g)";
        is_available = true;
      },
    ];
    for (p in samplePesticides.vals()) {
      pesticides.add(p.id, p);
    };
  };

  if (seeds.isEmpty()) {
    let sampleSeeds : [SeedTypes.SeedBatch] = [
      {
        id = "seed-001";
        batch_number = "SB-001";
        seed_type = "IR-64 Rice";
        crop_category = #cereal;
        manufacturer = "National Seeds Corporation";
        germination_rate = 95;
        purity_percentage = 99;
        quality_grade = #aplus;
        health_status = #certified;
        certified_date = 1_700_000_000_000_000_000;
      },
      {
        id = "seed-002";
        batch_number = "SB-002";
        seed_type = "HD-2967 Wheat";
        crop_category = #cereal;
        manufacturer = "Punjab Agro Industries";
        germination_rate = 93;
        purity_percentage = 98;
        quality_grade = #a;
        health_status = #certified;
        certified_date = 1_700_000_000_000_000_000;
      },
      {
        id = "seed-003";
        batch_number = "SB-003";
        seed_type = "Pusa Ruby Tomato";
        crop_category = #vegetable;
        manufacturer = "Indian Agricultural Research Institute";
        germination_rate = 90;
        purity_percentage = 97;
        quality_grade = #a;
        health_status = #treated;
        certified_date = 1_700_000_000_000_000_000;
      },
    ];
    for (s in sampleSeeds.vals()) {
      seeds.add(s.batch_number, s);
    };
  };

  include DiagnosisMixin(diagnoses);
  include OrderMixin(orders);
  include PesticideMixin(pesticides);
  include SeedMixin(seeds);
};
