import React from "react";

const SalesContractForm = ({ form, setForm, handleCreate, products }) => {
  return (
    <form
      onSubmit={handleCreate}
      className="bg-white shadow rounded p-4 mb-6 grid grid-cols-2 gap-4"
    >
      <select
        className="border p-2"
        value={form.productId}
        onChange={(e) =>
          setForm({ ...form, productId: Number(e.target.value) })
        }
        required
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Total Quantity"
        className="border p-2"
        value={form.totalQty}
        onChange={(e) => setForm({ ...form, totalQty: e.target.value })}
        required
      />

      <input
        type="date"
        className="border p-2"
        value={form.validityStart}
        onChange={(e) => setForm({ ...form, validityStart: e.target.value })}
        required
      />

      <input
        type="date"
        className="border p-2"
        value={form.validityEnd}
        onChange={(e) => setForm({ ...form, validityEnd: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Terms (optional)"
        className="border p-2 col-span-2"
        value={form.terms}
        onChange={(e) => setForm({ ...form, terms: e.target.value })}
      />

      <button
        type="submit"
        className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Create Contract
      </button>
    </form>
  );
};

export default SalesContractForm;
