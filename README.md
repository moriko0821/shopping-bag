# 🛍️ Shopping Bag - Next.js E-commerce with Stripe Integration

> 🌐 **Live Demo**: https://shopping-bag-xi.vercel.app
> 🧪 **Test Card**: `4242 4242 4242 4242` (any future expiry, any CVC, any postal code)

A modern e-commerce demo built with **Next.js 16** and **React 19**, featuring secure payment processing via **Stripe Checkout** and **Webhook** integration.

Next.js 16 と React 19 で構築した EC サイトのデモ。**Stripe Checkout** と **Webhook** によるセキュアな決済機能を実装しています。

---

## 🛠️ Tech Stack / 技術スタック

- **Framework**: Next.js 16.2 (App Router)
- **UI**: React 19.2, CSS Modules
- **Payment**: Stripe Checkout + Webhooks
- **State**: React Context API + localStorage
- **Data Source**: [DummyJSON](https://dummyjson.com/) (mock product API)

---

## ✨ Features / 主要機能

- 商品一覧 / カテゴリフィルタ / ページネーション
- 商品詳細ページ / カートへの追加・数量変更・削除
- カート状態の永続化（localStorage）
- **🎯 Stripe Checkout による安全な決済**
- **🎯 Stripe Webhook による決済完了の確実な検知**

---

## 💳 Stripe Implementation Details / Stripe 実装の詳細

### Architecture / 構成

```
[Cart Page]
    │ POST /api/checkout (id + quantity only)
    ▼
[Next.js API Route] ───── creates session ────▶ [Stripe API]
    │                                                │
    │ ◀──── session.url ──────────────────────────── │
    ▼
[Browser Redirect]
    │
    ▼
[Stripe Hosted Checkout Page]
    │ Payment completed
    ▼
[Webhook] ◀──── checkout.session.completed ──── [Stripe]
    │ (signature verification)
    ▼
[Order processing / Log output]
```

### Files / 関連ファイル

| File                               | Role / 役割                                                |
| ---------------------------------- | ---------------------------------------------------------- |
| `app/api/checkout/route.js`        | Creates Stripe Checkout Session / 決済セッション作成       |
| `app/api/webhooks/stripe/route.js` | Receives & verifies webhook events / Webhook受信・署名検証 |
| `app/basket/BasketItems.js`        | "Proceed to Checkout" button / チェックアウトボタン        |
| `app/checkout/success/page.js`     | Post-payment confirmation page / 決済完了ページ            |
| `app/checkout/cancel/page.js`      | Payment cancellation page / キャンセルページ               |

### Security Features / セキュリティ対策

#### 🔐 1. Server-side Price Validation / サーバー側での価格検証

**Issue**: A naive implementation would trust prices sent from the client, allowing attackers to alter prices via DevTools (e.g., buying a $1099 item for $0.01).

**Solution**: The client only sends **product IDs and quantities**. The server fetches the official price from the source API before creating the Stripe session.

```js
// ⚠️ Don't trust client-sent prices
const product = await fetch(`https://dummyjson.com/products/${item.id}`);
unit_amount: Math.round(product.price * 100),  // Use server-fetched price
```

**問題**: クライアントから送られてきた価格をそのまま使うと、ブラウザの DevTools で価格を改ざんして $1099 の商品を $0.01 で購入する攻撃が可能になる。

**対策**: クライアントからは **商品IDと数量のみ** を送信し、サーバー側で正規の価格を取得し直してから Stripe にセッション作成を依頼する。

#### 🔐 2. Webhook Signature Verification / Webhook 署名検証

**Issue**: Without verification, attackers could send fake `checkout.session.completed` events to trigger fraudulent order processing.

**Solution**: Use `stripe.webhooks.constructEvent()` with the raw request body (`request.text()`, NOT `request.json()`) and the webhook signing secret.

```js
const body = await request.text(); // ⚠️ MUST be raw body
const signature = request.headers.get("stripe-signature");
event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
```

**問題**: 署名検証なしだと、攻撃者が偽の `checkout.session.completed` イベントを送り、不正な注文処理を発火できてしまう。

**対策**: Stripe SDK の `constructEvent()` で署名検証を行う。リクエストボディは `request.text()` で生のまま取得する必要がある（`request.json()` だとパース→再シリアライズ時にバイト列が変化し、検証に失敗する）。

#### 🔐 3. Stock Validation / 在庫チェック

The server validates stock availability before creating a Stripe session, preventing checkout for out-of-stock items.

決済セッション作成前に在庫を検証し、在庫切れ商品の購入を防止。

#### 🔐 4. Quantity Validation / 数量バリデーション

Quantity is validated as an integer between 1 and 100, blocking edge cases like negative numbers or floats.

数量が 1〜100 の整数であることを検証し、負数・小数・異常値を弾く。

### Reliability Features / 信頼性対策

- **Always returns 2xx**: Stripe retries failed webhook deliveries for up to 3 days. The handler always returns a 2xx response to avoid duplicate processing.
- **`useRef` for one-time effects**: The success page uses `useRef` (not `useState`) to track whether the cart has been cleared, avoiding unnecessary re-renders flagged by React 19.
- **Wait for cart hydration**: The cart-clearing effect waits for `items.length > 0` before running, since `BasketContext` loads from localStorage asynchronously.

- **必ず 2xx を返す**: Stripe は応答が 2xx でないと最大3日間リトライし続けるため、確実に 2xx を返してイベント受信完了を伝える。
- **`useRef` で1回だけ実行**: 決済完了ページではカートクリアのフラグを `useState` ではなく `useRef` で管理し、不要な再レンダリングを回避（React 19 で警告される）。
- **localStorage の読み込み完了を待つ**: `BasketContext` が localStorage から非同期にカートを復元するため、`items.length > 0` を `useEffect` の発火条件にしている。

---

## 🚀 Setup / セットアップ手順

### 1. Install dependencies / 依存関係のインストール

```bash
pnpm install
```

### 2. Configure environment variables / 環境変数の設定

Copy the template and fill in your Stripe credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=whsec_...
```

Get test keys from the [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).
The `STRIPE_WEBHOOK_SECRET` is obtained in Step 4 below.

Stripe ダッシュボードからテストキーを取得してください。`STRIPE_WEBHOOK_SECRET` は手順4で取得します。

### 3. Run the dev server / 開発サーバー起動

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Set up Stripe CLI for webhook testing / Webhook 動作確認用 Stripe CLI 設定

In a **separate terminal**, install [Stripe CLI](https://docs.stripe.com/stripe-cli) and run:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI prints a `whsec_...` value. Copy it into `STRIPE_WEBHOOK_SECRET` in `.env.local` and **restart the dev server**.

別ターミナルで Stripe CLI を起動すると `whsec_...` という署名シークレットが表示されるので、それを `.env.local` の `STRIPE_WEBHOOK_SECRET` に設定し、dev サーバーを再起動してください。

---

## 🧪 Testing / 動作確認

Use Stripe's test card on the checkout page:

| Field       | Value                          |
| ----------- | ------------------------------ |
| Card number | `4242 4242 4242 4242`          |
| Expiry      | Any future date (e.g. `12/34`) |
| CVC         | Any 3 digits (e.g. `123`)      |
| Postal      | Any 5 digits                   |

After successful payment, the webhook handler logs the order details to the dev server console:

```
========== 🎉 ORDER COMPLETED ==========
Session ID:     cs_test_xxxxxxxxxxxx
Customer Email: customer@example.com
Customer Name:  Taro Yamada
Amount Total:   10.44 USD
Payment Status: paid
=========================================
```

---

## 📚 Key Learnings / 実装で得た学び

- **Never trust the client**: Always re-fetch authoritative data (prices, stock) on the server before creating payment sessions.
- **Raw request body matters**: Stripe's signature verification depends on byte-level body integrity, so `JSON.parse` breaks it.
- **React 19's stricter rules**: Reading `ref.current` during render is now flagged; one-time-execution flags belong in `useRef` (no re-render) rather than `useState`.
- **Async hydration is tricky**: Effects depending on data loaded from localStorage must wait until that data is actually present before acting.

- **クライアントを信用しない**: 価格・在庫などの重要データはサーバー側で再取得してから決済処理を行う。
- **生のリクエストボディが必要**: Stripe の署名検証はバイトレベルで行われるため、`JSON.parse` してしまうと検証に失敗する。
- **React 19 の厳格化**: レンダリング中の `ref.current` 読み取りは警告対象。「1回だけ実行」のフラグは再レンダリングを起こさない `useRef` を使う。
- **非同期ハイドレーションの罠**: localStorage からの復元が非同期で行われるため、依存する Effect は実データの到着を待つ必要がある。

---

## 📦 Project Structure / ディレクトリ構成

```
shopping-bag/
├── app/
│   ├── api/
│   │   ├── checkout/route.js         # Stripe Checkout Session API
│   │   └── webhooks/stripe/route.js  # Stripe Webhook handler
│   ├── basket/                       # Cart page
│   ├── checkout/
│   │   ├── success/                  # Post-payment confirmation
│   │   └── cancel/                   # Payment cancellation
│   ├── components/                   # Shared UI components
│   ├── context/BasketContext.js      # Cart state management
│   ├── homepage/
│   ├── product/[id]/
│   └── products/[[...slug]]/
├── public/
├── .env.example                      # Environment variable template
├── next.config.mjs
└── package.json
```

---

## 📄 License

MIT
