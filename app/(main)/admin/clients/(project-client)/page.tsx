import LottieRobot from "@/components/lotties/lottie-robot";
import { PageParams } from "@/types/next";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients",
};

export default function ClientPage(props: PageParams) {
  return (
    <div className="flex flex-col items-center justify-center p-20">
      {/* <LottieRobot /> */}
      <p className="text-2xl">😏</p>
      <h2 className="text-sm">Select a client to view projects</h2>
    </div>
  );
}
