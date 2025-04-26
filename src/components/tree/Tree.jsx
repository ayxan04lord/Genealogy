import Tree from "react-d3-tree";
import { useRef, useEffect, useState } from "react";

const treeData = {
  name: "Alaş",
  children: [
    { name: "Ulu soy" },
    { name: "Orta soy" },
    { name: "Kiçik soy" },
    { name: "Soydan kənar" },
  ],
};

export default function TreePage() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef();

  useEffect(() => {
    const { offsetWidth, offsetHeight } = containerRef.current;
    setDimensions({ width: offsetWidth, height: offsetHeight });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f9fafb", // светлый фон
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {dimensions.width && dimensions.height && (
        <Tree
          data={treeData}
          orientation="horizontal"
          pathFunc="elbow"
          collapsible={true} // <- Важно: дерево сразу раскрыто
          translate={{
            x: dimensions.width / 2,
            y: dimensions.height / 2,
          }}
          styles={{
            nodes: {
              node: {
                circle: {
                  fill: "#2563EB",
                  r: 12,
                  stroke: "#1E3A8A",
                  strokeWidth: 2,
                },
                name: {
                  fontSize: "16px",
                  fill: "#1E3A8A",
                  fontWeight: "bold",
                },
              },
              leafNode: {
                circle: {
                  fill: "#3B82F6",
                  r: 10,
                  stroke: "#1E40AF",
                  strokeWidth: 2,
                },
                name: {
                  fontSize: "14px",
                  fill: "#1E40AF",
                },
              },
            },
            links: {
              stroke: "#94A3B8",
              strokeWidth: 2,
            },
          }}
        />
      )}
    </div>
  );
}
