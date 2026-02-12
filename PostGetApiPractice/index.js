let selectedPostId = null;
async function getPostData(){ // Get Fetch
    const url = "https://jsonplaceholder.typicode.com/posts?userId=1";
    let response = await fetch(url);
    throwForHttpError(response);
    return response.json();
}
async function getButtonHandler(postArea, postTitle, putButton){ //GET Button Handler
    const getButton = document.getElementById("getButton");
    const blogList = document.getElementById("blogList");
    let postData = null;
    getButton.disabled = true;
    try{
        postData = await getPostData();
        blogList.textContent = '';
        postData.forEach(post => createButtons(post, blogList, postArea, postTitle, putButton)); //create buttons for the links
    }
    catch(error){
        window.alert(`Unable to load posts: ${error.message}`);
        console.log(error);
    }
    finally{
    getButton.disabled = false;
    }
}
function createButtons(post, blogList, postArea, postTitle, putButton){ //create buttons when you click the get button
        const link = document.createElement('button');
        link.className = 'blog-link';
        link.textContent = post.title.substring(0, 10) + '...';
        link.addEventListener('click', ()=>{
            putButton.disabled = false;
            selectedPostId = post.id;
            postArea.value = post.body;
            postTitle.value = post.title;
        });
        blogList.appendChild(link);
        blogList.append(document.createElement("br"));
}

async function putButtonHandler(postArea, postTitle, putButton){ //PUT Button handler
    if (selectedPostId == null) {
        putButton.disabled = true;
        return;
    }
    const url = `https://jsonplaceholder.typicode.com/posts/${selectedPostId}`;
    let data = null;
    putButton.disabled = true;
    try{
        const response = await fetch(url,{
            method : 'PUT',
            body : JSON.stringify({
                userId : 1,
                title : postTitle.value,
                body : postArea.value,
                id : selectedPostId,
            }),
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8',
            },
        });
        throwForHttpError(response);
        data = await response.json();
        console.log('Updated: ', data);
        window.alert("Post Updated!");
    }
    catch(error){
        console.log(error);
        window.alert(`Unable to update post: ${error.message}`);
    }
    finally{
        putButton.disabled = false;
    }
}

async function postButtonHandler(){ //will be added for later
    console.log("hello");
}
function throwForHttpError(response) {
  if (response.ok) return;
  const messages = {
    400: 'Bad request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not found',
    409: 'Conflict',
    500: 'Server error'
  };
  const fallbackMsg =
    (response.statusText && response.statusText.trim()) || 'HTTP error';
  const baseMsg = messages[response.status] || fallbackMsg;
  const msg = `HTTP ${response.status} ${baseMsg}`;
  throw new Error(msg);
}
async function main(){
    const putButton = document.getElementById("putButton");
    const postArea = document.getElementById("postArea");
    const postTitle = document.getElementById("postTitle");
    const getButton = document.getElementById("getButton");
    getButton.addEventListener('click', () => getButtonHandler(postArea, postTitle, putButton));
    putButton.addEventListener('click', () => putButtonHandler(postArea, postTitle, putButton));
}
main();