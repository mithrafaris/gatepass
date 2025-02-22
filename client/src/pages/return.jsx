import React, { useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaPlus, FaPaperPlane } from "react-icons/fa"; // Import icons

function Return() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    PassNumber: "",
    customerName: "",
    ReturnDate: "",
    materials: [{ materialName: "", quantity: "" }],
  });

  const handleChange = (e, index = null) => {
    if (index !== null) {
      const updatedMaterials = [...formData.materials];
      updatedMaterials[index][e.target.name] = e.target.value;
      setFormData({ ...formData, materials: updatedMaterials });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addMaterialField = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, { materialName: "", quantity: "" }],
    });
  };

  const removeMaterialField = (index) => {
    const updatedMaterials = [...formData.materials];
    updatedMaterials.splice(index, 1);
    setFormData({ ...formData, materials: updatedMaterials });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.PassNumber.trim() || !formData.customerName.trim() || !formData.ReturnDate) {
      toast.warn("Please fill all required fields!", { position: "top-right" });
      return;
    }

    if (
      formData.materials.length === 0 ||
      formData.materials.some((mat) => !mat.materialName.trim() || !mat.quantity || mat.quantity <= 0)
    ) {
      toast.warn("Material name and quantity must be valid!", { position: "top-right" });
      return;
    }

    try {
      const response = await fetch("/user/return-material", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Material returned successfully!", { position: "top-right" });
        setFormData({
          PassNumber: "",
          customerName: "",
          ReturnDate: "",
          materials: [{ materialName: "", quantity: "" }],
        });
      } else {
        toast.warn(data.message || "Failed to return material", { position: "top-right" });
      }
    } catch (error) {
      toast.error("Error returning material!", { position: "top-right" });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Return Material
            </h1>
            <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SL.No
                    </label>
                    <input
                      type="text"
                      name="PassNumber"
                      value={formData.PassNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Return Date
                    </label>
                    <input
                      type="date"
                      name="ReturnDate"
                      value={formData.ReturnDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Materials</h3>
                    <button
                      type="button"
                      onClick={addMaterialField}
                      className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <FaPlus className="w-4 h-4 mr-2" />
                      Add Material
                    </button>
                  </div>

                  {formData.materials.map((mat, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <input
                        type="text"
                        name="materialName"
                        placeholder="Material Name"
                        value={mat.materialName}
                        onChange={(e) => handleChange(e, index)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        required
                      />
                      <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={mat.quantity}
                        onChange={(e) => handleChange(e, index)}
                        className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeMaterialField(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <FaPaperPlane className="w-4 h-4 mr-2" />
                    Submit Return
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
