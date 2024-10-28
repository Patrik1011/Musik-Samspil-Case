import { signupUser } from "../../../utils/authService.js";

export const initSignup = () => {
  const signupForm = document.getElementById("signupForm");

  if (!signupForm) {
    console.error("Signup form not found");
    return;
  }

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(signupForm);
    const formObject = Object.fromEntries(formData);

    try {
      const data = await signupUser(formObject);
      console.log("Signup data:", data);

      alert("Signup successful! Please log in.");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed. Please try again.");
    }
  });
};
