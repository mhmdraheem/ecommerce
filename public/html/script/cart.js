async function decreaseItemCount(product) {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
}


function decreaseCartItem(item) {
  const existingItem = cart.find((cartItem) => cartItem.id === item);
  if (existingItem) {
    existingItem.quantity--;
    if (existingItem.quantity <= 0) {
      const idx = cart.findIndex((cartItem) => cartItem.id === item);
      cart.splice(idx, 1);

      if (cart.length === 0) {
        hideHeaderCartAlert();
      }

      return 0;
    } else {
      return existingItem.quantity;
    }
  } else {
    return 0;
  }
}

// function removeCartItem(item) {
//   const idx = cart.indexOf(item);
//   cart.splice(idx, 1);

//   if (cart.length === 0) {
//     hideHeaderCartAlert();
//   }
// }

function showHeaderCartAlert() {
  document.querySelector(".cart .alert").classList.add("visible");
}

function hideHeaderCartAlert() {
  document.querySelector(".cart .alert").classList.remove("visible");
}
