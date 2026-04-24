import { ErrorBoundary } from "../../components/ErrorBoundary";
import Products from "./Products";

export default async function page({ params }) {
  const { slug } = await params;
  const category = slug?.[0] || null;

  return (
    <div className="product-page">
      <div className="page-header">
        <h1>Products Page</h1>
      </div>
      <ErrorBoundary fallback="Could nout load products, please refresh the page.">
        <Products category={category} />
      </ErrorBoundary>
    </div>
  );
}
