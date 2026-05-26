from app.database.mongodb import users_collection

def create_user(user_data):

    users_collection.insert_one(user_data)


def get_user_by_email(email):

    return users_collection.find_one({
        "email": email
    })