

// filter between years on the gallery page

const filterButtons = document.querySelectorAll(".filterable_buttons button");
const filterableCards = document.querySelectorAll(".filterable_cards .card");
//define the filterCards function
const filterCards = e => {
    document.querySelector(".active").classList.remove("active");
    e.target.classList.add("active");


    //Iterate over each filterable card
    filterableCards.forEach(card => {
        //add "hide" class to hide the card initially
        card.classList.add("hide");
        //check if the card matches the selected filter or "all" is selected
        if (card.dataset.name === e.target.dataset.name || e.target.dataset.name === "all") {
            card.classList.remove("hide");
        }
    });

};
//add click event listener to each filter button
filterButtons.forEach(button => button.addEventListener("click", filterCards));