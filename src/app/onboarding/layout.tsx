import { Logo } from "@/components/ui/Logo";

// Onboarding runs on its own dark full-screen canvas (README "Onboarding").
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink-deep">
      <div className="mx-auto flex min-h-screen max-w-[1100px] flex-col px-5 py-6 md:px-8">
        <div className="mb-2">
          <Logo variant="wordmark-light" width={168} priority />
        </div>
        {children}
      </div>
    </div>
  );
}
