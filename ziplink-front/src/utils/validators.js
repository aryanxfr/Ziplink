export const validateEmail = (email) => {
    if (!email.trim()) {
        return "Email is required.";
    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return "Please enter a valid email address.";
    }

    return null;
};

export const validateUsername = (username) => {
    if (!username.trim()) {
        return "Username is required.";
    }

    if (username.length < 3) {
        return "Username must be at least 3 characters.";
    }

    if (username.length > 50) {
        return "Username cannot exceed 50 characters.";
    }

    return null;
};

export const validatePassword = (password) => {
    if (!password.trim()) {
        return "Password is required.";
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
        return "Password must contain uppercase, lowercase, number and special character.";
    }

    return null;
};

export const validateConfirmPassword = (
    password,
    confirmPassword
) => {
    if (!confirmPassword.trim()) {
        return "Please confirm your password.";
    }

    if (password !== confirmPassword) {
        return "Passwords do not match.";
    }

    return null;
};