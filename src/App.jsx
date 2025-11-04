import React, { useState, useEffect } from 'react';
import { Upload, Download, Lock, Unlock, Share2, Trash2, Eye, EyeOff, Shield, Key, Users, FileText, Search, Filter, Clock } from 'lucide-react';

const SecureFileSharing = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [mainView, setMainView] = useState('files');
  const [selectedFile, setSelectedFile] = useState(null);
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('view');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Initialize with demo users
  useEffect(() => {
    const demoUsers = [
      { id: '1', email: 'alice@example.com', password: 'demo123', name: 'Alice Johnson' },
      { id: '2', email: 'bob@example.com', password: 'demo123', name: 'Bob Smith' },
    ];
    setUsers(demoUsers);
  }, []);

  // Simple encryption simulation
  const encryptData = (data) => {
    return btoa(JSON.stringify(data));
  };

  const decryptData = (encryptedData) => {
    try {
      return JSON.parse(atob(encryptedData));
    } catch {
      return null;
    }
  };

  const handleRegister = () => {
    if (!registerEmail || !registerPassword || !registerName) {
      alert('Please fill all fields');
      return;
    }
    
    if (users.find(u => u.email === registerEmail)) {
      alert('User already exists');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      email: registerEmail,
      password: registerPassword,
      name: registerName
    };
    
    setUsers([...users, newUser]);
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterName('');
    alert('Registration successful! Please login.');
    setActiveTab('login');
  };

  const handleLogin = () => {
    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
    
    if (user) {
      setCurrentUser(user);
      setLoginEmail('');
      setLoginPassword('');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMainView('files');
    setSelectedFile(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      encrypted: true,
      encryptedContent: encryptData({ name: file.name, size: file.size })
    };

    setFiles([...files, fileData]);
    e.target.value = '';
  };

  const handleShareFile = () => {
    if (!selectedFile || !shareEmail) {
      alert('Please select a file and enter an email');
      return;
    }

    const targetUser = users.find(u => u.email === shareEmail);
    if (!targetUser) {
      alert('User not found');
      return;
    }

    if (targetUser.id === currentUser.id) {
      alert('Cannot share with yourself');
      return;
    }

    const shareData = {
      id: Date.now().toString(),
      fileId: selectedFile.id,
      fileName: selectedFile.name,
      ownerId: selectedFile.ownerId,
      ownerName: selectedFile.ownerName,
      sharedWithId: targetUser.id,
      sharedWithEmail: targetUser.email,
      permission: sharePermission,
      sharedAt: new Date().toISOString()
    };

    setSharedFiles([...sharedFiles, shareData]);
    setShareEmail('');
    setSelectedFile(null);
    alert('File shared successfully!');
  };

  const handleDeleteFile = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setFiles(files.filter(f => f.id !== fileId));
      setSharedFiles(sharedFiles.filter(s => s.fileId !== fileId));
      setSelectedFile(null);
    }
  };

  const getMyFiles = () => {
    return files.filter(f => f.ownerId === currentUser.id);
  };

  const getSharedWithMe = () => {
    return sharedFiles.filter(s => s.sharedWithId === currentUser.id);
  };

  const filteredFiles = () => {
    let fileList = mainView === 'files' ? getMyFiles() : getSharedWithMe().map(s => {
      const file = files.find(f => f.id === s.fileId);
      return file ? { ...file, permission: s.permission, sharedBy: s.ownerName } : null;
    }).filter(Boolean);

    if (searchTerm) {
      fileList = fileList.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (filterType !== 'all') {
      fileList = fileList.filter(f => f.type.includes(filterType));
    }

    return fileList;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-center mb-2">
              <Shield className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-bold text-center">Secure Cloud Storage</h1>
            <p className="text-blue-100 text-center text-sm mt-2">End-to-end encrypted file sharing</p>
          </div>

          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 font-semibold ${activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 font-semibold ${activeTab === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Register
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'login' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition"
                >
                  Login
                </button>
                <p className="text-sm text-gray-600 text-center mt-4">
                  Demo: alice@example.com / demo123
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  onClick={handleRegister}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Secure Cloud Storage</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {currentUser.name}</span>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setMainView('files')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
              mainView === 'files'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>My Files</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">{getMyFiles().length}</span>
          </button>
          <button
            onClick={() => setMainView('shared')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
              mainView === 'shared'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Shared with Me</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">{getSharedWithMe().length}</span>
          </button>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {mainView === 'files' && (
              <label className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition">
                <Upload className="w-5 h-5" />
                <span>Upload File</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
            
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search files..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="pdf">PDF</option>
              <option value="text">Text</option>
              <option value="video">Video</option>
            </select>
          </div>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles().map((file) => (
            <div key={file.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 truncate">{file.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <Lock className="w-5 h-5 text-green-500" />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatDate(file.uploadedAt)}
                </div>
                {file.sharedBy && (
                  <div className="flex items-center text-xs text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    Shared by {file.sharedBy}
                  </div>
                )}
                {file.permission && (
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    file.permission === 'edit' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {file.permission === 'edit' ? 'Can Edit' : 'View Only'}
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                {mainView === 'files' && (
                  <>
                    <button
                      onClick={() => setSelectedFile(file)}
                      className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="flex items-center justify-center bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                {mainView === 'shared' && file.permission === 'view' && (
                  <button className="flex-1 flex items-center justify-center space-x-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition text-sm">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredFiles().length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No files found</p>
            <p className="text-gray-500 text-sm mt-2">
              {mainView === 'files' ? 'Upload your first file to get started' : 'No files have been shared with you yet'}
            </p>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Share File</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-600 mt-1">{formatFileSize(selectedFile.size)}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Share with (email)</label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="colleague@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permission</label>
                <select
                  value={sharePermission}
                  onChange={(e) => setSharePermission(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="view">View Only</option>
                  <option value="edit">Can Edit</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleShareFile}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Share
                </button>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecureFileSharing;