import axios from "axios";

export default function Signup() {
  const submit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    await axios.post("/api/auth/signup", data);
    window.location.href = "/verify-otp?email=" + data.email;
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-900">
      <form onSubmit={submit} className="bg-slate-800 p-6 rounded-lg w-96">
        <h2 className="text-white text-2xl mb-4">Sign Up</h2>

        <input name="name" placeholder="Full Name" className="input" />
        <input name="email" placeholder="Email" className="input" />
        <input name="contact" placeholder="Contact" className="input" />
        <input name="password" type="password" placeholder="Password" className="input" />

        <button className="btn-primary">Send OTP</button>
      </form>
    </div>
  );
}
