from fastembed import TextEmbedding

embedding_model = None


def get_model():
    global embedding_model

    if embedding_model is None:
        embedding_model = TextEmbedding(
            model_name="BAAI/bge-small-en-v1.5"
        )

    return embedding_model


def create_embedding(text: str):
    model = get_model()

    embeddings = list(
        model.embed([text])
    )

    return embeddings[0].tolist()