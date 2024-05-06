import { ReactNode } from "react";
import HeaderPages from "@/layout/header/headerPages";
import FooterPages from "@/layout/footer/footerPages";
import ScrollTop from "@/components/pages/scroll-top";

export default async function RouteLayout(props: { children: ReactNode }) {
  return (
    <main className="w-full overflow-hidden">
      {/* header */}
      <HeaderPages />

      {props.children}

      {/* Footer */}
      <FooterPages />

      {/* ScrollTo button */}
      <ScrollTop />
    </main>
  );
}
