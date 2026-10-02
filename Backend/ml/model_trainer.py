import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score,classification_report
from ml.synthetic_dataset import get_combined_dataset

def train_model():
    # Generate dataset 
    dataset = get_combined_dataset()

    # ML features
    feature_columns = [
    "table_count",
    "column_count",
    "foreign_key_count",
    "constraint_count",
    "index_count",
    "trigger_count",
    "unsupported_feature_count",
    "unsigned_type_count",
    "auto_increment_count",
    "default_value_count",
    "check_constraint_count",
    "unique_constraint_count"
    ]

    x = dataset[feature_columns]
    y = dataset["complexity"]

    # split dataset
    x_train , x_test , y_train , y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    ) 

    # Random Forest model
    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        class_weight="balanced"
    )

    # Train
    model.fit(x_train,y_train)

    feature_importance = pd.Series(
        model.feature_importances_,
        index=feature_columns
    ).sort_values(ascending=False)

    print("\nFEATURE IMPORTANCE")
    print(feature_importance)

    # Save trained model
    joblib.dump(model, "ml/complexity_model.pkl")

    print("\nMODEL SAVED:")
    print("ml/complexity_model.pkl")

    #prediction
    y_pred = model.predict(x_test)

    # Evalution
    accuracy = accuracy_score(y_test,y_pred)

    print("\n MODEL TRAINING COMPLETE")

    print(f"Training samples :{len(x_train)}")
    print(f"Testing samples : {len(x_test)}")
    print(f"Accuracy : {accuracy:.2f}")

    print("\nCLLASIFICATION REPORT")

    print(
        classification_report(
            y_test,
            y_pred,
            zero_division=0
        )
    )

    return model


if __name__ == "__main__":
    train_model()

