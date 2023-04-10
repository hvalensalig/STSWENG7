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

    //add ingredients button
    try {
        const addButton = document.querySelector('#addButton');
        const addhtml = "<input class='addIngredientInput' type='text' id='inputIngredient' placeholder='Name'name='ingredients'><input class='addIngredientInput' type='number' id='inputAmount' placeholder='Amount'name='amounts'>";
        addButton.addEventListener('click', function () {
            console.log("test");
            $("#1").append(addhtml);
        })

    } catch (error) {
        console.log(error);
    }

    //x button
    try {
        const xButton = document.querySelector('.close');
        xButton.addEventListener('click', function () {
            console.log("test");
            window.location.href = "http://localhost:3000/home";
        });

    } catch (error) {
        console.log(error);
    }

    //edit button
    try {
        const editButton = document.querySelector('#edit-btn');
        editButton.addEventListener('click', function () {

            console.log("test");
            window.location.href = '/editProfile';
        });
    } catch (error) {
        console.log(error);
    }


    //delete recipe
    //let deleteBtn = document.getElementById('#delete-btn');
    try {
        const deleteButton = document.querySelector('.deleteButton');
        deleteButton.addEventListener('click', function () {

            var recipeid = $("#recipeid").text();
            console.log("hello",recipeid);
            window.location.href = '/deleteRecipe?id='+ recipeid;
        });
    } catch (error) {
        console.log(error);
    }

});