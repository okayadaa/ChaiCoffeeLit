import UnsubscribeForm from "./unsubscribeForm";

type PageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function UnsubscribePage({
  searchParams,
}: PageProps) {
  const { token } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f3f3f5] px-6 py-20 text-[#333333]">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-medium">
          Unsubscribe from Chai Coffee Lit ☕️
        </h1>

        <p className="mb-6 leading-relaxed">
          We're sorry to see you go. You can stop
          receiving blog notifications at any time.
        </p>

        {typeof token === "string" ? (
          <UnsubscribeForm token={token} />
        ) : (
          <p role="alert">
            This unsubscribe link is invalid.
          </p>
        )}
      </div>
    </main>
  );
}
