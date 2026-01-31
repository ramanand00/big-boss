import { logout } from "../utils/auth";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-4">Welcome 🎉</h1>
      <button onClick={logout} className="btn-primary">Logout</button>
    </div>
  );
}
