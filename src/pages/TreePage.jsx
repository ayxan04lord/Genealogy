import Header from "../components/Header";
import GenealogyTree from "../tree/GenealogyTree";

export default function TreePage() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Header />
      <GenealogyTree />
    </div>
  );
}