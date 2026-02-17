from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, model_validator
from typing import Optional
from .posts import postLists
from fastapi.openapi.utils import get_openapi
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

postList = postLists()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only; see below
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
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
def postget(id: Optional[str] = None): #parameters allow parameterized endpoints
    if id:
        for posts in postList:
            if posts["id"] == id:
                return posts
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail= "post with id not found")
    return postList

@app.post("/v1/posts")
def postpost(post: postType):
    new = PostAddId(**post.model_dump())
    postList.append(new.model_dump())
    return new

@app.get("/v1/posts/{postId}")
def idPostGet(postId: str):
    foundpost = findPost(postId)
    return foundpost

@app.put("/v1/posts/{postId}")
def idPostPut(postId: str, post: postType):
    foundpost = findPost(postId)
    foundpost["title"] = post.title
    foundpost["body"] = post.body
    return foundpost

@app.delete("/v1/posts/{postId}")
def idPostDelete(postId: str):
    foundpost = findPost(postId)
    postindex = postList.index(foundpost)
    postList.pop(postindex)
    return foundpost

@app.get("/")
def main_root():
    apiDict = cache_openapi()
    allPaths = apiDict.get("paths", {}) #get the value of the key "path" returns an empty dict if not found
    pathkeys = {}
    for key in (allPaths):
        pathkeys[key] = {"methods": list(allPaths.get(key, {}))}
    return {
        "message" : "This is the main root of my fastapi",
        "endpoints" : pathkeys,
        "allEndpoints": allPaths
    }
    
def cache_openapi(): #caching openapi schema so it doesnt get the schema everytime api docs is opened
    if app.openapi_schema:
        return app.openapi_schema
    app.openapi_schema = get_openapi(
        title = "BrainrotAPI",
        version = "6.7",
        description= "Practice my apis lmao",
        routes = app.routes
    )
    return app.openapi_schema

def findPost(postId, foundpost = None):
    for posts in postList:
        if posts["id"] == postId:
            foundpost = posts
            break
    if foundpost == None:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail="post not found")
    return foundpost

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)