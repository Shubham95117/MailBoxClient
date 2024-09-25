import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/auth/authSlice";
import AuthForm from "./AuthForm";

// Helper function to render component with Redux store
const renderWithStore = (
  ui,
  {
    initialState,
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: initialState,
    }),
  } = {}
) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("AuthForm Component", () => {
  // Test Case 1: Renders the form with email and password fields
  test("renders the form with email and password fields", () => {
    renderWithStore(<AuthForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  // Test Case 2: Allows users to type into the email and password fields
  test("allows users to type into the email and password fields", () => {
    renderWithStore(<AuthForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  // Test Case 3: Displays an error message if submit is clicked with empty fields
  test("displays an error message if submit is clicked with empty fields", () => {
    renderWithStore(<AuthForm />);

    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.click(loginButton);

    // Assuming you have a validation error element for empty fields
    expect(
      screen.getByText(/email and password are required/i)
    ).toBeInTheDocument();
  });

  // Test Case 4: Calls login action when valid email and password are provided
  test("calls login action when valid email and password are provided", () => {
    // Mock the login function if it's dispatched via Redux or passed as props
    const mockLogin = jest.fn();
    renderWithStore(<AuthForm login={mockLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  // Test Case 5: Shows 'Don't have an account? Sign up' link
  test('shows "Don\'t have an account? Sign up" link', () => {
    renderWithStore(<AuthForm />);

    const signUpLink = screen.getByText(/don't have an account\? sign up/i);

    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute("href", "/signup"); // Assuming this is a link
  });

  // Test Case 6: Confirms password field appears when in signup mode
  test("shows confirm password field when in signup mode", () => {
    renderWithStore(<AuthForm mode="signup" />);

    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  // Test Case 7: Displays error message if passwords do not match in signup mode
  test("displays error message if passwords do not match in signup mode", () => {
    renderWithStore(<AuthForm mode="signup" />);

    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const signUpButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "differentPassword" },
    });
    fireEvent.click(signUpButton);

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });
});
