const payBtn = document.querySelector(".btn-buy");

payBtn.addEventListener("click", () => {
  fetch("/stripe-checkout-session", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      items: JSON.parse(localStorage.getItem("cartItems")),
    }),
  })
    .then((res) => res.json())
    .then((url) => {
      location.href = url;
    })
    .catch((err) => console.log(err));
    
});
