import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const login = async () => {
    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser(form);

      console.log("Login response:", res);

      const token =
        res.access_token ||
        res.token ||
        res?.data?.access_token;

      if (token) {
        localStorage.setItem("token", token);

        alert("Login successful");

        navigate("/dashboard");
      } else {
        alert(
          res.detail ||
            res.message ||
            "Login failed"
        );
      }
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl mb-4 font-bold">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
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
          onClick={login}
          disabled={loading}
          className="bg-green-600 text-white w-full py-2 rounded"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </div>
    </div>
  );
}