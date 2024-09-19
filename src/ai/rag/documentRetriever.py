from typing import List, Dict, Any
import numpy as np
from src.ai.rag.vectorStore import VectorStore
from src.ai.rag.knowledgeBase import KnowledgeBase
from src.ai.utils.text_preprocessor import preprocess_text
from src.config import RETRIEVAL_CONFIG

# Global variables
vector_store: VectorStore = None
knowledge_base: KnowledgeBase = None

def initialize_retriever() -> None:
    """
    Initializes the document retriever with necessary components
    """
    global vector_store, knowledge_base

    # Initialize VectorStore with configuration settings
    vector_store = VectorStore(**RETRIEVAL_CONFIG.get('vector_store', {}))

    # Initialize KnowledgeBase with configuration settings
    knowledge_base = KnowledgeBase(**RETRIEVAL_CONFIG.get('knowledge_base', {}))

def retrieve_documents(query: str, top_k: int) -> List[Dict[str, Any]]:
    """
    Retrieves relevant documents based on the given query

    Args:
        query (str): The input query
        top_k (int): Number of top documents to retrieve

    Returns:
        List[Dict[str, Any]]: List of retrieved documents with metadata
    """
    # Preprocess the input query using preprocess_text function
    preprocessed_query = preprocess_text(query)

    # Convert preprocessed query to vector representation
    query_vector = vector_store.text_to_vector(preprocessed_query)

    # Perform similarity search using vector_store to get top_k similar document IDs
    similar_docs = vector_store.similarity_search(query_vector, top_k)

    # Retrieve full documents from knowledge_base using the document IDs
    retrieved_documents = []
    for doc_id, similarity_score in similar_docs:
        document = knowledge_base.get_document(doc_id)
        if document:
            document['similarity_score'] = similarity_score
            retrieved_documents.append(document)

    # Return list of retrieved documents with their metadata and similarity scores
    return retrieved_documents

def filter_documents(documents: List[Dict[str, Any]], similarity_threshold: float) -> List[Dict[str, Any]]:
    """
    Filters retrieved documents based on relevance and other criteria

    Args:
        documents (List[Dict[str, Any]]): List of retrieved documents
        similarity_threshold (float): Minimum similarity score to keep a document

    Returns:
        List[Dict[str, Any]]: Filtered list of documents
    """
    # Filter documents based on similarity score threshold
    filtered_docs = [doc for doc in documents if doc['similarity_score'] >= similarity_threshold]

    # Apply additional filtering criteria (e.g., document type, date)
    # This is a placeholder for additional filtering logic
    # TODO: Implement additional filtering criteria based on specific requirements

    # Sort filtered documents by relevance score
    sorted_docs = sorted(filtered_docs, key=lambda x: x['similarity_score'], reverse=True)

    # Return the filtered and sorted list of documents
    return sorted_docs

# Initialize the document retriever components
initialize_retriever()