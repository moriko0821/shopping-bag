"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Error({ reset }) {
  const router = useRouter();
  return (
    <div className="container error-page">
      <Image alt="Error Image" width={400} height={150} src={"/error.png"} />
      <h2>Something went wrong...</h2>
      <div className="actions">
        <button className="outline" onClick={() => router.back()}>
          Go back
        </button>
        <button onClick={() => reset()}>Try Again</button>
      </div>
    </div>
  );
}
