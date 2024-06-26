import boto3
from config.config import AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME


class AWSRepository:

    def __init__(self):
        # Initialize the AWSRepository class with the required configuration
        self.aws_bucket_name = AWS_BUCKET_NAME
        self.aws_access_key = AWS_ACCESS_KEY
        self.aws_secret_key = AWS_SECRET_KEY
        self.aws_service = "s3"
        self.s3_client = boto3.client(
            self.aws_service,
            aws_access_key_id=self.aws_access_key,
            aws_secret_access_key=self.aws_secret_key,
        )
        self.expiration_time = 60

    def upload_pdf(self, file_name, file_content):
        try:
            # Upload the file to the S3 bucket
            self.s3_client.put_object(
                Bucket=self.aws_bucket_name, Key=file_name, Body=file_content
            )
            return True
        except Exception as e:
            print(e)
            return False

    def get_presigned_pdf_url(self, file_name):
        try:
            # Generate a presigned URL for the file
            url = self.s3_client.generate_presigned_url(
                ClientMethod="get_object",
                Params={
                    "Bucket": self.aws_bucket_name,
                    "Key": file_name,
                    "ResponseContentDisposition": "inline",
                    "ResponseContentType": "application/pdf",
                },
                ExpiresIn=self.expiration_time,
            )
            print(url)
            return url
        except Exception as e:
            print(f"An error occurred: {e}")
            return None
