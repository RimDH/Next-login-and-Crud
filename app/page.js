"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async e => {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else setError(data.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500">
      <form onSubmit={submit} className="bg-white p-10 rounded-xl shadow-lg w-96 space-y-6">
        <h1 className="text-2xl font-bold text-center mb-4">Admin Login</h1>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="w-full p-3 border rounded" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-3 border rounded" required />
        <button className="w-full bg-indigo-600 text-white py-3 rounded font-semibold hover:bg-indigo-700 transition">Login</button>
      </form>
    </div>
  );
}
