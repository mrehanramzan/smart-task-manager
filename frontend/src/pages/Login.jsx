import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import AuthButton from "../components/ui/AuthButton";
import FormInput from "../components/ui/FormInput";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrors({});

    try {
      const res = await login({
        username: formData.email,
        password: formData.password
      });

      if (res.error) {
        setErrors({ submit: res.error });
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setErrors({ submit: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</h2>
          <p className="text-lg text-gray-600">Sign in to your Smart Task Manager account</p>
        </div>

        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              required
              icon={<Mail className="h-5 w-5" />}
            />

            <div className="relative">
              <FormInput
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                required
                icon={<Lock className="h-5 w-5" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="ml-3 text-sm text-red-700">{errors.submit}</p>
                </div>
              </div>
            )}

            <AuthButton type="submit" loading={loading} disabled={loading}>
              Sign In
            </AuthButton>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                Create your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}