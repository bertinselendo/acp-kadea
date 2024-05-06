"use client";

import { ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function ScrollTop() {
  const [cursor, setCursor] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const scrollPosition = isDesktop ? 1500 : 500;

  useEffect(() => {
    window.onscroll = () => {
      setCursor(window.scrollY);
    };
  }, []);

  return (
    <Button
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      className="fixed right-2 top-[85dvh] z-[999] rounded-full border-0 bg-foreground text-white drop-shadow-md transition-all hover:bg-foreground/80"
      size="icon"
      style={cursor < scrollPosition ? { opacity: 0 } : { opacity: 1 }}
    >
      <ChevronUp />
    </Button>
  );
}
