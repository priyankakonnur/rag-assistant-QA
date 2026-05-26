from app.rag.loader import load_pdf
from app.rag.chunker import split_text
from app.rag.embeddings import create_embedding
from app.rag.vector_store import (
    create_collection,
    store_chunks,
    search_query
)
from app.rag.generator import generate_answer
from app.repositories.chat_repository import (
    save_chat
)


def process_document(file_path):

    text = load_pdf(file_path)

    chunks = split_text(text)

    embeddings = []

    for chunk in chunks:
        embedding = create_embedding(chunk)
        embeddings.append(embedding)

    create_collection()

    store_chunks(chunks, embeddings)

    return "Document processed successfully"


# def ask_question(question):

#     query_embedding = create_embedding(question)

#     results = search_query(query_embedding)

#     context = ""

#     for result in results:
#         context += result.payload["text"] + "\n"

#     answer = generate_answer(context, question)

#     return answer

def ask_question(question, user_email):

    query_embedding = create_embedding(question)

    results = search_query(query_embedding)

    context = ""

    for result in results:
        context += result.payload["text"] + "\n"

    answer = generate_answer(
        context,
        question
    )

    chat_data = {
        "email": user_email,
        "question": question,
        "answer": answer
    }

    print("Saving:", chat_data)

    save_chat(chat_data)

    return answer