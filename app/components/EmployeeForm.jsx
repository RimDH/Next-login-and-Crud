"use client";
import { useState, useEffect } from "react";

export default function EmployeeForm({ onSave, editing, onCancel }) {
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [salary, setSalary] = useState("");

    useEffect(() => {
        if (editing) {
            setName(editing.name);
            setPosition(editing.position);
            setSalary(editing.salary);
        } else {
            setName("");
            setPosition("");
            setSalary("");
        }
    }, [editing]);

    const submit = e => {
        e.preventDefault();
        onSave({ _id: editing?._id, name, position, salary: Number(salary) });
    };

    return (
        <form onSubmit={submit} className="p-4 border rounded">
            <div className="flex gap-2">
                <input value={name} onChange={e => setName(e.target.value)} required placeholder="Name" className="flex-1 p-2 border rounded" />
                <input value={position} onChange={e => setPosition(e.target.value)} required placeholder="Position" className="flex-1 p-2 border rounded" />
                <input value={salary} onChange={e => setSalary(e.target.value)} required placeholder="Salary" type="number" min="0" className="w-32 p-2 border rounded" />
                <button type="submit" className="bg-slate-800 text-white px-3 py-2 rounded">{editing ? "Save" : "Add"}</button>
            </div>
            {editing && <button type="button" onClick={onCancel} className="mt-2 text-sm text-slate-600">Cancel</button>}
        </form>
    );
}
