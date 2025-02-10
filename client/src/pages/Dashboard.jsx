import React, { useState, useEffect } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast"; // Import Toaster

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [materials, setMaterials] = useState([]);

  // Fetch materials from the backend
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("/user/getMaterial");
        if (response.ok) {
          const data = await response.json();
          setMaterials(data.materials);
        } else {
          toast.error("Failed to fetch materials!");
        }
      } catch (error) {
        toast.error("Error fetching materials!");
      }
    };

    fetchMaterials();
  }, []);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    PassNumber: Yup.number().required("Pass Number is required").positive().integer(),
    customerName: Yup.string().required("Customer Name is required"),
    customerAddress: Yup.string().required("Customer Address is required"),
    material: Yup.string().required("Material is required"),
    OutDate: Yup.date().required("Out Date is required").typeError("Invalid date format"),
    totalAmount: Yup.number().required("Total Amount is required").positive(),
    paymentMethod: Yup.string().required("Payment Method is required").oneOf(["Cash", "Card", "Online"]),
  });

  const initialValues = {
    PassNumber: "",
    customerName: "",
    customerAddress: "",
    material: "",
    OutDate: "",
    totalAmount: "",
    paymentMethod: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await fetch("/user/gatepass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        toast.success("Pass created successfully!");
        resetForm();
      } else {
        const errorData = await response.json();
        toast.error(`Failed to create pass: ${errorData.message}`);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
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
              Create Pass
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                  <Form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "PassNumber", label: "Pass Number", type: "number" },
                        { name: "customerName", label: "Customer Name", type: "text" },
                        { name: "customerAddress", label: "Customer Address", type: "text" },
                        { name: "OutDate", label: "Out Date", type: "date" },
                        { name: "totalAmount", label: "Total Amount", type: "number" },
                        { name: "paymentMethod", label: "Payment Method", type: "text", placeholder: "e.g., Cash, Card, Online" },
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="block text-sm font-medium text-black mb-1">{field.label}</label>
                          <Field
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder || ""}
                            className="form-input w-full border-gray-300 rounded-md text-black"
                          />
                          <ErrorMessage name={field.name} component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      ))}
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Material</label>
                        <Field as="select" name="material" className="form-select w-full border-gray-300 rounded-md text-black">
                          <option value="" disabled>
                            Select Material
                          </option>
                          {materials.length > 0 ? (
                            materials.map((material) => (
                              <option key={material._id} value={material.materialName}>
                                {material.materialName}
                              </option>
                            ))
                          ) : (
                            <option disabled>No materials available</option>
                          )}
                        </Field>
                        <ErrorMessage name="material" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md"
                        aria-busy={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </main>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default Dashboard;
