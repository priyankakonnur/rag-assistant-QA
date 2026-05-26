from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"

client = MongoClient(MONGO_URL)

database = client["rag_project"]

users_collection = database["users"]

chat_collection = database["chat_history"]