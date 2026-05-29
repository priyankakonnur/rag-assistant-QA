import os
import uuid

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct
)

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

COLLECTION_NAME = "documents"

client = None


def get_client():
    global client

    if client is None:
        client = QdrantClient(
            url=QDRANT_URL,
            api_key=QDRANT_API_KEY
        )

    return client


def create_collection():

    client = get_client()

    collections = client.get_collections().collections
    existing = [c.name for c in collections]

    # delete old 768-dim collection
    if COLLECTION_NAME in existing:
        client.delete_collection(
            collection_name=COLLECTION_NAME
        )

    # recreate with correct size
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=384,
            distance=Distance.COSINE
        )
    )


def store_chunks(chunks, embeddings):

    client = get_client()

    points = []

    for chunk, embedding in zip(chunks, embeddings):
        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "text": chunk
                }
            )
        )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )


def search_query(query_embedding):

    client = get_client()

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        limit=3
    ).points

    return results