from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, field_validator, model_validator
from typing import Optional
from uuid import UUID, uuid4

app = FastAPI()

"""
Some commands to remember

uvicorn main:app --reload (initialize a server for your api)
curl.exe -H "Content-Type: application/json" "http:/127.0.0.1:8000/{endpoint}" 
(simple get execution)

Invoke-RestMethod -Uri "http://127.0.0.1:8000/{endpoint}" -Method 
POST -Headers @{"Content-Type"="application/json"} 
-Body '{"name":"RYC","id":"12"}' (Simple post execution)

curl.exe --json '{\"name\":\"{nameinput}\",\"id\":\"{userid}\"}' 
"http://127.0.0.1:8000/endpoint"

curl.exe -X POST -H "Content-Type: application/json" 
-d '{\"name\":\"RYC\",\"id\":\"12\"}' "http://127.0.0.1:8000/endpoint"
(simple post execution)

curl.exe -v --json '{\"name\":\"Test\",\"id\":\"99\"}' "http://127.0.0.1:8000/users"
(check for headers)
"""

userlist = {"1": "Bob", "2": "Alice", "3":"Mark", "4": "Charlie", "5":"Kirk"}
class userInfo(BaseModel):
    name : str
    id : Optional[str] = None 
        
    @model_validator(mode="after")
    def userInList(model):
        if model.id in userlist or model.name in userlist.values():
            raise ValueError("User already in list")
        return model
        

@app.get("/")
def get_root():
    return {
        "message" : "Hello World",
        "users": userlist
        }

@app.post("/v1/users")
def create_users(userinfo: userInfo):
    if userinfo.id is None:
        print("no id")
        userinfo.id = str(uuid4())
    else:
        print("has id")
        userinfo.id = userinfo.id
    userlist[userinfo.id] = userinfo.name
    return userinfo
       

@app.get("/v1/users/{userid}")
def get_users(userid: str):
    try:
        username = userlist[userid]
    except Exception:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = "User not found")
    return {
        "message" : f"Hello {username}",
        "userid" : userid
    }
