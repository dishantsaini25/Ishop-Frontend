"use client"

import { notify } from "../../../../helper/helper";
import { useRouter } from "next/navigation";

const backendUrl = () =>
  (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

function StatusBadge({ status, flag, api }) {
    const router = useRouter();
    const base = "px-3 py-1 rounded-full text-sm font-medium cursor-pointer";

    const labels = {
        status: status ? "Active" : "Inactive",
        is_home: status ? "Home" : "Not in home",
        is_top: status ? "Top" : "Not in top",
        is_best: status ? "Best" : "Not in best",
        is_best_seller: status ? "Best Seller" : "Not Best Seller",
        show_home: status ? "Show Home" : "Hide Home",
        is_featured: status ? "Featured" : "Not Featured",
        is_hot: status ? "Hot" : "Not Hot",
        stock: status ? "In Stock" : "Out of Stock",
    };

    const display = labels[flag] || "Active";

    async function statusHandler() {
        try {
            const response = await fetch(`${backendUrl()}/${api}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ field: flag }),
            });
            const data = await response.json();
            if (data.success) router.refresh();
            notify(data.message, data.success);
        } catch {
            notify("Internal Server Error", false);
        }
    }

    return (
        <button onClick={statusHandler} className={`${base} bg-green-100 text-red-600`}>
            {display}
        </button>
    );
}

export default StatusBadge;