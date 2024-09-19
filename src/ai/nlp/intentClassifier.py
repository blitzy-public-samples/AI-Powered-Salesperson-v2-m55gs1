import tensorflow as tf
import numpy as np
from sklearn.preprocessing import LabelEncoder
from src.ai.utils.text_preprocessor import preprocess_text
from src.ai.utils.model_loader import load_model
from src.config import INTENT_MODEL_PATH, INTENT_CLASSES

# Global variables
model: tf.keras.Model = None
label_encoder: LabelEncoder = None

def load_intent_classifier() -> tuple:
    """
    Loads the intent classification model and label encoder
    
    Returns:
        tuple: (tf.keras.Model, LabelEncoder)
    """
    global model, label_encoder
    
    # Load the pre-trained model using load_model function
    model = load_model(INTENT_MODEL_PATH)
    
    # Initialize and fit LabelEncoder with INTENT_CLASSES
    label_encoder = LabelEncoder()
    label_encoder.fit(INTENT_CLASSES)
    
    # Return the loaded model and label encoder
    return model, label_encoder

def classify_intent(text: str) -> tuple:
    """
    Classifies the intent of a given text input
    
    Args:
        text (str): Input text to classify
    
    Returns:
        tuple: (string, float) - Predicted intent label and its probability
    """
    # Preprocess the input text using preprocess_text function
    preprocessed_text = preprocess_text(text)
    
    # Convert preprocessed text to model input format
    # Note: Assuming the model expects a 1D array of tokenized text
    model_input = np.array([preprocessed_text])
    
    # Use the model to predict intent probabilities
    intent_probabilities = model.predict(model_input)[0]
    
    # Get the index of the highest probability
    predicted_index = np.argmax(intent_probabilities)
    
    # Use label_encoder to convert index to intent label
    predicted_intent = label_encoder.inverse_transform([predicted_index])[0]
    
    # Get the probability of the predicted intent
    predicted_probability = intent_probabilities[predicted_index]
    
    # Return the predicted intent label and its probability
    return predicted_intent, float(predicted_probability)

# Initialize model and label_encoder
model, label_encoder = load_intent_classifier()