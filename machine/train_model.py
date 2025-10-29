import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import r2_score
import joblib

print("Loading data...")
# Load the dataset
df = pd.read_csv('Sleep_health_and_lifestyle_dataset.csv')

# Drop 'Person ID' as it's just an identifier
df = df.drop('Person ID', axis=1)

# Advanced Feature Engineering: Split Blood Pressure
df[['Systolic_BP', 'Diastolic_BP']] = df['Blood Pressure'].str.split('/', expand=True).astype(int)
df = df.drop('Blood Pressure', axis=1) # Drop the original column

# Map BMI Category to a numerical order (Ordinal Encoding)
bmi_mapping = {'Normal': 1, 'Overweight': 2, 'Obese': 3, 'Normal Weight': 1}
df['BMI Category'] = df['BMI Category'].map(bmi_mapping)

# Map Sleep Disorder to numerical (Label Encoding)
disorder_mapping = {'None': 0, 'Sleep Apnea': 1, 'Insomnia': 2}
df['Sleep Disorder'] = df['Sleep Disorder'].map(disorder_mapping)

print("Data processing complete.")

# Define our target (y) and features (X)
# We will predict 'Quality of Sleep' (a score from 1-10)
y = df['Quality of Sleep']
X = df.drop('Quality of Sleep', axis=1)

# Define which columns are categorical and which are numerical
# 'Gender' and 'Occupation' will be one-hot encoded
categorical_features = ['Gender', 'Occupation']
# All other features are numerical and will be scaled
numerical_features = X.drop(categorical_features, axis=1).columns

print("Building preprocessing pipeline...")
# Create the "preprocessor" pipeline
# This is an advanced technique that bundles all preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# Create the full model pipeline
# It first runs the preprocessor, then trains the model
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
])

print("Splitting and training model...")
# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model.fit(X_train, y_train)

print("Model training complete.")

# Evaluate the model
y_pred = model.predict(X_test)
score = r2_score(y_test, y_pred)
print(f"Model R-squared score: {score:.4f}")
print("This score (R-squared) tells us how well the model predicts sleep quality. A score closer to 1.0 is better.")

# Save the trained model
joblib.dump(model, 'sleep_model.pkl')
print("Model saved as 'sleep_model.pkl'. You can now run the API.")

