import { PREMIUM_PRICE } from "constants/index";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const { caseId } = req.body;

    const item = {
      price_data: {
        currency: "usd",
        product_data: {
          name: "Premium Plan",
        },
        unit_amount: PREMIUM_PRICE * 100,
      },
      description:
        "Unlock the ability to ask, view, and answer unlimited questions",
      quantity: 1,
    };
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [item],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/subscription?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/subscription?status=cancel`,
    });

    return res.status(200).json({ id: session.id });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
