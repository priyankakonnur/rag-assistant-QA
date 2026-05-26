# from app.database.mongodb import chat_collection

# def save_chat(data):

#     chat_collection.insert_one(data)


# def get_user_chats(email):

#     chats = chat_collection.find({
#         "email": email
#     })

#     return list(chats)


from app.database.mongodb import chat_collection


def save_chat(data):
    result = chat_collection.insert_one(data)

    print("CHAT SAVED:", result.inserted_id)

    return str(result.inserted_id)


def get_user_chats(email):
    chats = chat_collection.find(
        {"email": email}
    )

    return list(chats)