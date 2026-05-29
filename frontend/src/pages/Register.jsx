import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (
      !form.username ||
      !form.email ||
      !form.password
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await registerUser(form);

      console.log("Register response:", res);

      if (res.message || res.access_token || res.user) {
        alert("Registration successful");
        navigate("/login");
      } else {
        alert(res.detail || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Something went wrong while registering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl mb-4 font-bold">
          Register
        </h2>

        <input
          placeholder="Username"
          className="w-full border p-2 mb-3"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          type="email"
          className="w-full border p-2 mb-3"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button
          type="button"
          onClick={register}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}