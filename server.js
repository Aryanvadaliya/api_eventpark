const express = require("express");
const jsonServer = require("json-server");
const Stripe = require("stripe");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const stripe = Stripe("sk_test_tR3PYbcVNZZ796tH88S4VQ2u");

const app = express();

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

server.use(middlewares);
server.use(router);
server.listen(process.env.PORT || 5000, () => {
  console.log("JSON Server is running");
});
