import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAI
from langchain_openai import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import Chroma
from config.config import OPEN_AI_API_KEY, AWS_S3_URL


class DocumentProcessor:
    def __init__(self):
        # Initialize the DocumentProcessor class with the required configuration
        self.api_key = OPEN_AI_API_KEY
        self.chunk_size = 2000
        self.chunk_overlap = 200

    def process_document(self, pdf_path):
        # Load the document from the PDF file
        embeddings = OpenAIEmbeddings(openai_api_key=self.api_key)

        # Load the document from the PDF file
        loader = PyPDFLoader(pdf_path)

        #  Load the document from the PDF file
        data = loader.load()

        # Split the document into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size, chunk_overlap=self.chunk_overlap
        )

        # Split the document into chunks
        texts = text_splitter.split_documents(data)
        return texts, embeddings


class QueryProcessor:
    def __init__(self, api_key):

        # Initialize the QueryProcessor class with the required configuration
        self.api_key = api_key
        self.model = "gpt-3.5-turbo-instruct"
        self.temperature = 0
        self.max_tokens = 700
        self.chain_type = "stuff"
        self.search_args = 5

    def process_query(self, question, texts, embeddings, OPENAI_API_KEY):
        docsearch = Chroma.from_documents(texts, embeddings)
        chain = RetrievalQA.from_chain_type(
            llm=OpenAI(
                temperature=self.temperature,
                model=self.model,
                openai_api_key=self.api_key,
                max_tokens=self.max_tokens,
            ),
            chain_type=self.chain_type,
            retriever=docsearch.as_retriever(
                search_type="similarity", search_kwargs={"k": self.search_args}
            ),
        )
        query = f"""You are given a pdf as the knowledgebase. Now answer the following question.
        
        The question is as follows: 

        {question}
        
        """
        response = chain.invoke(query, only_answer=True)
        return response


class PdfChatRepository:

    def __init__(self):
        self.api_key = OPEN_AI_API_KEY
        self.aws_url = AWS_S3_URL

    def generate_response(self, question_data, pdf_path):
        try:

            # Process the document
            doc_processor = DocumentProcessor()

            # Process the document
            texts, embeddings = doc_processor.process_document(
                f"{self.aws_url}/{pdf_path}"
            )
            
            # Process the query
            query_processor = QueryProcessor(self.api_key)

            # Process the query
            result = query_processor.process_query(
                question_data, texts, embeddings, self.api_key
            )

            print(result["result"])

            return result["result"]
        except Exception as e:
            print(e)
            return None
