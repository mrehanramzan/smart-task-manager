import { useState } from "react";
import { User, Mail, Lock, CreditCard, Crown, Shield, Save, Eye, EyeOff, CheckCircle, AlertCircle, Clock, Calendar } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import CustomButton from "../components/ui/CustomButton";
import FormInput from "../components/ui/FormInput";

export default function Profile({ user }) {
  // Mock user data
  const mockUser = user || {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    plan: "free",
    joinDate: "2025-01-15",
    tasksCount: 7,
    maxTasks: 10
  };

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: mockUser.name,
    email: mockUser.email
  });
  const [profileErrors, setProfileErrors] = useState({});

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "plan", label: "Plan & Billing", icon: CreditCard }
  ];

  // Handle profile input changes
  const handleProfileChange = (field) => (e) => {
    setProfileData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (profileErrors[field]) {
      setProfileErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Handle password input changes
  const handlePasswordChange = (field) => (e) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Validate profile form
  const validateProfile = () => {
    const errors = {};
    
    if (!profileData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!profileData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = "Please enter a valid email address";
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePassword = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = "Password must contain uppercase, lowercase, and number";
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Profile updated:", profileData);
      alert("Profile updated successfully!");
    } catch (error) {
      setProfileErrors({ submit: "Failed to update profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Password changed");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      alert("Password changed successfully!");
    } catch (error) {
      setPasswordErrors({ submit: "Failed to change password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Handle plan upgrade
  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Upgrading to premium");
      alert("Redirecting to payment...");
      // TODO: Integrate with payment gateway
    } catch (error) {
      alert("Failed to process upgrade. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={mockUser} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-1 text-gray-600">Manage your profile, security, and subscription</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 mr-2" />
                      {tab.label}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h3>
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <FormInput
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    value={profileData.name}
                    onChange={handleProfileChange('name')}
                    error={profileErrors.name}
                    required
                    icon={<User className="h-5 w-5" />}
                  />

                  <FormInput
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={profileData.email}
                    onChange={handleProfileChange('email')}
                    error={profileErrors.email}
                    required
                    icon={<Mail className="h-5 w-5" />}
                  />

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Account Status</p>
                        <p className="text-sm text-gray-600">
                          Member since {new Date(mockUser.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {profileErrors.submit && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <p className="ml-3 text-sm text-red-700">{profileErrors.submit}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <CustomButton
                      type="submit"
                      loading={loading}
                      disabled={loading}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </CustomButton>
                  </div>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Change Password</h3>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="relative">
                    <FormInput
                      label="Current Password"
                      type={showPasswords.current ? "text" : "password"}
                      placeholder="Enter your current password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange('currentPassword')}
                      error={passwordErrors.currentPassword}
                      required
                      icon={<Lock className="h-5 w-5" />}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <FormInput
                      label="New Password"
                      type={showPasswords.new ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange('newPassword')}
                      error={passwordErrors.newPassword}
                      required
                      icon={<Lock className="h-5 w-5" />}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <FormInput
                      label="Confirm New Password"
                      type={showPasswords.confirm ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange('confirmPassword')}
                      error={passwordErrors.confirmPassword}
                      required
                      icon={<Lock className="h-5 w-5" />}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Contains uppercase and lowercase letters</li>
                      <li>• Contains at least one number</li>
                    </ul>
                  </div>

                  {passwordErrors.submit && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <p className="ml-3 text-sm text-red-700">{passwordErrors.submit}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <CustomButton
                      type="submit"
                      loading={loading}
                      disabled={loading}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </CustomButton>
                  </div>
                </form>
              </div>
            )}

            {/* Plan & Billing Tab */}
            {activeTab === "plan" && (
              <div className="max-w-3xl">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Plan & Billing</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Current Plan */}
                  <div className={`border-2 rounded-lg p-6 ${
                    mockUser.plan === "free" ? "border-gray-200" : "border-blue-500"
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {mockUser.plan === "free" ? "Free Plan" : "Premium Plan"}
                      </h4>
                      {mockUser.plan === "premium" && (
                        <div className="flex items-center text-blue-600">
                          <Crown className="h-5 w-5 mr-1" />
                          <span className="text-sm font-medium">Current</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          {mockUser.plan === "free" ? "Up to 10 tasks" : "Unlimited tasks"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">Basic task management</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">Time tracking</span>
                      </div>
                      {mockUser.plan === "premium" && (
                        <>
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-sm text-gray-700">Advanced AI insights</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-sm text-gray-700">Priority support</span>
                          </div>
                        </>
                      )}
                    </div>

                    {mockUser.plan === "free" && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>{mockUser.tasksCount}/{mockUser.maxTasks}</strong> tasks used
                        </p>
                        <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-yellow-600 h-2 rounded-full transition-all" 
                            style={{ width: `${(mockUser.tasksCount / mockUser.maxTasks) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {mockUser.plan === "free" ? "$0" : "$9.99"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {mockUser.plan === "free" ? "forever" : "per month"}
                      </div>
                    </div>
                  </div>

                  {/* Premium Plan (if user is on free) */}
                  {mockUser.plan === "free" && (
                    <div className="border-2 border-blue-500 rounded-lg p-6 relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Recommended
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Premium Plan</h4>
                        <div className="flex items-center text-blue-600">
                          <Crown className="h-5 w-5 mr-1" />
                          <span className="text-sm font-medium">Upgrade</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm text-gray-700">Unlimited tasks</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm text-gray-700">Advanced AI insights</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm text-gray-700">Priority support</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm text-gray-700">Export capabilities</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm text-gray-700">Team collaboration</span>
                        </div>
                      </div>

                      <div className="mt-6 text-center">
                        <div className="text-3xl font-bold text-gray-900">$9.99</div>
                        <div className="text-sm text-gray-500">per month</div>
                      </div>

                      <div className="mt-6">
                        <CustomButton
                          onClick={handleUpgrade}
                          loading={loading}
                          disabled={loading}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade to Premium
                        </CustomButton>
                      </div>
                    </div>
                  )}

                  {/* Billing Info (if premium user) */}
                  {mockUser.plan === "premium" && (
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h4>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Next billing date</span>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Payment method</span>
                          <span className="text-sm font-medium text-gray-900">•••• •••• •••• 1234</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Amount</span>
                          <span className="text-sm font-medium text-gray-900">$9.99/month</span>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        <CustomButton variant="outline" className="w-full">
                          Update Payment Method
                        </CustomButton>
                        <CustomButton variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
                          Cancel Subscription
                        </CustomButton>
                      </div>
                    </div>
                  )}
                </div>

                {/* Usage Statistics */}
                <div className="mt-8 border-t border-gray-200 pt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                          <p className="text-2xl font-bold text-gray-900">24</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Clock className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Hours Tracked</p>
                          <p className="text-2xl font-bold text-gray-900">127</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Calendar className="h-8 w-8 text-purple-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Days Active</p>
                          <p className="text-2xl font-bold text-gray-900">45</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}