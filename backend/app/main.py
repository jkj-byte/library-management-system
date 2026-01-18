from fastapi import FastAPI, Depends, HTTPException, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, ClientOptions
from typing import Optional
import os
from dotenv import load_dotenv


# ENV

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise RuntimeError("Missing Supabase environment variables")



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# AUTH HELPERS

def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    token = authorization.split(" ")[1]

    supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    user_res = supabase.auth.get_user(token)

    if user_res.user is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    return {
        "id": user_res.user.id,
        "token": token,
    }


def get_user_supabase(token: str):
    return create_client(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        options=ClientOptions(
            headers={
                "Authorization": f"Bearer {token}"
            }
        )
    )


# HEALTH

@app.get("/health")
def health():
    return {"status": "ok"}

# BOOKS

@app.get("/api/books")
def list_books(
    search: Optional[str] = Query(None),
    user=Depends(get_current_user),
):
    sb = get_user_supabase(user["token"])

    query = sb.table("books").select("*").order("created_at", desc=True)

    if search:
        query = query.ilike("title", f"%{search}%")

    res = query.execute()

    return {
        "total": len(res.data),
        "books": res.data,
    }


@app.post("/api/books")
def add_book(book: dict, user=Depends(get_current_user)):
    sb = get_user_supabase(user["token"])

    data = {
        "title": book["title"],
        "author": book.get("author"),
        "status": book.get("status", "Reading"),
        "user_id": user["id"],
    }

    res = sb.table("books").insert(data).execute()

    return res.data[0]


@app.patch("/api/books/{book_id}")
def update_book_status(book_id: str, body: dict, user=Depends(get_current_user)):
    sb = get_user_supabase(user["token"])

    res = (
        sb.table("books")
        .update({"status": body["status"]})
        .eq("id", book_id)
        .execute()
    )

    return res.data[0]


@app.delete("/api/books/{book_id}")
def delete_book(book_id: str, user=Depends(get_current_user)):
    sb = get_user_supabase(user["token"])

    sb.table("books").delete().eq("id", book_id).execute()

    return {"success": True}
