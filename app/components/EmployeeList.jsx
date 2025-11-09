"use client";
import { useState, useEffect } from "react";
import EmployeeForm from "./EmployeeForm";

export default function EmployeeList({ initial = [] }) {
    const [list, setList] = useState(initial);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Get token from localStorage
    const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    // Fetch employees
    async function refresh() {
        try {
            setLoading(true);
            setError("");
            const token = getToken();
            const res = await fetch("/api/employees", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch employees");
            const data = await res.json();
            setList(data.employees || []);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setList([]);
        } finally {
            setLoading(false);
        }
    }

    // Fetch on mount
    useEffect(() => {
        refresh();
    }, []);

    // Delete employee
    async function remove(id) {
        try {
            const token = getToken();
            const res = await fetch(`/api/employees?id=${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete employee");
            refresh();
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    }

    // Add/Edit employee
    async function save(data) {
        try {
            const token = getToken();
            const method = data._id ? "PUT" : "POST";
            const res = await fetch("/api/employees", {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to save employee");
            setEditing(null);
            refresh();
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    }

    return (
        <section>
            <EmployeeForm onSave={save} editing={editing} onCancel={() => setEditing(null)} />
            {error && <p className="text-red-600 mt-4">{error}</p>}
            {loading ? (
                <p className="mt-4 text-gray-600">Loading employees...</p>
            ) : (
                <ul className="mt-6 space-y-4">
                    {(list || []).map(emp => (
                        <li key={emp._id} className="p-4 border rounded flex justify-between">
                            <div>
                                <h3 className="font-semibold">{emp.name}</h3>
                                <p className="text-sm text-slate-600">{emp.position}</p>
                                <p className="text-sm text-slate-800">${emp.salary}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setEditing(emp)} className="border px-2 py-1 rounded">
                                    Edit
                                </button>
                                <button
                                    onClick={() => remove(emp._id)}
                                    className="bg-red-600 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
