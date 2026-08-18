import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  as: Tag = "div",
  interactive,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  interactive?: boolean;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={cn(
        "rounded-card border border-border-strong bg-surface p-[18px] shadow-card md:p-6",
        // README hover: elevación de sombra sin desplazamiento.
        interactive &&
          "cursor-pointer transition-shadow duration-200 ease-out hover:shadow-card-hover",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow mb-2">{children}</p>;
}
