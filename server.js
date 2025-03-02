const express = require("express");
const jsonServer = require('json-server');
const Stripe = require("stripe");
const cors = require('cors');

const app = express();
const stripe = Stripe("sk_test_tR3PYbcVNZZ796tH88S4VQ2u");

app.use(cors());
app.use(express.json());

// Define your custom route BEFORE json-server router
app.post("/get-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating payment intent:", err.stack);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

// json-server middleware and router
const middlewares = jsonServer.defaults();
app.use(middlewares);
app.use(jsonServer.router("db.json"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});