import toast from "react-hot-toast";

const defaultOptions={
    duration: 3000,
    style:{
        borderRadius : "12px",
        padding:"14px 16px",
        fontSize: "14px",
    },
}

const notify= {
    success(message){
        toast.success(message,defaultOptions)
    },

    error(message){
        toast.error(message,defaultOptions)
    },

    loading(message){
        return toast.loading(message)
    },

    dismiss(id){
        toast.dismiss(id)
    },

    promise(promise, messages){
        return toast.promise(
            promise,
            {
                loading: messages.loading,
                success: messages.success,
                error: messages.error,
            },
            defaultOptions
        );
    },
}

export default notify;