import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";

// Load variables
dotenv.config();

//Start server
const app = express();

app.use(express.static("public"));
app.use(express.json());

 //Home route
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});
// Success
app.get("/success", (req, res) => {
  res.sendFile("success.html", { root: "public" });
});

//Cancel
app.get("/cancelpayment", (req, res) => {
 res.sendFile("cancelpayment.html", { root: "public" });
});

//Stripe setup

let stripeGateway = Stripe(process.env.stripe_api);
let DOMAIN = process.env.DOMAIN;

app.post("/stripe-checkout-session", async (req, res) => {
 const lineItems = req.body.items.map((item) => {
  const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, "") * 100);
    console.log("item-price:", item.price);
    console.log("unitAmount:", unitAmount);
   return {
      price_data: {
        currency: "ZAR",
       product_data: {
         name: item.title,
         images: [item.productImg],
       },
        unit_amount: unitAmount,
      },
      quantity: item.quantity,
    };
  });
 console.log("lineItems:", lineItems);

  //Create checkout session
  const session = await stripeGateway.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
   success_url: `${DOMAIN}/success`,
    cancel_url: `${DOMAIN}/cancelpayment`,
   line_items: lineItems,
    //Asking address in stripe checkout page
    billing_address_collection: "required",
  });
  res.json({ url: session.url });
});
app.listen(3000, () => {
 console.log("listening on port 3000;");
});

