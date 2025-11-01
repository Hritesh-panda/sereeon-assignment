import React from "react";

const PurchaseOrderForm = ({ contracts, form, setForm, handleCreate }) => {
  return (
    <form
      onSubmit={handleCreate}
      className="bg-white shadow rounded p-4 mb-6 grid grid-cols-3 gap-4"
    >
      <select
        className="border p-2"
        value={form.contractId}
        onChange={(e) => {
          const selected = contracts.find(
            (c) => c.id === parseInt(e.target.value)
          );
          setForm({
            ...form,
            contractId: e.target.value,
            productId: selected?.productId || "",
          });
        }}
        required
      >
        <option value="">Select Approved Contract</option>
        {contracts.map((c) => (
          <option key={c.id} value={c.id}>
            #{c.id} - {c.product?.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Quantity"
        className="border p-2"
        value={form.qty}
        onChange={(e) => setForm({ ...form, qty: e.target.value })}
        required
      />

      <button
        type="submit"
        className="bg-green-600 text-white rounded py-2 hover:bg-green-700 col-span-3"
      >
        Create Purchase Order
      </button>
    </form>
  );
};

export default PurchaseOrderForm;
