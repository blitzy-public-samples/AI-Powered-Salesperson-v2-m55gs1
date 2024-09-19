import spacy
from typing import List, Dict, Any
from src.ai.utils.text_preprocessor import preprocess_text
from src.config import NER_MODEL_PATH, CUSTOM_ENTITIES

# Global variable to store the loaded spaCy NER model
nlp: spacy.language.Language = None

def load_ner_model() -> spacy.language.Language:
    """
    Loads the Named Entity Recognition model
    """
    # Load the pre-trained spaCy model using NER_MODEL_PATH
    model = spacy.load(NER_MODEL_PATH)
    return model

def extract_entities(text: str) -> List[Dict[str, Any]]:
    """
    Extracts entities from the given text input
    """
    # Preprocess the input text using preprocess_text function
    preprocessed_text = preprocess_text(text)

    # Apply the NER model to the preprocessed text
    doc = nlp(preprocessed_text)

    # Extract standard named entities
    standard_entities = [
        {"text": ent.text, "label": ent.label_, "start": ent.start_char, "end": ent.end_char}
        for ent in doc.ents
    ]

    # Apply custom entity extraction rules
    custom_entities = extract_custom_entities(preprocessed_text)

    # Combine and format all extracted entities
    all_entities = standard_entities + custom_entities

    # Sort entities by their start position
    all_entities.sort(key=lambda x: x["start"])

    return all_entities

def extract_custom_entities(text: str) -> List[Dict[str, Any]]:
    """
    Extracts custom entities based on predefined rules
    """
    custom_entities = []

    # Iterate through CUSTOM_ENTITIES
    for entity_type, entity_rules in CUSTOM_ENTITIES.items():
        # Apply regex patterns or keyword matching for each custom entity type
        if "regex" in entity_rules:
            matches = entity_rules["regex"].finditer(text)
            for match in matches:
                custom_entities.append({
                    "text": match.group(),
                    "label": entity_type,
                    "start": match.start(),
                    "end": match.end()
                })
        elif "keywords" in entity_rules:
            for keyword in entity_rules["keywords"]:
                start = text.lower().find(keyword.lower())
                if start != -1:
                    custom_entities.append({
                        "text": text[start:start+len(keyword)],
                        "label": entity_type,
                        "start": start,
                        "end": start + len(keyword)
                    })

    return custom_entities

# Initialize the NER model
nlp = load_ner_model()

# Export the main function for entity extraction
__all__ = ["extract_entities"]