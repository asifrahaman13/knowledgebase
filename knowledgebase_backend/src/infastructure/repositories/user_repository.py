
from pymongo import MongoClient
from config.config import MONG0_URI

class UserRepository:

    def __init__(self):
        self.mongo_client=MongoClient(MONG0_URI)
        self.db=self.mongo_client['knowledgebase']

    def create_user(self, user_data: dict):
        try:
            user_collection=self.db['users']
            user_collection.insert_one(user_data)
            return user_data
        except Exception as e:
            return False