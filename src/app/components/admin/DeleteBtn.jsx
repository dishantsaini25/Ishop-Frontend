"use client"

import { FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { axiosInstance } from "../../../../helper/helper";
import { useRouter } from "next/navigation";

function DeleteBtn({ api, title = "Delete Item", message = "Are you sure you want to delete this item?", itemName = "" }) {
    const router = useRouter();

    async function deleteHandler() {
        // ✅ SweetAlert2 with custom HTML
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
            background: '#fff',
            backdrop: 'rgba(0,0,0,0.5)',
            allowOutsideClick: false,
            allowEscapeKey: true,
            reverseButtons: true,
            customClass: {
                popup: 'rounded-2xl shadow-2xl',
                title: 'text-2xl font-bold text-gray-800',
                confirmButton: 'px-5 py-2.5 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300',
                cancelButton: 'px-5 py-2.5 text-sm font-medium rounded-lg bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:ring-gray-200 text-gray-800'
            }
        });

        if (!result.isConfirmed) return;

        // Show loading
        Swal.fire({
            title: 'Processing...',
            html: 'Please wait while we delete the item.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const response = await axiosInstance.delete(api);
            
            if (response.data.success) {
                await Swal.fire({
                    title: 'Deleted!',
                    text: response.data.message || 'Item has been deleted successfully.',
                    icon: 'success',
                    confirmButtonColor: '#10b981',
                    confirmButtonText: 'Done',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: true
                });
                
                router.refresh();
            } else {
                await Swal.fire({
                    title: 'Error!',
                    text: response.data.message || 'Something went wrong.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444',
                    confirmButtonText: 'Try Again'
                });
            }
        } catch (error) {
            console.error("Delete error:", error);
            await Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Internal Server Error',
                icon: 'error',
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'OK'
            });
        }
    }

    return (
        <button 
            onClick={deleteHandler}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer transition"
            title="Delete"
        >
            <FiTrash2 size={18} />
        </button>
    )
}

export default DeleteBtn;