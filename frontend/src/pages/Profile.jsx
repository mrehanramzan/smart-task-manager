import { useState } from "react";
import { User, Mail, Lock, CreditCard, Save, Check, Star, Zap } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import CustomButton from "../components/ui/CustomButton";
import FormInput from "../components/ui/FormInput";
import { updateProfile, updatePassword } from "../apis/account";
import { updateSubscription } from "../apis/subscription";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const userData = user.user;
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: userData.fullname,
    email: userData.email
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

  const handleProfileChange = (field) => (e) => {
    setProfileData(prev => ({ ...prev, [field]: e.target.value }));
    if (profileErrors[field]) setProfileErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handlePasswordChange = (field) => (e) => {
    setPasswordData(prev => ({ ...prev, [field]: e.target.value }));
    if (passwordErrors[field]) setPasswordErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword) errors.currentPassword = "Current password is required";
    if (!passwordData.newPassword) errors.newPassword = "New password is required";
    if (!passwordData.confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (passwordData.newPassword !== passwordData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile({ fullname: profileData.name, email: profileData.email });
      if (!res.success) throw new Error(res.error);
      alert("Profile updated successfully!");
    } catch (error) {
      setProfileErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setLoading(true);
    try {
      const res = await updatePassword({ old_password: passwordData.currentPassword, new_password: passwordData.newPassword });
      if (!res.success) throw new Error(res.error);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      alert("Password changed successfully!");
    } catch (error) {
      setPasswordErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await updateSubscription("premium");
      console.log("Response ", res)
      if (!res.id) throw new Error(res.error);
      alert("Upgraded to premium plan ($9/month) successfully!");
      window.location.reload();
    } catch (error) {
      alert("Failed to process upgrade. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      const res = await updateSubscription("free");
      console.log("Response ", res)
      if (!res.id) throw new Error(res.error);
      alert("Subscription canceled successfully! Downgraded to free plan.");
      window.location.reload();
    } catch (error) {
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-1 text-gray-600">Manage your profile, security, and subscription</p>
                        {/* Billing Information */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current Plan:</span>
                      <span className="ml-2 font-medium text-gray-900 capitalize">
                        {user.subscription_tier}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Billing Cycle:</span>
                      <span className="ml-2 font-medium text-gray-900">Monthly</span>
                    </div>
                    {user.subscription_tier === "premium" && (
                      <>
                        <div>
                          <span className="text-gray-600">Next Payment:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <span className="ml-2 font-medium text-gray-900">$9.00</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {tabs.map(tab => {
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
            {activeTab === "profile" && (
              <form onSubmit={handleProfileUpdate} className="max-w-2xl space-y-6">
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

                {profileErrors.submit && <p className="text-red-600">{profileErrors.submit}</p>}

                <div className="flex justify-end">
                  <CustomButton type="submit" loading={loading} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </CustomButton>
                </div>
              </form>
            )}

            {activeTab === "password" && (
              <form onSubmit={handlePasswordSubmit} className="max-w-2xl space-y-6">
                <FormInput
                  label="Current Password"
                  type={showPasswords.current ? "text" : "password"}
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange('currentPassword')}
                  error={passwordErrors.currentPassword}
                  required
                  icon={<Lock className="h-5 w-5" />}
                />
                <FormInput
                  label="New Password"
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange('newPassword')}
                  error={passwordErrors.newPassword}
                  required
                  icon={<Lock className="h-5 w-5" />}
                />
                <FormInput
                  label="Confirm New Password"
                  type={showPasswords.confirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange('confirmPassword')}
                  error={passwordErrors.confirmPassword}
                  required
                  icon={<Lock className="h-5 w-5" />}
                />

                {passwordErrors.submit && <p className="text-red-600">{passwordErrors.submit}</p>}

                <div className="flex justify-end">
                  <CustomButton type="submit" loading={loading} disabled={loading}>
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </CustomButton>
                </div>
              </form>
            )}

            {activeTab === "plan" && (
              <div className="max-w-4xl space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan & Billing</h2>
                  <p className="text-gray-600">Choose the plan that works best for you</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Free Plan Card */}
                  <div className={`relative rounded-2xl border-2 p-8 ${
                    user.subscription_tier === "free" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 bg-white"
                  }`}>
                    {user.subscription_tier === "free" && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Current Plan
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <Star className="h-8 w-8 text-gray-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                      <p className="text-gray-600 mt-2">Perfect to get started</p>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-900">$0</span>
                        <span className="text-gray-600">/month</span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Basic features</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Limited usage</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Community support</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Basic analytics</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Basic analytics</span>
                      </li>
                    </ul>

                    {user.subscription_tier === "free" ? (
                      <div className="text-center">
                        <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                          <Check className="h-4 w-4 mr-2" />
                          Active Plan
                        </span>
                      </div>
                    ) : (
                      <button 
                        onClick={handleCancelSubscription}
                        disabled={loading}
                        className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        {loading ? "Processing..." : "Downgrade to Free"}
                      </button>
                    )}
                  </div>

                  {/* Paid Plan Card */}
                  <div className={`relative rounded-2xl border-2 p-8 ${
                    user.subscription_tier === "premium" 
                      ? "border-purple-500 bg-purple-50" 
                      : "border-gray-200 bg-white shadow-lg"
                  }`}>
                    {user.subscription_tier === "premium" && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Current Plan
                        </span>
                      </div>
                    )}
                    
                    {user.subscription_tier === "free" && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                        <Zap className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                      <p className="text-gray-600 mt-2">For power users</p>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-900">$9</span>
                        <span className="text-gray-600">/month</span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">All Free features</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Unlimited usage</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Priority support</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Advanced analytics</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Premium features</span>
                      </li>
                    </ul>

                    {user.subscription_tier === "premium" ? (
                      <div className="space-y-3">
                        <div className="text-center">
                          <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-lg font-medium">
                            <Check className="h-4 w-4 mr-2" />
                            Active Plan
                          </span>
                        </div>
                        <button 
                          onClick={handleCancelSubscription}
                          disabled={loading}
                          className="w-full py-3 px-4 border border-red-300 rounded-lg font-medium text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {loading ? "Processing..." : "Cancel Subscription"}
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50"
                      >
                        {loading ? "Processing..." : "Upgrade to Pro"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Billing Information */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current Plan:</span>
                      <span className="ml-2 font-medium text-gray-900 capitalize">
                        {user.subscription_tier}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Billing Cycle:</span>
                      <span className="ml-2 font-medium text-gray-900">Monthly</span>
                    </div>
                    {user.subscription_tier === "premium" && (
                      <>
                        <div>
                          <span className="text-gray-600">Next Payment:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <span className="ml-2 font-medium text-gray-900">$9.00</span>
                        </div>
                      </>
                    )}
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