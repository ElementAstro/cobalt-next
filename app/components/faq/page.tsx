import { Faq } from "@/components/faq";
import { Dependencies } from "@/components/dependencies";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        FAQ and Project Dependencies
      </h1>
      <div className="space-y-12">
        <Faq />
        <Dependencies />
      </div>
    </div>
  );
}
