from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from src.application.web.controllers import user_controller
from src.application.web.controllers import pdf_controller
from src.application.web.controllers import pdf_chat_controller
from src.infastructure.middleware.logging_middleware import log_middleware

app = FastAPI()

origins = [
    "*",
]

# Add middlewares to the origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include the router from the controllers.
app.include_router(user_controller.router, prefix="/users", tags=["users"])
app.include_router(pdf_controller.aws_router, prefix="/aws", tags=["aws"])
app.include_router(pdf_chat_controller.pdf_router, prefix="/pdf", tags=["pdf"])

# Include the middleware.
app.add_middleware(BaseHTTPMiddleware, dispatch=log_middleware)


# Health check endpoint
@app.get("/health")
async def health_check():
    return JSONResponse(status_code=200, content={"status": "healthy"})
