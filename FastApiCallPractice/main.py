from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

app = FastAPI()
userlist = {"1": "Bob", "2": "Alice", "3":"Mark", "4": "Charlie", "5":"Kirk"}

"""
Some commands to remember

uvicorn main:app --reload (initialize a server for your api)
curl.exe -H "Content-Type: application/json" "http:/127.0.0.1:8000/{endpoint}" 
(simple get execution)
Invoke-RestMethod -Uri "http://127.0.0.1:8000/{endpoint}" -Method 
POST -Headers @{"Content-Type"="application/json"} 
-Body '{"name":"RYC","id":"12"}' (Simple post execution)

"""

class userInfo(BaseModel):
    name : str
    id : str

@app.get("/")
def get_root():
    return {
        "message" : "Hello World",
        "endpoints": ""
        }

@app.post("/users")
def create_users(userinfo: userInfo):
    if userinfo.id in userlist:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = "User already in the list" )
    else:
        userlist[userinfo.id] = userinfo.name
        new = userlist[userinfo.id]
        return new
       

@app.get("/users/{userid}")
def get_users(userid: str):
    try:
        username = userlist[userid]
    except Exception:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = "User not found")
    return {
        "message" : f"Hello {username}",
        "userid" : userid
    }
