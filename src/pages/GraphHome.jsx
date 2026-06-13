import Header from "../components/header/Header";
import FamilyGraph from "../components/graph/FamilyGraph";

export default function GraphHome({ forest, onForestChange, activeForestName, onOpenForests }) {
  return (
    <>
      <Header activeForestName={activeForestName} onOpenForests={onOpenForests} />
      <FamilyGraph forest={forest} onForestChange={onForestChange} />
    </>
  );
}
