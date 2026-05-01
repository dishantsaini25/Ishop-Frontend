"use client"

import { notify, axiosInstance } from "../../../../helper/helper";
import { useRouter } from "next/navigation";



function StatusBadge({ status, flag, api }) {
    const router= useRouter();
    const base = "px-3 py-1 rounded-full text-sm font-medium cursor-pointer";

    let display = "Active";
    if (flag === "status") {
        display = status ? "Active" : "Inactive"

    }

    if (flag === "is_home") {
        display = status ? "Home" : "Not is home"

    }

    if (flag === "is_top") {
        display = status ? "Top" : "Not in top"

    }
    if (flag === "is_best") {
        display = status ? "Best" : "Not in best"

    }
      if (flag === "is_best_seller") {
        display = status ? "Best Seller" : "Not Best Seller"
    }
          if (flag === "show_home") {
        display = status ? "Show Home" : "Hide Home"
    }
           if (flag === "is_featured") {
        display = status ? "Featured" : "Not Featured"
    }
                if (flag === "is_hot") {    
        display = status ? "Hot" : "Not Hot"
    }
                if (flag === "stock") {    
        display = status ? "In Stock" : "Out of Stock"
    }

    function statusHandler() {
        axiosInstance.patch(api, { field: flag })
            .then((response) => {
                if (response.data.success) {
                    router.refresh()
                }
                notify(response.data.message, response.data.success)
            })
            .catch((error) => {
                notify("Internal Server Error", false)
                console.log(error)
            })
    }

    return (

        <button
            onClick={statusHandler}
            className={`${base} bg-green-100 text-red-600`}>
            {display}
        </button>

    )
}
export default StatusBadge