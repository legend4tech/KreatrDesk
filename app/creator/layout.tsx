import { PortalShell } from "@/components/shell/PortalShell"

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PortalShell portalRole="creator">{children}</PortalShell>
}
