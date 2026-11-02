import ConfirmSubscriptionForm from "./confirmSubscriptionForm";
import Link from "next/link";

type PageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ConfirmSubscriptionPage({
  searchParams,
}: PageProps) {
  const { token } = await searchParams;

  const validTokenFormat =
    typeof token === "string" &&
    /^[a-f0-9]{64}$/.test(token);

  return (
    <main className="min-h-screen bg-[#f3f3f5] px-4 py-14 text-[#333333]">
      <h1 className="mx-left mb-6 w-full max-w-2xl text-3xl font-medium">
        Confirm your subscription
      </h1>

      {validTokenFormat ? (
        <>
          <p className="text-lg leading-relaxed">
            You&apos;re one step away from receiving
            the latest stories from Chai Coffee Lit.
          </p>

          <p className="mt-4 text-lg">
            Click below to confirm your email address
            and activate your subscription.
          </p>

          <ConfirmSubscriptionForm token={token} />
        </>
      ) : (
        <div role="alert">
          <p className="text-lg">
            This confirmation link is invalid.
          </p>

          <Link
            href="/blog"
            className="mt-6 inline-block underline underline-offset-4"
          >
            Return to the blog
          </Link>
        </div>
      )}
    </main>
  );
}
