import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("[Webhook] Missing stripe-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("[Webhook] Signature verification failed:", error.message);
    return NextResponse.json(
      { error: `Webhook signature verification failed` },
      { status: 400 },
    );
  }

  // イベントタイプごとに処理を分岐
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      console.log("\n========== 🎉 ORDER COMPLETED ==========");
      console.log("Session ID:    ", session.id);
      console.log("Customer Email:", session.customer_details?.email);
      console.log("Customer Name: ", session.customer_details?.name);
      console.log(
        "Amount Total:  ",
        `${(session.amount_total / 100).toFixed(2)} ${session.currency.toUpperCase()}`,
      );
      console.log("Payment Status:", session.payment_status);
      console.log("=========================================\n");

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      console.log("[Webhook] Payment failed:", paymentIntent.id);
      // 失敗時の処理 (例: 失敗理由を記録、ユーザーに通知)
      break;
    }

    default:
      // 未対応のイベントタイプ
      console.log(`[Webhook] Unhandled event type: ${event.type}`);
  }

  // ⚠️ Stripe は 2xx 応答が無いと、最大3日間リトライし続けるため、
  // 必ず 200 を返してイベント受信完了を伝える
  return NextResponse.json({ received: true });
}
