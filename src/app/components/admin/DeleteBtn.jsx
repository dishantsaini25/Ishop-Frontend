"use client"

import { FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const backendUrl = () =>
  (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

function DeleteBtn({ api, title = "Delete Item", message = "Are you sure you want to delete this item?", itemName = "" }) {
    const router = useRouter();

    async function deleteHandler() {
        const result = await Swal.fire({
            title: title,
            html: `
                <div class="text-center">
                    <div class="text-red-500 text-5xl mb-4">⚠️</div>
                    <p class="text-gray-600 mb-2">${message}</p>
                    ${itemName ? `<p class="font-semibold text-gray-800 mt-2">"${itemName}"</p>` : ''}
                    <p class="text-xs text-gray-400 mt-4">This action cannot be undone.</p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        Swal.fire({ title: 'Processing...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        try {
            const response = await fetch(`${backendUrl()}/${api}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();

            if (data.success) {
                await Swal.fire({ title: 'Deleted!', text: data.message || 'Deleted successfully.', icon: 'success', timer: 1500, timerProgressBar: true, showConfirmButton: false });
                window.location.reload();
            } else {
                await Swal.fire({ title: 'Error!', text: data.message || 'Something went wrong.', icon: 'error' });
            }
        } catch (error) {
            console.error("Delete error:", error);
            await Swal.fire({ title: 'Error!', text: 'Internal Server Error', icon: 'error' });
        }
    }

    return (
        <button onClick={deleteHandler} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer transition" title="Delete">
            <FiTrash2 size={18} />
        </button>
    );
}

export default DeleteBtn;