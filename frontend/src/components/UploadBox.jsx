import { useState } from "react";
import { uploadPdf } from "../services/api";
import { getToken } from "../services/auth";

export default function UploadBox() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    try {
      setUploading(true);

      const res = await uploadPdf(
        file,
        getToken()
      );

      console.log("Upload response:", res);

      if (res?.detail) {
        alert(res.detail);
      } else {
        alert("PDF uploaded successfully");
      }

      setFile(null);
    } catch (error) {
      console.error("Upload Error:", error);

      alert(
        "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#f7f7fb] rounded-3xl shadow-sm p-10 flex flex-col items-center justify-center mb-6">
      <h2 className="text-4xl font-bold text-gray-800 mb-3">
        Upload your PDF
      </h2>

      <p className="text-gray-500 mb-8">
        Ask questions from your document instantly
      </p>

      <label className="cursor-pointer">
        <div className="bg-orange-500 hover:bg-orange-600 transition text-white px-16 py-6 rounded-2xl text-xl font-semibold shadow-lg">
          Select PDF file
        </div>

        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />
      </label>

      {file && (
        <p className="mt-5 text-gray-700 font-medium">
          Selected: {file.name}
        </p>
      )}

      {file && (
        <button
          onClick={uploadFile}
          disabled={uploading}
          className="mt-6 bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
        >
          {uploading
            ? "Uploading..."
            : "Upload"}
        </button>
      )}
    </div>
  );
}