import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler, LabelEncoder
from nltk import word_tokenize, stopwords
from string import punctuation
from config import PREPROCESSING_CONFIG

# Initialize global stop_words set
stop_words = set(stopwords.words('english'))

def preprocess_text(text: str, remove_stopwords: bool = True, lowercase: bool = True) -> str:
    # Tokenize the input text
    tokens = word_tokenize(text)
    
    # Remove punctuation
    tokens = [token for token in tokens if token not in punctuation]
    
    # Convert to lowercase if specified
    if lowercase:
        tokens = [token.lower() for token in tokens]
    
    # Remove stopwords if specified
    if remove_stopwords:
        tokens = [token for token in tokens if token not in stop_words]
    
    # Join tokens back into a string
    preprocessed_text = ' '.join(tokens)
    
    return preprocessed_text

def normalize_numerical_data(data: np.ndarray, method: str = 'standard') -> np.ndarray:
    # Check if method is 'standard' or 'minmax'
    if method not in ['standard', 'minmax']:
        raise ValueError("Method must be either 'standard' or 'minmax'")
    
    # Initialize appropriate scaler
    scaler = StandardScaler() if method == 'standard' else MinMaxScaler()
    
    # Fit and transform the data
    normalized_data = scaler.fit_transform(data.reshape(-1, 1)).flatten()
    
    return normalized_data

def encode_categorical_data(data: pd.Series) -> tuple:
    # Initialize LabelEncoder
    encoder = LabelEncoder()
    
    # Fit and transform the data
    encoded_data = encoder.fit_transform(data)
    
    return encoded_data, encoder

def handle_missing_values(df: pd.DataFrame, strategy: Dict[str, str]) -> pd.DataFrame:
    # Iterate through columns in the dataframe
    for column in df.columns:
        if column in strategy:
            if strategy[column] == 'mean':
                df[column].fillna(df[column].mean(), inplace=True)
            elif strategy[column] == 'median':
                df[column].fillna(df[column].median(), inplace=True)
            elif strategy[column] == 'mode':
                df[column].fillna(df[column].mode()[0], inplace=True)
            else:
                df[column].fillna(strategy[column], inplace=True)
    
    return df

def preprocess_chat_data(chat_history: List[Dict[str, str]]) -> List[Dict[str, str]]:
    # Iterate through chat messages
    preprocessed_history = []
    for message in chat_history:
        # Preprocess each message text
        preprocessed_text = preprocess_text(message['text'])
        
        # Maintain conversation structure
        preprocessed_message = {
            'role': message['role'],
            'text': preprocessed_text
        }
        preprocessed_history.append(preprocessed_message)
    
    return preprocessed_history

# Human tasks:
# TODO: Implement additional preprocessing techniques as needed
# TODO: Optimize preprocessing functions for better performance
# TODO: Add error handling and logging for preprocessing functions
# TODO: Implement unit tests for each preprocessing function