import pymongo
from pymongo import MongoClient


class DatabaseRepository:
    def __init__(self):

        # Connect to the database
        self.client = MongoClient("localhost", 27017)
        self.db_knowledgebase = self.client["knowledgebase"]

    def insert_one(self, data: str, collection_name: str):

        try:
            # Define the collection where the data will be stored
            collection = self.db_knowledgebase[collection_name]

            # Insert the data into the collection
            collection.insert_one(data)

            # Return the data that was stored
            return data
        except Exception as e:
            return None

    def find_all(self, field: str, field_value: str, collection_name: str):

        # Create an empty list to store the data that will be found
        all_pdfs_of_user = []
        try:

            # Define the collection where the data will be stored
            collection = self.db_knowledgebase[collection_name]

            # Find all the data that matches the username
            pdf_data = collection.find({field: field_value})

            for item in pdf_data:
                item["_id"] = str(item["_id"])
                all_pdfs_of_user.append(item)

            # Return the data that was found
            return all_pdfs_of_user
        except Exception as e:
            return None

    def check_if_file_belongs_to_user(self, username: str, pdf_name: str):
        try:

            # Define the collection where the data will be stored
            collection = self.db_knowledgebase["pdfs"]

            # Find the data that matches the username and pdf name
            pdf_data = collection.find_one({"username": username, "pdf_name": pdf_name})
            print(pdf_data)

            if pdf_data is not None:
                return True
            else:
                return False

        except Exception as e:
            return False
        
    def find_single_document(self, field: str, field_value: str, collection_name: str):
        try:

            # Define the collection where the data will be stored
            collection = self.db_knowledgebase[collection_name]

            # Find the data that matches the username
            result = collection.find_one({field: field_value})

            # Return the data that was found
            return result
        except Exception as e:
            return None

    def delete_one(self, field: str, field_value: str, collection_name: str):
        try:
            print("field",field, field_value, collection_name)
            # Define the collection where the data will be stored
            collection = self.db_knowledgebase[collection_name]

            # Delete the data that matches the username
            a=collection.delete_one({field: field_value})
            print(a)
           
            # Return the data that was found
            return True
        except Exception as e:
            return False