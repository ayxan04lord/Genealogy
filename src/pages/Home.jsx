import Header from "../components/header/Header";
import TreePage from "../components/tree/Tree";

export default function Home({ treeData, onTreeChange, marriages, onMarriagesChange, activeForestName, onOpenForests }) {
  return (
    <>
      <Header activeForestName={activeForestName} onOpenForests={onOpenForests} />
      <TreePage
        treeData={treeData}
        onTreeChange={onTreeChange}
        marriages={marriages}
        onMarriagesChange={onMarriagesChange}
      />
    </>
  );
}
