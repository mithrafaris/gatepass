import React, { useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function Return() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    PassNumber: "",
    customerName: "",
    ReturnDate: "",
    material: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/user/return-material", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Material returned successfully!", { position: "top-right" });
        setFormData({ PassNumber: "", customerName: "", ReturnDate: "", material: "" });
      } else {
        toast.warn(data.message || "Failed to return material", { position: "top-right" });
      }
    } catch (error) {
      toast.error("Error returning material!", { position: "top-right" });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-8">
              Return Material
            </h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Pass Number
                    </label>
                    <input
                      type="text"
                      name="PassNumber"
                      value={formData.PassNumber}
                      onChange={handleChange}
                      className="form-input w-full border-gray-300 rounded-md text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      className="form-input w-full border-gray-300 rounded-md text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Return Date
                    </label>
                    <input
                      type="date"
                      name="ReturnDate"
                      value={formData.ReturnDate}
                      onChange={handleChange}
                      className="form-input w-full border-gray-300 rounded-md text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Material
                    </label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      className="form-input w-full border-gray-300 rounded-md text-black"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="btn bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Return;
