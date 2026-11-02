type SubscriptionStatusType =
  | "confirmed"
  | "invalid"
  | "error";

type SubscriptionStatusProps = {
  status?: string;
};

const messages: Record<
  SubscriptionStatusType,
  { title: string; description: string }
> = {
  confirmed: {
    title: "You're subscribed! 🚀",
    description:
      "Your email has been confirmed. You'll receive updates whenever Chai Coffee Lit publishes a new blog post.",
  },
  invalid: {
    title: "Confirmation link invalid",
    description:
      "This confirmation link is invalid, expired, or has already been used.",
  },
  error: {
    title: "Something went wrong",
    description:
      "We couldn't confirm your subscription. Please try again later.",
  },
};

export default function SubscriptionStatus({
  status,
}: SubscriptionStatusProps) {
  if (!status || !(status in messages)) {
    return null;
  }

  const { title, description } =
    messages[status as SubscriptionStatusType];

  return (
    <div
      role={status === "error" ? "alert" : "status"}
      className="mb-8 border border-[#333333]/20 p-4 text-[#333333]"
    >
      <h2 className="mb-2 text-lg font-medium">
        {title}
      </h2>

      <p className="text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
