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
    const addhtml = "<input class='addIngredientInput' type='text' id='inputIngredient' placeholder='Name'name='ingredients'><input class='addIngredientInput' type='number' id='inputAmount' placeholder='Amount'name='amounts'>";
    addButton.addEventListener('click', function () {
        console.log("test");
        $("#1").append(addhtml);
    })

    //x button
    const xButton = document.querySelector('.close');
    xButton.addEventListener('click', function(){
        console.log("test");
        window.location.href = "http://localhost:3000/home";
    });

    //edit button
    const editButton = document.querySelector('#edit-btn');
    editButton.addEventListener('click', function(){

        console.log("test");
        window.location.href = '/editProfile';
    });

    //delete recipe
    const deleteButton = document.querySelector('#delete-btn');
    deleteButton.addEventListener('click', function () {

        var recipeid = $("#recipeid").text();
       window.location.href = '/deleteRecipe?id='+ recipeid;
    });
});