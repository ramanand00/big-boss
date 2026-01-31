import axios from "axios";

export default function VerifyOtp() {
  const email = new URLSearchParams(window.location.search).get("email");

  const submit = async (e) => {
    e.preventDefault();
    const otp = e.target.otp.value;

    await axios.post("/api/auth/verify-otp", { email, otp });
    alert("Account verified!");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={submit} className="bg-slate-800 p-6 rounded-lg w-96">
        <h2 className="text-white text-xl mb-3">Verify OTP</h2>
        <input name="otp" placeholder="Enter OTP" className="input" />
        <button className="btn-primary">Verify</button>
      </form>
    </div>
  );
}
