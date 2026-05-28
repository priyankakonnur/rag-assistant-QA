def generate_answer(context, question):

    if not context.strip():
        return "No relevant answer found."

    prompt = f"""
Answer the question using the context below.

Context:
{context}

Question:
{question}
"""

    # Temporary fallback:
    # return retrieved context directly
    return context[:1500]