import Header from "../components/Header";

export default function Home() {
  return (
    <div className="h-screen bg-gray-100">
      <Header />
      <main className="flex flex-col items-center justify-center h-full">
        <h2 className="text-3xl font-semibold mb-4">Добро пожаловать в Родословную платформу</h2>
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          Перейти к дереву
        </button>
      </main>
    </div>
  );
}
