import { PortalShell } from "@/components/shell/PortalShell"

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PortalShell portalRole="business">{children}</PortalShell>
}
