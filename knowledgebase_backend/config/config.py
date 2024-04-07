# sample config file

from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

OPEN_AI_API_KEY=os.getenv("OPEN_AI_API_KEY")
print(OPEN_AI_API_KEY)
AWS_ACCESS_KEY=os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY=os.getenv("AWS_SECRET_KEY")
AWS_BUCKET_NAME=os.getenv("AWS_BUCKET_NAME")
SECRET_KEY  = os.getenv('SECRET_KEY')
MONG0_URI = os.getenv('MONG0_URI')
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI')
AWS_S3_URL=os.getenv("AWS_S3_URL")