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
async function getButtonHandler(){ //Get Button Handler
    const getButton = document.getElementById("getButton");
    const postTitle = document.getElementById("postTitle");
    const postArea = document.getElementById("postArea");
    const blogList = document.getElementById("blogList");
    let postData = null;
    getButton.disabled = true;
    try{
        postData = await getPostData();
        console.log(typeof(postData));
        blogList.textContent = '';
        postData.forEach(post => {
            const link = document.createElement('button');
            link.className = 'blog-link';
            link.textContent = post.title.substring(0, 10) + '...';
            link.href = post;
            link.addEventListener('click', ()=>{
                selectedPostid = post.id;
                postArea.value = post.body;
                postTitle.value = post.title;
                console.log(link.href);
            });
            blogList.appendChild(link);
            blogList.append(document.createElement("br"));
        });
    }
    catch(error){
        window.alert(`Unable to load posts: ${error.message}`);
        console.log(error);
    }
    getButton.disabled = false;
}

async function putButtonHandler(){
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