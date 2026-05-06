//DOM elements

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const favouritesList = document.getElementById("favourites-list");


//Get favourites from local storage

let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

// Form submit

form.addEventListener("submit", (e) => {
    e.preventDefault();
const word = input.value.trim();

if (word) {
    fetchWord(word)
}
})
//Fetch word from the Dictionnary 

async function fetchWord(word) {

    results.innerHTML = `<p>Loading...</P>`;
    try{
        const response = await fetch (`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        if(!response.ok) throw new Error("Word not found");
        const data = await response.json();

        const definition = data?.[0].meanings?.[0].definitions?.[0].definition || "No definition found";
        const audio = data[0].phonetics?.find(p => p.audio)?.audio || "";

        results.innerHTML = `
        <h2>${word}</h2>
        <p>${definition}</p>
        ${audio ? `<button id="play-audio">Play</button>` :""}
         <button id = "save-button">Save</button>`;

// Audio
if (audio) {document
    .getElementById("play-audio")
    .addEventListener("click", () =>{
            new Audio(audio).play();
});
}

//Save button
document.getElementById("save-button").addEventListener("click",() => {
    const exists = favourites.some(item => item.word === word);

    if(!exists) {
        favourites.push({word, definition});
        localStorage.setItem("favourites", JSON.stringify(favourites));
        displayFavourites();
    }
    });

}catch (error) {
        results.innerHTML=`<p style= "color:red;">${error.message}</p>`;
      console.error(error);
    }
}

//Initial display of favourites 

function displayFavourites() {
    favouritesList.innerHTML = "";
    favourites.forEach((item, index) => {
        const li = document.createElement("li");

        li.innerHTML=
        `<strong>${item.word}</strong>: ${item.definition}
        <button class = "delete-button">Delete</button>
        `;

        li.querySelector(".delete-button").addEventListener("click", () => {
            deleteFavourite(index);
        });
         favouritesList.appendChild(li);
    });}

        //Delete button

      function deleteFavourite(index) {
                favourites.splice(index, 1);
                localStorage.setItem("favourites", JSON.stringify(favourites));
                displayFavourites();
            }

            //Initial Load
            displayFavourites()