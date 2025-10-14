import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, User, Lock, Wallet, GraduationCap, Building } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useApp } from '../contexts/AppContext';

export function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    walletId: '',
    department: '',
    year: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useApp();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.userId || !formData.password) {
      setError('User ID and password are required');
      setLoading(false);
      return;
    }

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = login(formData.userId, formData.password, isAdmin);
    
    if (success) {
      navigate(isAdmin ? '/admin' : '/');
    } else {
      setError('Invalid credentials. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EventHub
            </span>
          </Link>
          <h1 className="text-3xl mb-2 text-gray-800">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">
              {isAdmin ? 'Admin Login' : 'Student Login'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* User ID */}
              <div className="space-y-2">
                <Label htmlFor="userId">User ID *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="userId"
                    type="text"
                    placeholder={isAdmin ? "admin" : "Enter your user ID"}
                    value={formData.userId}
                    onChange={(e) => handleInputChange('userId', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isAdmin ? "admin123" : "Enter your password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Optional fields for students */}
              {!isAdmin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="walletId">Wallet ID (Optional)</Label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="walletId"
                        type="text"
                        placeholder="Enter wallet ID"
                        value={formData.walletId}
                        onChange={(e) => handleInputChange('walletId', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department (Optional)</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="department"
                          type="text"
                          placeholder="e.g. CS, EE"
                          value={formData.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year (Optional)</Label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="year"
                          type="text"
                          placeholder="e.g. 1st, 2nd"
                          value={formData.year}
                          onChange={(e) => handleInputChange('year', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Toggle Admin Login */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdmin(!isAdmin);
                    setFormData({
                      userId: '',
                      password: '',
                      walletId: '',
                      department: '',
                      year: ''
                    });
                    setError('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {isAdmin ? 'Switch to Student Login' : 'Admin Login'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20"
        >
          <h3 className="text-sm text-gray-600 mb-2">Demo Credentials:</h3>
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Student:</strong> student1 / pass123</p>
            <p><strong>Admin:</strong> admin / admin123</p>
          </div>
        </motion.div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-800">
            ← Back to Events
          </Link>
        </div>
      </motion.div>
    </div>
  );
}