import { FileSystem } from "./FileSystem";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <FileSystem initialPath="/" />
    </main>
  );
}
