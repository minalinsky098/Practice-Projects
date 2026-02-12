let selectedPostid = null;
async function getPostData(){ // Get Fetch
    const url = "https://jsonplaceholder.typicode.com/posts?userId=1";
    try{
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
                throw new Error(`HTTPS ${response.status}`);
        }
    }
    return await response.json();
    }
    catch(error){
        throw error;
    }
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
    getButton.disabled = false;
}
function createButtons(post, blogList){ //create buttons when you click the get button
        const link = document.createElement('button');
        link.className = 'blog-link';
        link.textContent = post.title.substring(0, 10) + '...';
        link.href = post;
        link.addEventListener('click', ()=>{
            selectedPostid = post.id;
            postArea.value = post.body;
            postTitle.value = post.title;
        });
        blogList.appendChild(link);
        blogList.append(document.createElement("br"));
}

async function putButtonHandler(){ //PUT Button handler
    if (!selectedPostid){
        window.alert("Please select a post to update");
        return;
    }
    const url = `https://jsonplaceholder.typicode.com/posts/${selectedPostid}`;
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
                id : selectedPostid,
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
    putButton.disabled = false;
}

async function postButtonHandler(){

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