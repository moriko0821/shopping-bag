import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "カートが空です" }, { status: 400 });
    }

    const line_items = await Promise.all(
      items.map(async (item) => {
        const quantity = Number.parseInt(item.quantity, 10);
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
          throw new Error(`Invalid quantity for product ${item.id}`);
        }

        // サーバー側で正規の商品データを取得
        const url = `https://dummyjson.com/products/${item.id}`;

        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
          throw new Error(
            `Product ${item.id} not found (status: ${res.status})`,
          );
        }
        const product = await res.json();

        if (typeof product.price !== "number") {
          throw new Error(
            `Invalid price for product ${item.id}: ${product.price}`,
          );
        }

        if (quantity > product.stock) {
          throw new Error(
            `Insufficient stock for ${product.title} (requested: ${quantity}, available: ${product.stock})`,
          );
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
              images: product.thumbnail ? [product.thumbnail] : [],
              metadata: {
                product_id: String(product.id),
              },
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity,
        };
      }),
    );

    // Checkout Session 作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      // メールアドレスを必ず収集 (ゲスト購入対応)
      customer_creation: "always",
      // 配送先住所を収集
      shipping_address_collection: {
        allowed_countries: ["JP", "US"],
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[Stripe Checkout Error]", error);
    return NextResponse.json(
      { error: error.message || "決済セッションの作成に失敗しました" },
      { status: 500 },
    );
  }
}
