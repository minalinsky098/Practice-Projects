let selectedPostId = null;
async function getData(){ // Get Fetch
    const url = "https://jsonplaceholder.typicode.com/posts?userId=1";
    let response = await fetch(url);
    throwForHttpError(response);
    return response.json();
}

async function getCreateButtons(putButton, postArea, postTitle){
    let postData = null;
    const blogList = document.getElementById("blogList");
    selectedPostId = null;
    putButton.disabled = true;
    try{
        postData = await getData();
        blogList.textContent = '';
        postData.forEach(post => createButtons(post, blogList, postArea, postTitle, putButton)); //create buttons for the links
    }
    catch(error){
        window.alert(`Unable to load posts: ${error.message}`);
        console.error(`Error: ${error}`);
    }
}

async function getButtonHandler(e, postArea, postTitle, putButton){ //GET Button Handler
    e.target.disabled = true;
    await getCreateButtons(putButton, postArea, postTitle);
    e.target.disabled = false;
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

async function putData(postArea, postTitle){
    const url = `https://jsonplaceholder.typicode.com/posts/${selectedPostId}`;
    let data = null;
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
        return response.json();
    }
    catch(error){
        throw error;
    }
}

async function putButtonHandler(e,postArea, postTitle){ //PUT Button handler
    let update = null
    if (selectedPostId == null) {
        window.alert("Please click a post to be updated");
        return;
    }
    e.target.disabled = true;
    try{
    update = await putData(postArea, postTitle);
    console.log('Updated: ', update);
    window.alert("Post Updated!");
    }
    catch(error){
        console.error(`Error: ${error}`);
        window.alert(`Unable to update post: ${error.message}`);
    }
    finally{
    e.target.disabled = false;
    }
}

async function postData(postArea, postTitle){
    const url = "https://jsonplaceholder.typicode.com/posts";
    let response = await fetch(url,{
        method : "POST",
        body : JSON.stringify({
            userId : 1,
            body : postArea.value,
            title : postTitle.value,
        }),
        headers : {
            "Content-Type" : "application/json",
        },
    });
    throwForHttpError(response);
    return response.json();
}

async function postButtonHandler(e, postArea, postTitle){ 
    if (!postArea.value){
        window.alert("ENTER A BODY FOR THE POST");
        return;
    }
    else if(! postTitle.value){
        window.alert("ENTER A TITLE FOR THE POST");
        return;
    }
    e.target.disabled = true;
    try{
    const response = await postData(postArea, postTitle);
    window.alert("POST IS POSTED");
    console.log('Posted!', response);
    }
    catch(error){
        console.error(`Error: ${error}`);
        window.alert(`POST CANNOT BE POSTED ${error.message}`);
    }
    finally{
        e.target.disabled = false;
    }
}

async function deleteData(){
    const url = `https://jsonplaceholder.typicode.com/posts/${selectedPostId}`;
    try{
    const response = await fetch(url,{
        method : 'DELETE',
    });
    throwForHttpError(response);
    return response.json();
    }
    catch(error){
        throw error;
    }
}

async function deleteButtonHandler(e, postArea, postTitle){
    if(!selectedPostId){
        window.alert("PLEASE CLICK A RESOURCE TO DELETE");
        return;
    }
    e.target.disabled = true;
    try{
        let response = await deleteData();
        postArea.value = "";
        postTitle.value = "";
        window.alert(`RESOURCE SUCCESSFULLY DELETED AT ID: ${selectedPostId}`);
        console.log(response);
    }
    catch(error){
        window.alert("CANNOT DELETE RESOURCES");
        console.error(`An error happened ${error.message}`);
    }
    finally{
        e.target.disabled = false;
    }
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
    const deleteButton = document.getElementById("deleteButton");
    const postButton = document.getElementById("postButton");
    const putButton = document.getElementById("putButton");
    const postArea = document.getElementById("postArea");
    const postTitle = document.getElementById("postTitle");
    const getButton = document.getElementById("getButton");
    getButton.addEventListener('click', (e) => getButtonHandler(e,postArea, postTitle, putButton));
    putButton.addEventListener('click', (e) => putButtonHandler(e,postArea, postTitle));
    postButton.addEventListener('click', (e) => postButtonHandler(e, postArea, postTitle));
    deleteButton.addEventListener('click', (e) => deleteButtonHandler(e, postArea, postTitle));
    
}
main();