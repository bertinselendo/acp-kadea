import Link from "next/link";

export default function WebsiteFooter() {
  return (
    <div className="flex justify-center gap-4 transition-all *:text-sm *:opacity-75 *:hover:opacity-100">
      <Link href="/">Home</Link>
      <Link href="#">Privacy</Link>
      <Link href="#">Term</Link>
    </div>
  );
}
