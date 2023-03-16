document.addEventListener("DOMContentLoaded", function (event) {
    ///////// REFERENCE //////////
    /*
    
    const refnoInput = document.querySelector('#refno');
    refnoInput.addEventListener('keyup', function () {
        // your code here
    });

    const submitBtn = document.querySelector('#submit');
    submitBtn.addEventListener('click', function () {
        // your code here
    });

    const cardsDiv = document.querySelector('#cards');
    cardsDiv.addEventListener('click', function (e) {
        if (e.target instanceof Element && e.target.matches('.remove')) {
            // your code here
        }
    }, true);*/

    //var profileClick = document.getElementsById('profile');
    document.querySelectorAll('a#page').forEach(link => {
        link.addEventListener('click', (e) => {
            let targetPage = e.target.textContent;
            console.log(targetPage);
        });
    });

    const addButton = document.querySelector('#addButton');
    const addhtml = "<input class='addIngredientInput' type='text' id='inputIngredient' placeholder='Name'name='recipe_name'><input class='addIngredientInput' type='number' id='inputAmount' placeholder='Amount'name='recipe_name'>";
    addButton.addEventListener('click', function () {
        console.log("test");
        $("#addIngredientContainer").append(addhtml);
    })
});