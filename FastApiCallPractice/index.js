function ageChecker(age){
    return new Promise((resolve, reject) =>{
        if (age>18){
            resolve("LEZGOOO")
        }
        else{
            reject("I aint epstein boy");
        }
    });
}

async function main(){
    try{
        let message = await ageChecker(56);
        console.log(message);
    }
    catch(error){
        console.log(error);
    }
}

main();