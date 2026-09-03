import { useEffect, useState } from "react";
import Input from "./Input";
import Button from "./Button";

export default function DeleteAccountDialog({
    isOpen,
    onClose,
    onConfirm,
    loading = false,
}) {
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setPassword("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!password.trim()) return;

        onConfirm(password);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-danger">
                    Delete Account
                </h2>

                <p className="mt-2 text-sm text-body">
                    This action cannot be undone.
                    Your account will be scheduled for deletion,
                    and all associated URLs and analytics will
                    eventually be removed.
                </p>

                <Input
                    className="mt-6"
                    type="password"
                    label="Confirm your password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="danger"
                        onClick={handleConfirm}
                        disabled={
                            loading || !password.trim()
                        }
                    >
                        {loading
                            ? "Deleting..."
                            : "Delete account"}
                    </Button>
                </div>
            </div>
        </div>
    );
}