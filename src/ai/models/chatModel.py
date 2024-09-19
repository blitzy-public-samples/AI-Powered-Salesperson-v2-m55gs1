from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from typing import List, Dict, Any
from config import MODEL_CONFIG
from ai.utils.text_preprocessor import preprocess_text
from ai.rag.contextSynthesizer import synthesize_context

# Global variables for the model and tokenizer
model: AutoModelForCausalLM = None
tokenizer: AutoTokenizer = None

def load_model() -> tuple[AutoModelForCausalLM, AutoTokenizer]:
    """
    Loads the pre-trained language model and tokenizer
    """
    global model, tokenizer
    
    # Load the tokenizer using AutoTokenizer.from_pretrained
    tokenizer = AutoTokenizer.from_pretrained(MODEL_CONFIG['model_name'])
    
    # Load the model using AutoModelForCausalLM.from_pretrained
    model = AutoModelForCausalLM.from_pretrained(MODEL_CONFIG['model_name'])
    
    # Move the model to GPU if available
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    
    return model, tokenizer

def generate_response(chat_history: List[Dict[str, str]], context: str) -> str:
    """
    Generates a response based on the chat history and context
    """
    # Preprocess the chat history and context
    preprocessed_history = [preprocess_text(msg['content']) for msg in chat_history]
    preprocessed_context = preprocess_text(context)
    
    # Construct the input prompt by combining chat history and context
    prompt = construct_prompt(preprocessed_history, preprocessed_context)
    
    # Tokenize the input prompt
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    
    # Generate response using the model
    with torch.no_grad():
        outputs = model.generate(**inputs, max_length=MODEL_CONFIG['max_length'])
    
    # Decode and post-process the generated response
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    final_response = post_process_response(response)
    
    return final_response

def construct_prompt(chat_history: List[str], context: str) -> str:
    """
    Constructs the input prompt for the model
    """
    # Initialize an empty prompt string
    prompt = ""
    
    # Add system instructions to the prompt
    prompt += "You are an AI-powered salesperson. Be helpful, professional, and persuasive.\n\n"
    
    # Add the context to the prompt
    prompt += f"Context: {context}\n\n"
    
    # Iterate through the chat history, adding each message to the prompt
    for i, message in enumerate(chat_history):
        role = "Human:" if i % 2 == 0 else "AI:"
        prompt += f"{role} {message}\n"
    
    # Add a prompt for the AI's response
    prompt += "AI:"
    
    return prompt

def post_process_response(response: str) -> str:
    """
    Post-processes the generated response
    """
    # Remove any unwanted artifacts or special tokens
    response = response.replace("<|endoftext|>", "").strip()
    
    # Trim whitespace and normalize punctuation
    response = " ".join(response.split())
    response = response.replace(" .", ".").replace(" ,", ",").replace(" !", "!").replace(" ?", "?")
    
    # Ensure the response is coherent and complete
    if not response.endswith((".", "!", "?")):
        response += "."
    
    return response

# Initialize the model and tokenizer
model, tokenizer = load_model()