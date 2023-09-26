import {menuArray, cartArray}
 from './data.js'

const menuSection = document.getElementById("menu-section") 
const orderSummary = document.getElementById("order-summary")
const userInfoForm = document.getElementById("user-info")
const popUpCardModal = document.getElementById("pop-up-form-container")
const loadingModal = document.getElementById("loading-container")
const userCart = document.getElementById("order-summary")

function renderMenu(){
    let menuHtml = ``
    menuArray.forEach(menuItem => {
        menuHtml += `
            <div class="menu-item">
                <img class= "menu-image" src="images/${menuItem.image}">
                <div class="menu-info">
                    <h2>${menuItem.name}</h2>
                    <h3>${menuItem.ingredients.join(', ')}</h2>
                </div>
                <i data-add="${menuItem.id}" class="fa-solid fa-circle-plus menu-button"></i>
            </div>
        `
    })
    menuSection.innerHTML = menuHtml
}

renderMenu()

document.addEventListener('click', (e) => {
    if(e.target.dataset.add){
        addToCart(e.target.dataset.add)
    }
    else if(e.target.dataset.remove){
        removeFromCart(e.target.dataset.remove)
    }
    else if(e.target.id === "complete-order"){
        popUpCardModal.style.display = 'block'
        orderSummary.style.opacity = "70%"
        menuSection.style.opacity = "70%"
    }
    else if(e.target.id === "form-submit-btn"){
        e.preventDefault()
        const nameInput = document.getElementById("user-name").value
        
        processCardInfo(nameInput)
    }
})

function addToCart(menuId){
    
    orderSummary.style.display = "block"

    //convert the string type of menuId to an int so that === works
    const menuIdVal = parseInt(menuId)

    //check that selected item is in menu array
    let addedMenuItem = menuArray.filter(function(menuItem){
        return (menuItem.id === menuIdVal)
    })[0]

    //check if item is already in cart
    const duplicateItem = cartArray.find(cartItem =>{
        return cartItem.id === addedMenuItem.id
    })

    if(duplicateItem){
        addedMenuItem.quantity++
        
    }
    else{
        addedMenuItem.quantity = 1
        cartArray.unshift(addedMenuItem);
        console.log("Added to cart:", addedMenuItem.name);
        console.log("amount in cart: "+addedMenuItem.quantity)
    }

    if(cartArray.length != 0){
        renderCart()
    }
    
}

function removeFromCart(itemId){
    const orderSummary = document.getElementById("order-summary")
    const removeditemId = parseInt(itemId)
    console.log("removing "+removeditemId+" item from cart")

    cartArray.forEach(cartItem => {
        if(cartItem.id === removeditemId){
            if(cartItem.quantity === 1){
                cartArray.pop(cartItem)
            }
            else{
                cartItem.quantity--
            }
        }
    })

    if(cartArray.length != 0){
        orderSummary.style.display = "block"
        renderCart()
    }
    else{
        orderSummary.style.display = "none"
    }
    
    
}

function renderCart(){

    let totalCartPrice = 0;

    const cartItemsHtml = cartArray.map(cartItem => {
        totalCartPrice += (cartItem.price * cartItem.quantity)
        
        return `
        <div class="cart-item">
            <div class="item-name-with-btn">
                <h3>(x${cartItem.quantity})&nbsp</h3>
                <h3>${cartItem.name}</h3>
                <h4 data-remove="${cartItem.id}" id="remove-btn" class="remove-btn">remove</h4>
            </div>
            <h3>$${cartItem.price * cartItem.quantity}</h3>
        </div>
        `
    }).join('')

    let cartHtml = 
        `<div class="order-container">
            <h2 class="order-header-title">Your Order</h2>
            <div class="order-list">
                ${cartItemsHtml}
            </div>
            <h3 class="cart-total">Total: $${totalCartPrice}</h3>
            <button id="complete-order" class="complete-order">Complete Order</button>
        </div>
        
    `
    userCart.innerHTML = cartHtml;
    
}

function processCardInfo(nameInput){
    popUpCardModal.style.display = 'none'
    loadingModal.style.display = 'block'
    console.log("processing-card-info")
    setTimeout(renderOrderProcessed, 2000, nameInput)
}



function renderOrderProcessed(nameInput){
    loadingModal.style.display = 'none'
    orderSummary.style.opacity = "100%"
    menuSection.style.opacity = "100%"
    userCart.innerHTML = `
    <div class="order-appreciation-container">
        <h2 class="order-appreciation-tag">Thanks! Your order is on the way ${nameInput}!</h2>
    </div>`
    console.log("thanks for ordering")
}