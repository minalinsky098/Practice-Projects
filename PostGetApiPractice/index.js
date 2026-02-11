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
            console.log(link.href); //log
        });
        blogList.appendChild(link);
        blogList.append(document.createElement("br"));
}

async function putButtonHandler(){ //PUT Button handler
    const postTitle = document.getElementById("postTitle");
    const postArea = document.getElementById("postArea");
    const blogButtons = document.getElementsByClassName("blog-link");
    postTitle.disabled = false;
    postArea.disabled = false;
    console.log(selectedPostid);
    console.log(blogButtons[selectedPostid-1].href);
}

async function main(){
    const getButton = document.getElementById("getButton");
    const putButton = document.getElementById("putButton");
    getButton.addEventListener('click', getButtonHandler);
    putButton.addEventListener('click', putButtonHandler);
}
main();