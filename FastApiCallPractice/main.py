from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, model_validator
from typing import Optional
app = FastAPI()

postList = [
    {
    "title" : "lorem",
    "body" : "epsum",
    "id" : "1"
    },
    {
    "title" : "second",
    "body" : "message",
    "id" : "2"
    }
]

class postType(BaseModel):
    title : str
    body : str

class PostAddId(postType):
    id : str = ""
        
    @model_validator(mode = "after")
    
    def assign_id(self):
        self.id = str(len(postList)+1)
        return self
    

@app.get("/v1/posts")
def postget():
    return postList

@app.post("/v1/posts")
def postpost(post: postType):
    new = PostAddId(**post.model_dump())
    postList.append(new.model_dump())
    return new

@app.get("/v1/posts/{postId}")
def idPostGet(postId: str):
    foundpost = None
    for posts in postList:
        if posts["id"] == postId:
            foundpost = posts
    if foundpost == None:
        raise HTTPException(status_code=404, detail="post not found")
    return foundpost

@app.get("/")
def main_root():
    apiDict = app.openapi() #returns a dict of the whole schema of the api
    allPaths = app.openapi().get("paths", {}) #get the value of the key "path" returns an empty dict if not found
    pathkeys = {}
    for key in (allPaths):
        pathkeys[key] = {"method": list(allPaths.get(key, {}))}
    return {
        "message" : "This is the main root of my fastapi",
        "endpoints" : pathkeys,
        "allEndpoints": allPaths
    }