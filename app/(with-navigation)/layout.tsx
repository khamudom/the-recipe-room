import { Navigation } from "@/components/layout/navigation/navigation";

export default function WithNavigationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
