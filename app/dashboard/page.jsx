"use client";
import { useState, useEffect } from "react";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [employees, setEmployees] = useState([]);
    const [editing, setEditing] = useState(null);
    const router = useRouter();

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const fetchEmployees = async () => {
        const res = await fetch("/api/employees", { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 401) router.push("/");
        const data = await res.json();
        setEmployees(data.employees);
    };

    useEffect(() => { fetchEmployees(); }, []);

    const save = async data => {
        const method = data._id ? "PUT" : "POST";
        await fetch("/api/employees", {
            method,
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        setEditing(null);
        fetchEmployees();
    };

    const remove = async id => {
        await fetch(`/api/employees?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        fetchEmployees();
    };

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    return (
        <main className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
                <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
            </div>

            <EmployeeList list={employees} setEditing={setEditing} remove={remove} />
        </main>
    );
}
