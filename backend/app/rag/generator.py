import ollama

def generate_answer(context, question):

    prompt = f"""
    Answer the question using the context below.

    Context:
    {context}

    Question:
    {question}
    """

    response = ollama.generate(
        model="llama3.2:3b",
        prompt=prompt
    )

    return response["response"]