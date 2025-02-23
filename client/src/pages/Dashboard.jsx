import React, { useState, useEffect } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { FaTrash, FaPlus, FaPaperPlane } from "react-icons/fa";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("/user/getMaterial");
        if (response.ok) {
          const data = await response.json();
          setMaterials(data.materials);
          console.log(data.materials);
        } else {
          toast.error("Failed to fetch materials!");
        }
      } catch (error) {
        toast.error("Error fetching materials!");
      }
    };

    fetchMaterials();
  }, []);

  // Calculate price based on selected material
  const getPrice = (materialId) => {
    const material = materials.find(m => m._id === materialId);
    return material ? material.price : 0;
  };

  // Calculate total amount based on materials and quantities
  const calculateTotalAmount = (materialItems) => {
    return materialItems.reduce((total, item) => {
      const price = getPrice(item.materialId);
      return total + (price * item.quantity);
    }, 0);
  };

  const validationSchema = Yup.object({
    PassNumber: Yup.number().required("Pass Number is required").positive().integer(),
    customerName: Yup.string().required("Customer Name is required"),
    customerAddress: Yup.string().required("Customer Address is required"),
    Remarks: Yup.string(),
    materials: Yup.array()
      .of(
        Yup.object({
          materialId: Yup.string().required("Material is required"),
          quantity: Yup.number().required("Stock is required").positive().integer(),
        })
      )
      .min(1, "At least one material is required"),
    OutDate: Yup.date().required("Out Date is required").typeError("Invalid date format"),
    totalAmount: Yup.number().required("Total Amount is required").positive(),
    paymentMethod: Yup.string().required("Payment Method is required").oneOf(["Cash", "Card", "Online"]),
  });

  const initialValues = {
    PassNumber: "",
    customerName: "",
    customerAddress: "",
    Remarks: "",
    materials: [{ materialId: "", quantity: 1 }],
    OutDate: "",
    totalAmount: "",
    paymentMethod: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Calculate final total amount before submission
      const finalTotalAmount = calculateTotalAmount(values.materials);
      const submissionValues = {
        ...values,
        totalAmount: finalTotalAmount
      };

      const response = await fetch("/user/gatepass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionValues),
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
            <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-8">Create Pass</h1>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
              <Formik 
                initialValues={initialValues} 
                validationSchema={validationSchema} 
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "PassNumber", label: "SL.NO", type: "number" },
                        { name: "customerName", label: "Customer Name", type: "text" },
                        { name: "customerAddress", label: "Customer Address", type: "text" },
                        { name: "Remarks", label: "Remarks", type: "text" },
                        { name: "OutDate", label: "Out Date", type: "date" },
                        { name: "paymentMethod", label: "Payment Method", type: "text", placeholder: "e.g., Cash, Card, Online" },
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="block text-sm font-medium text-black dark:text-white mb-1">
                            {field.label}
                          </label>
                          <Field 
                            type={field.type} 
                            name={field.name} 
                            placeholder={field.placeholder}
                            className="form-input w-full border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-900 text-black dark:text-white" 
                          />
                          <ErrorMessage 
                            name={field.name} 
                            component="div" 
                            className="text-red-500 text-sm mt-1" 
                          />
                        </div>
                      ))}

                      <div>
                        <label className="block text-sm font-medium text-black dark:text-white mb-1">
                          Materials
                        </label>
                        <FieldArray name="materials">
                          {({ insert, remove, push }) => (
                            <div>
                              {values.materials.map((_, index) => (
                                <div key={index} className="flex space-x-4 mb-4">
                                  <Field 
                                    as="select" 
                                    name={`materials.${index}.materialId`}
                                    onChange={(e) => {
                                      setFieldValue(`materials.${index}.materialId`, e.target.value);
                                      // Update total amount when material changes
                                      const newMaterials = [...values.materials];
                                      newMaterials[index].materialId = e.target.value;
                                      setFieldValue('totalAmount', calculateTotalAmount(newMaterials));
                                    }}
                                    className="form-select w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-black dark:text-white"
                                  >
                                    <option value="">Select Material</option>
                                    {materials.map((material) => (
                                      <option key={material._id} value={material._id}>
                                        {material.materialName} - ₹{material.price}
                                      </option>
                                    ))}
                                  </Field>
                                  <Field 
                                    type="number" 
                                    name={`materials.${index}.quantity`}
                                    onChange={(e) => {
                                      setFieldValue(`materials.${index}.quantity`, e.target.value);
                                      // Update total amount when quantity changes
                                      const newMaterials = [...values.materials];
                                      newMaterials[index].quantity = Number(e.target.value);
                                      setFieldValue('totalAmount', calculateTotalAmount(newMaterials));
                                    }}
                                    className="form-input w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-black dark:text-white" 
                                  />
                                  <div className="form-input w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-black dark:text-white">
                                    ₹{getPrice(values.materials[index].materialId) * values.materials[index].quantity}
                                  </div>
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      remove(index);
                                      // Update total amount when material is removed
                                      const newMaterials = values.materials.filter((_, i) => i !== index);
                                      setFieldValue('totalAmount', calculateTotalAmount(newMaterials));
                                    }} 
                                    className="text-red-500"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              ))}
                              <button 
                                type="button" 
                                onClick={() => push({ materialId: "", quantity: 1 })} 
                                className="text-blue-500"
                              >
                                <FaPlus /> Add Material
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black dark:text-white mb-1">
                          Total Amount
                        </label>
                        <div className="form-input w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-black dark:text-white">
                          ₹{calculateTotalAmount(values.materials)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}   
                        className="inline-flex items-center px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      >   
                        <FaPaperPlane className="w-4 h-4 mr-2" /> 
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
      <Toaster position="top-right" />
    </div>
  );
}

export default Dashboard;