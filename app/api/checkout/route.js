import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { items } = await request.json();

    // ★ デバッグ ① クライアントから何が送られてきたか
    console.log("[DEBUG 1] Received items:", JSON.stringify(items, null, 2));

    // バリデーション: カートが空ならエラー
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "カートが空です" }, { status: 400 });
    }

    // ⚠️ セキュリティ重要: クライアントから送られた価格は信用しない
    // サーバー側で各商品の正規データを取得し、Stripeに渡す
    const line_items = await Promise.all(
      items.map(async (item) => {
        // ★ デバッグ ② item の中身
        console.log("[DEBUG 2] Processing item:", item);

        // 数量のバリデーション (1〜100の整数のみ許可)
        const quantity = Number.parseInt(item.quantity, 10);
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
          throw new Error(`Invalid quantity for product ${item.id}`);
        }

        // サーバー側で正規の商品データを取得
        const url = `https://dummyjson.com/products/${item.id}`;
        console.log("[DEBUG 3] Fetching URL:", url);

        const res = await fetch(url, { cache: "no-store" });

        // ★ デバッグ ④ APIの応答状態
        console.log(
          "[DEBUG 4] Response status:",
          res.status,
          "for id:",
          item.id,
        );

        if (!res.ok) {
          throw new Error(
            `Product ${item.id} not found (status: ${res.status})`,
          );
        }
        const product = await res.json();

        // ★ デバッグ ⑤ 取得した商品データ
        console.log("[DEBUG 5] Fetched:", {
          id: product.id,
          title: product.title,
          price: product.price,
          stock: product.stock,
        });

        // 価格データの存在チェック
        if (typeof product.price !== "number") {
          throw new Error(
            `Invalid price for product ${item.id}: ${product.price}`,
          );
        }

        // 在庫チェック
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
            // ⚠️ 必ずサーバー側で取得した product.price を使う
            // Stripeは最小通貨単位 (USDならcent) で受け取るため × 100
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
