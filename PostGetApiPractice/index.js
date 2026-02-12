let selectedPostId = null;
async function getPostData(){ // Get Fetch
    const url = "https://jsonplaceholder.typicode.com/posts?userId=1";
    let response = await fetch(url);
    if (!response.ok){
        switch(response.status){
            case 400:
                throw new Error(`INVALID_INPUT`);
            case 404:
                throw new Error(`SERVER_NOT_FOUND`);
            case 500:
                throw new Error(`SERVER_ERROR`);
            default:
                throw new Error(`HTTP ${response.status}`);
        }
    }
    return await response.json();
}
async function getButtonHandler(){ //GET Button Handler
    const getButton = document.getElementById("getButton");
    const blogList = document.getElementById("blogList");
    let postData = null;
    getButton.disabled = true;
    try{
        postData = await getPostData();
        blogList.textContent = '';
        postData.forEach(post => createButtons(post, blogList)); //create buttons for the links
    }
    catch(error){
        window.alert(`Unable to load posts: ${error.message}`);
        console.log(error);
    }
    finally{
    getButton.disabled = false;
    }
}
function createButtons(post, blogList){ //create buttons when you click the get button
        const postArea = document.getElementById("postArea");
        const postTitle = document.getElementById("postTitle");
        const link = document.createElement('button');
        link.className = 'blog-link';
        link.textContent = post.title.substring(0, 10) + '...';
        link.addEventListener('click', ()=>{
            selectedPostId = post.id;
            postArea.value = post.body;
            postTitle.value = post.title;
        });
        blogList.appendChild(link);
        blogList.append(document.createElement("br"));
}

async function putButtonHandler(){ //PUT Button handler
    if (!selectedPostId){
        window.alert("Please select a post to update");
        return;
    }
    const url = `https://jsonplaceholder.typicode.com/posts/${selectedPostId}`;
    const postTitle = document.getElementById("postTitle");
    const postArea = document.getElementById("postArea");
    const putButton = document.getElementById("putButton");
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
        if(!response.ok){
            switch(response.status){
                case 400:
                    throw new Error(`INVALID_INPUT`);
                case 404:
                    throw new Error(`SERVER_NOT_FOUND`);
                case 500:
                    throw new Error(`SERVER_ERROR`);
                default:
                    throw new Error(`HTTPS ${response.status}`);
            }
        }
        data = await response.json();
        console.log('Updated: ', data);
        window.alert("Post Updated!");
    }
    catch(error){
        console.log(error);
    }
    finally{
        putButton.disabled = false;
    }
}

async function postButtonHandler(){ //will be added for later

}
async function main(){
    const postButton = document.getElementById("postButton");
    const getButton = document.getElementById("getButton");
    const putButton = document.getElementById("putButton");
    getButton.addEventListener('click', getButtonHandler);
    putButton.addEventListener('click', putButtonHandler);
    postButton.addEventListener('click', postButtonHandler);
}
main();