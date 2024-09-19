from typing import List, Dict, Any
import numpy as np
from src.ai.utils.text_preprocessor import preprocess_text
from src.ai.nlp.entityExtractor import extract_entities
from src.config import SYNTHESIS_CONFIG

def synthesize_context(documents: List[Dict[str, Any]], query: str) -> str:
    # Preprocess the query
    preprocessed_query = preprocess_text(query)
    
    # Extract entities from the query
    entities = extract_entities(preprocessed_query)
    
    # Sort documents by relevance score
    sorted_documents = sorted(documents, key=lambda x: x.get('relevance_score', 0), reverse=True)
    
    # Initialize an empty context string
    context = ""
    remaining_length = SYNTHESIS_CONFIG['max_context_length']
    
    # Extract and add relevant passages to the context
    for doc in sorted_documents:
        if remaining_length <= 0:
            break
        
        relevant_passages = extract_relevant_passages(doc, preprocessed_query, entities)
        
        for passage in relevant_passages:
            if len(passage) <= remaining_length:
                context += passage + " "
                remaining_length -= len(passage)
            else:
                break
    
    # Reorder and structure the context for coherence
    structured_context = reorder_context(context.split())
    
    return structured_context

def extract_relevant_passages(document: Dict[str, Any], query: str, entities: List[Dict[str, Any]]) -> List[str]:
    # Split the document into sentences or paragraphs
    passages = document['content'].split('\n')
    
    # Calculate relevance scores for each passage
    scores = []
    for passage in passages:
        query_overlap = len(set(query.split()) & set(passage.split()))
        entity_overlap = sum(1 for entity in entities if entity['text'].lower() in passage.lower())
        score = query_overlap + entity_overlap
        scores.append(score)
    
    # Convert scores to numpy array for easier manipulation
    scores_array = np.array(scores)
    
    # Sort passages by relevance score
    sorted_indices = np.argsort(scores_array)[::-1]
    
    # Select top N passages based on relevance and diversity
    selected_passages = []
    for idx in sorted_indices[:SYNTHESIS_CONFIG['max_passages']]:
        selected_passages.append(passages[idx])
    
    return selected_passages

def reorder_context(passages: List[str]) -> str:
    # Group passages by topic or entity (simplified version)
    grouped_passages = {}
    for passage in passages:
        key_words = set(passage.split()[:3])  # Use first 3 words as a simple grouping key
        key = frozenset(key_words)
        if key in grouped_passages:
            grouped_passages[key].append(passage)
        else:
            grouped_passages[key] = [passage]
    
    # Order groups by relevance (assuming more passages in a group means higher relevance)
    ordered_groups = sorted(grouped_passages.values(), key=len, reverse=True)
    
    # Combine passages into a single coherent text with transitional phrases
    structured_context = ""
    for i, group in enumerate(ordered_groups):
        if i > 0:
            structured_context += "Furthermore, "
        structured_context += " ".join(group) + " "
    
    return structured_context.strip()

# Export the main function
__all__ = ['synthesize_context']