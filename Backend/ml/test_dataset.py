from ml.schema_samples import SCHEMA_SAMPLES
from services.schema_parser import parse_schema
from ml.feature_extractor import extract_features


for sample in SCHEMA_SAMPLES:

    print("\n" + "=" * 50)
    print("SCHEMA :", sample["name"])
    print("LABEL  :", sample["complexity"])
    print("=" * 50)

    try:
        schema = parse_schema(sample["sql"])

        features = extract_features(schema)

        print("ML FEATURES:")
        print(features)

    except Exception as e:
        print("ERROR:", e)