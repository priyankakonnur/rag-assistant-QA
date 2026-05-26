// import { useState } from "react";
// import api from "../services/api";
// import { saveToken } from "../services/auth";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const login = async () => {
//     const res = await api.post("/auth/login", form);

//     saveToken(res.data.access_token);

//     navigate("/dashboard");
//   };

//   return (
//     <div className="h-screen flex justify-center items-center bg-gray-100">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-96">
//         <h2 className="text-2xl mb-4 font-bold">Login</h2>

//         <input
//           placeholder="Email"
//           className="w-full border p-2 mb-3"
//           onChange={(e) =>
//             setForm({ ...form, email: e.target.value })
//           }
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border p-2 mb-3"
//           onChange={(e) =>
//             setForm({ ...form, password: e.target.value })
//           }
//         />

//         <button
//           onClick={login}
//           className="bg-green-600 text-white w-full py-2 rounded"
//         >
//           Login
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import api from "../services/api";
import {
  saveToken,
  saveUser,
} from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const login = async () => {
    try {
      const res = await api.post(
        "/auth/login",
        form
      );

      saveToken(res.data.access_token);

      // IMPORTANT
      saveUser({
        email: form.email,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl mb-4 font-bold">
          Login
        </h2>

        <input
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
          onClick={login}
          className="bg-green-600 text-white w-full py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}