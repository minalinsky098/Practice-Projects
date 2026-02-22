//call function for getting APOD
async function get_APOD(APOD, apodDescription, imageName, date = ""){
    const parameters = new URLSearchParams({"apod_date": date})
    const url = `http://127.0.0.1:8000/v1/apod?${parameters}`;
    let pictureUrl = ""
    let pictureDescription = "";
    let pictureName = "";
    try{
        let response = await fetch(url);
        response = await handleResponse(response);
        pictureUrl = response.url;
        pictureDescription = response.explanation;
        pictureName = response.title;
        console.log(response);
    }
    catch(error){
        console.error(error.message);
        pictureUrl = "";
        pictureDescription = "";
        pictureName = "";
        throw error;
    }
    finally{
        APOD.src = pictureUrl;
        APOD.alt = "APOD";
        apodDescription.textContent = pictureDescription;
        imageName.textContent = pictureName; 
    }
}

//handler function for setting the date for APOD
async function setDate(e, date, APOD, apodDescription, imageName){
    if(e) e.target.disabled = true;
    try{
    await get_APOD(APOD, apodDescription, imageName, date.value);
    }
    catch(error)
    {
        window.alert("Could not get Astronomy picture of the day");
        console.error(error.message);
    }
    finally{
        if (e) e.target.disabled = false;
    }
}

//call function for getting hazard asteroids
async function hazardAsteroids(startdate, enddate){
    const parameters = new URLSearchParams();
    if(startdate) parameters.append("start_date", startdate);
    if(enddate) parameters.append("end_date", enddate);
    let url = `http://127.0.0.1:8000/v1/hazard?${parameters}`;
    try
    {
    let response = await fetch(url);
    response = await handleResponse(response);
    populateAsteroidList(response.near_earth_objects);
    }
    catch(error){
        console.error(error.message);
        throw error;
    }
}

//handler function for setting date for hazard asteroids
async function hazardAsteroidSetDate(e, start_date, end_date){
    e.target.disabled = true;
    try{
        console.log(start_date, end_date);
        await hazardAsteroids(start_date, end_date);
    }
    catch(error){
        window.alert("Could not get hazardous asteroids");
        console.error(error.message);
    }
    finally{
        e.target.disabled = false;
    }
}

//populates the list from hazardasteroids
function populateAsteroidList(near_earth_objects){
    const hazardAsteriodList = document.getElementById("hazardAsteroidList");
    Object.entries(near_earth_objects).forEach(([date, asteroids])=>{ //deconstruct near_earth_earth objects
        const datelist = document.createElement("ul");//to [[date1, asteroid1[] ],...[daten, asteroidn[] ]]
        let newdate = document.createElement("li");//then for the asteroids another
        newdate.textContent = date;//for each because it is an array of objects
        newdate.appendChild(datelist);
        hazardAsteriodList.appendChild(newdate);
        console.log("Asteroid Array: ",asteroids);
        asteroids.forEach((asteroid)=>{
            if(asteroid.is_potentially_hazardous_asteroid)
            {
                let newChild = document.createElement("li");
                console.log(asteroid.name);
                newChild.textContent = `Name:${asteroid.name}`;
                datelist.appendChild(newChild)
            }
        });
    });
}

//main function
async function main(){
    const APOD = document.getElementById("APOD");
    const apodDescription = document.getElementById("apodDescription");
    const imageName = document.getElementById("imageName");
    const date = document.getElementById('changeDate');
    const changeDateButton = document.getElementById("changeDateButton");
    const hazardAsteroidButton = document.getElementById("hazardAsteroidButton");
    const hazardStartDateInput = document.getElementById("hazardStartDateInput");
    const hazardEndDateInput = document.getElementById("hazardEndDateInput");
    //try maybe refactoring parameters as objects in future projects?
    try{
        await get_APOD(APOD, apodDescription, imageName);
    }
    catch(error){
        window.alert("Could not connect to browser");
    }
    changeDateButton.addEventListener('click',async(e)=> await setDate(e, date, APOD, apodDescription, imageName));
    hazardAsteroidButton.addEventListener('click', async(e) => hazardAsteroidSetDate(e, hazardStartDateInput.value, hazardEndDateInput.value));
}

//helper function
async function handleResponse(response){
    if (!response.ok){
        const error = await response.json();
        throw new Error(error.detail || "Something went wrong");
    }
    return response.json();
}

main()