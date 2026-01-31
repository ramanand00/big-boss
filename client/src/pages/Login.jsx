import axios from "axios";

export default function Login() {
  const submit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));

    const res = await axios.post("/api/auth/login", data);
    localStorage.setItem("token", res.data.token);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={submit} className="bg-slate-800 p-6 rounded-lg w-96">
        <h2 className="text-white text-2xl mb-4">Login</h2>

        <input name="email" placeholder="Email" className="input" />
        <input name="password" type="password" placeholder="Password" className="input" />

        <button className="btn-primary">Login</button>

        <p className="text-sm text-gray-400 mt-3">
          No account? <a href="/signup" className="text-blue-400">Sign up</a>
        </p>
      </form>
    </div>
  );
}
