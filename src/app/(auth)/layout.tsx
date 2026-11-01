import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "SkillShelf",
    template: "%s | SkillShelf",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}
