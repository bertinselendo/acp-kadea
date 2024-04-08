import { Button } from "@/components/ui/button";
import Link from "next/link";

export type NotFoundProps = {};

export default function NotFound(props: NotFoundProps) {
  return (
    <div className="p-4 w-full h-screen flex flex-col gap-2 justify-center items-center">
      <h2 className="text-5xl font-black">404</h2>
      <p className="text-xl font-semibold">This page does not exist</p>

      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
