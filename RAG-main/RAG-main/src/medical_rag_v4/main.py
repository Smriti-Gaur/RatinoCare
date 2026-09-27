
# from medical_rag_v4.generation.generation import ask_question
# result = ask_question(
#     question="What is my MMEF result?",
#     user_id="user_123",
#     document_id="report_001"
# )



# print("ANSWER:")
# print(result["answer"])


# print("\nSOURCES:")

# for source in result["sources"]:
#     print(
#         f"Page: {source.get('page')}"
#     )

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from medical_rag_v4.api.routes import router

app = FastAPI(
    title="Medical RAG API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
def health():
    return {
        "status": "ok"
    }