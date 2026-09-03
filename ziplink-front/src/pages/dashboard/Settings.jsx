import { useState, useEffect } from "react";
import { Sun, Moon, Monitor, Mail, ShieldCheck } from "lucide-react";

import userService from "../../services/user.service";
import authService from "../../services/auth.service";
import { validatePassword, validateConfirmPassword } from "../../utils/validators";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import DeleteAccountDialog from "../../components/ui/DeleteAccountDialog";
import { cn } from "../../utils/cn";
import notify from "../../utils/toast";
import { formatDate } from "../../utils/formatters";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "password", label: "Password" },
  { id: "appearance", label: "Appearance" },
  { id: "account", label: "Account" },
];

const THEMES = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

/** Resolves the effective theme (handles "system" → light/dark) */
function resolveTheme(theme) {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

export default function Settings() {
  const [tab, setTab] = useState("profile");
  const [theme, setThemeState] = useState(() => localStorage.getItem("theme") ?? "light");
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Apply theme whenever it changes, including system preference detection
  const applyTheme = (t) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
    document.documentElement.setAttribute("data-theme", resolveTheme(t));
  };

  // Listen for OS dark mode changes when "system" is selected
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolveTheme(theme));

    if (theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      document.documentElement.setAttribute("data-theme", resolveTheme("system"));
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  // Email change state
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailChanging, setEmailChanging] = useState(false);
  const [emailChangeRequested, setEmailChangeRequested] = useState(false);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await userService.getCurrentUser();
      setProfile(response);
    } catch (err) {
      console.error(err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordSave = async () => {
    if (!passwordForm.currentPassword.trim()) {
      notify.error("Current password is required.");
      return;
    }
    const passwordError = validatePassword(passwordForm.newPassword);
    if (passwordError) {
      notify.error(passwordError);
      return;
    }
    const confirmPasswordError = validateConfirmPassword(
      passwordForm.newPassword,
      passwordForm.confirmPassword
    );
    if (confirmPasswordError) {
      notify.error(confirmPasswordError);
      return;
    }

    try {
      setPasswordSaving(true);
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      notify.success("Password changed successfully. Please log in again.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      await authService.logout();
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error) {
      notify.error(error.response?.data?.message ?? "Failed to change password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleEmailChange = async () => {
    if (!newEmail.trim()) {
      notify.error("Please enter a new email address.");
      return;
    }
    if (!emailPassword.trim()) {
      notify.error("Please enter your current password to confirm.");
      return;
    }

    try {
      setEmailChanging(true);
      await userService.requestEmailChange({
        newEmail: newEmail.trim(),
        password: emailPassword,
      });
      notify.success("Verification email sent! Check your new inbox.");
      setEmailChangeRequested(true);
      setEmailPassword("");
    } catch (err) {
      notify.error(err.response?.data?.message ?? "Failed to request email change.");
    } finally {
      setEmailChanging(false);
    }
  };

  const handleDeleteAccount = async (password) => {
    try {
      setDeleteLoading(true);
      await userService.deleteAccount({ password });
      setDeleteOpen(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-heading">Settings</h1>
        <p className="mt-1 text-sm text-body">Manage your profile, security, and account preferences.</p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto rounded-2xl border border-border bg-surface p-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id ? "bg-primary text-white" : "text-body hover:bg-black/5 hover:text-heading"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ────────── PROFILE TAB ────────── */}
      {tab === "profile" &&
        (profileLoading ? (
          <Card className="max-w-2xl">
            <div className="py-12 text-center text-body">Loading Profile...</div>
          </Card>
        ) : (
          <Card className="max-w-2xl">
            <h2 className="text-base font-semibold text-heading">Profile</h2>
            <p className="mt-1 text-sm text-body">Your username cannot be changed. You can update your email address below.</p>

            <div className="mt-6 flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-accent">
                {profile?.username?.charAt(0)?.toUpperCase()}
              </span>
              <div>
                <p className="font-semibold text-heading">{profile?.username}</p>
                <p className="text-sm text-body">{profile?.email}</p>
              </div>
            </div>

            {/* Username — read-only */}
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-heading">Username</label>
              <div className="flex h-11 items-center rounded-2xl border border-border bg-background/50 px-4 text-sm text-body">
                {profile?.username}
              </div>
              <p className="mt-1 text-xs text-body/60">Username cannot be changed.</p>
            </div>

            {/* Email — changeable with verification */}
            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-medium text-heading">Email address</label>
              <div className="flex h-11 items-center rounded-2xl border border-border bg-background/50 px-4 text-sm text-body">
                {profile?.email}
                {profile?.enabled && (
                  <ShieldCheck className="ml-auto h-4 w-4 text-green-600" />
                )}
              </div>
            </div>

            {emailChangeRequested ? (
              <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Verification email sent!</p>
                    <p className="mt-1 text-sm text-green-700">
                      We sent a verification link to <strong>{newEmail}</strong>. 
                      Click the link in the email to confirm your new address. 
                      You'll be logged out and will need to sign in with the new email.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4 rounded-2xl border border-border bg-background/30 p-5">
                <p className="text-sm font-medium text-heading">Change email address</p>
                <Input
                  label="New email"
                  type="email"
                  placeholder="your-new@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <Input
                  label="Confirm with your password"
                  type="password"
                  placeholder="Enter your current password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button onClick={handleEmailChange} disabled={emailChanging}>
                    {emailChanging ? "Sending..." : "Change email"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}

      {/* ────────── PASSWORD TAB ────────── */}
      {tab === "password" && (
        <Card className="max-w-2xl">
          <h2 className="text-base font-semibold text-heading">Change password</h2>
          <p className="mt-1 text-sm text-body">Use a strong password you don't use elsewhere.</p>
          <div className="mt-6 space-y-5">
            <Input label="Current password" type="password" value={passwordForm.currentPassword} onChange={(e) => handlePasswordChange("currentPassword", e.target.value)} />
            <Input label="New password" type="password" value={passwordForm.newPassword} onChange={(e) => handlePasswordChange("newPassword", e.target.value)} />
            <Input label="Confirm new password" type="password" value={passwordForm.confirmPassword} onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)} />
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handlePasswordSave} disabled={passwordSaving}>
              {passwordSaving ? "Updating..." : "Update password"}
            </Button>
          </div>
        </Card>
      )}

      {/* ────────── APPEARANCE TAB ────────── */}
      {tab === "appearance" && (
        <Card className="max-w-2xl">
          <h2 className="text-base font-semibold text-heading">Appearance</h2>
          <p className="mt-1 text-sm text-body">Choose how ZipLink looks on your device.</p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => applyTheme(t.id)}
                className={cn(
                  "flex flex-col items-center gap-2.5 rounded-2xl border p-5 transition-colors",
                  theme === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                )}
              >
                <t.icon className={cn("h-5 w-5", theme === t.id ? "text-accent" : "text-body")} />
                <span className={cn("text-sm font-medium", theme === t.id ? "text-accent" : "text-heading")}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* ────────── ACCOUNT TAB ────────── */}
      {tab === "account" && (
        <div className="max-w-2xl space-y-6">
          <Card>
            <h2 className="text-base font-semibold text-heading">Account information</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between border-b border-border pb-3">
                <dt className="text-body">Account ID</dt>
                <dd className="font-mono text-xs text-heading">{profile?.id ?? "—"}</dd>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <dt className="text-body">Member since</dt>
                <dd className="text-heading">
                  {profile?.createdAt ? formatDate(profile.createdAt) : "—"}
                </dd>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <dt className="text-body">Email verified</dt>
                <dd className={profile?.enabled ? "text-green-600 font-medium" : "text-amber-500 font-medium"}>
                  {profile?.enabled ? "Verified" : "Not verified"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-body">Role</dt>
                <dd className="text-heading capitalize">{profile?.role?.toLowerCase() ?? "—"}</dd>
              </div>
            </dl>
          </Card>
          <Card className="border-danger/30">
            <h2 className="text-base font-semibold text-danger">Delete account</h2>
            <p className="mt-1 text-sm text-body">
              Permanently delete your account and all associated links and analytics. This can't be undone.
            </p>
            <Button variant="danger" disabled={deleteLoading} onClick={() => setDeleteOpen(true)}>
              Delete Account
            </Button>
          </Card>
        </div>
      )}

      <DeleteAccountDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
        loading={deleteLoading}
      />
    </div>
  );
}
