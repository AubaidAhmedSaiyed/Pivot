import pandas as pd

from ml.schema_samples import SCHEMA_SAMPLES
from services.schema_parser import parse_schema
from ml.feature_extractor import extract_features

def generate_dataset():
    """"
    Generate ML training dataset from curated schema samples.
    """
    rows = []

    for sample in SCHEMA_SAMPLES:

        schema = parse_schema(sample["sql"])

        features = extract_features(schema)

        features["complexity"] = sample["complexity"]

        rows.append(features)

    return pd.DataFrame(rows)

if __name__ == "__main__":

    dataset = generate_dataset()

    print("/n ML TRAINING DATASET")

    print(dataset)

    print("/n DATA SHAPE")
    print(dataset.shape)

    print("\nCLASS DISTRIBUTION:")
    print(dataset["complexity"].value_counts())