 import React, { useState, useEffect } from 'react';
import { authHeader } from '../utils/auth';
import { Plus, Edit, Trash2, Search, User, Users, UserCheck, Shield, LogOut, Key } from 'lucide-react';

const CollegeAdminPage = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State for all entities
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [hods, setHods] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [parents, setParents] = useState([]);

  // Get token from localStorage
  const getToken = () => localStorage.getItem('token');

  // API base URL
  const API_BASE = 'http://localhost:5000/api';

  // Generate development token (for bypassing login)
  const generateDevToken = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/dev/generate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: 'admin' })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        alert('✅ Development token generated! You can now add students.');
        loadData(); // Refresh data
      } else {
        setError(data.message || 'Failed to generate token');
        alert('❌ ' + (data.message || 'Failed to generate token'));
      }
    } catch (err) {
      setError('Network error. Please check if the backend server is running.');
      alert('⚠️ Network error. Please check if the backend server is running.');
      console.error('Token generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data from backend
  const fetchData = async (endpoint, setter) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        }
      });

      const data = await response.json();

      if (response.status === 401) {
        // Token invalid or expired
        localStorage.removeItem('token');
        setError('Authentication failed. Token invalid or expired. Please generate a new development token.');
        return;
      }

      if (data.success) {
        setter(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error. Please check if the backend server is running.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (getToken()) {
      loadData();
    } else {
      setError('No authentication token found. Please generate a development token.');
    }
  }, []);

  const loadData = () => {
    fetchData('admin/students', setStudents);
    fetchData('admin/staff', setStaff);
    fetchData('admin/hods', setHods);
    fetchData('admin/wardens', setWardens);
    fetchData('admin/parents', setParents);
  };

  // Helper function to get email by ID (for backward compatibility)
  const getEmailById = (id, type) => {
    let entity;
    switch (type) {
      case 'staff':
        entity = staff.find(s => s._id === id);
        break;
      case 'hod':
        entity = hods.find(h => h._id === id);
        break;
      case 'warden':
        entity = wardens.find(w => w._id === id);
        break;
      default:
        return '';
    }
    return entity ? entity.email : '';
  };

  // Helper function to get parent name by ID
  const getParentNameById = (id) => {
    const parent = parents.find(p => p._id === id);
    return parent ? parent.name : '';
  };

  // Helper function to get parent email by ID
  const getParentEmailById = (id) => {
    const parent = parents.find(p => p._id === id);
    return parent ? parent.email : '';
  };

  // Form state
  const [formData, setFormData] = useState({});

    const initializeFormData = (type) => {
    const baseForm = {
      name: '',
      email: '',
      phone: '',
      address: ''
    };

    switch (type) {
      case 'students':
        return {
          ...baseForm,
          registrationNumber: '',
          department: '',
          year: '',
          parentId: '',
          staffId: '',
          hodId: '',
          wardenId: '',
          hostelType: ''
        };
      case 'staff':
      case 'hods':
        return {
          ...baseForm,
          username: '',
          department: ''
        };
    case 'wardens':
      return {
        ...baseForm,
        username: '',
        hostelType: ''
      };
      default:
        return baseForm;
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      let editData = { ...item };
      // Add similar for other flat models if needed
      setFormData(editData);
    } else {
      setFormData(initializeFormData(activeTab));
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  // Validation constants (move above handleSubmit to fix ReferenceError)
  const alphaNumRegex = /^[a-zA-Z0-9]+$/;
  const nameRegex = /^[a-zA-Z\s]{2,}$/;
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const phoneRegex = /^\d{10}$/;
  const objectIdRegex = /^[a-fA-F0-9]{24}$/;
  const allowedDepartments = [
    'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology'
  ];

  // Handle form submission - FIXED VERSION
  const handleSubmit = async () => {
    const errors = [];
    if (activeTab === 'staff') {
      if (!formData.username || formData.username.length < 3) {
        errors.push('Username is required and must be at least 3 characters.');
      }
      if (!formData.name || !nameRegex.test(formData.name)) {
        errors.push('Name is required, min 2 characters, letters and spaces only.');
      }
      if (!formData.email || !emailRegex.test(formData.email)) {
        errors.push('Valid email is required.');
      }
      if (!formData.phone || !phoneRegex.test(formData.phone)) {
        errors.push('Valid phone number is required (10 digits).');
      }
      if (!formData.department || !allowedDepartments.includes(formData.department)) {
        errors.push('Department is required and must be valid.');
      }
      if (!formData.address || formData.address.length < 5) {
        errors.push('Address is required and must be at least 5 characters.');
      }
    } else if (activeTab === 'hods') {
      if (!formData.username || formData.username.length < 3) {
        errors.push('Username is required and must be at least 3 characters.');
      }
      if (!formData.name || !nameRegex.test(formData.name)) {
        errors.push('Name is required, min 2 characters, letters and spaces only.');
      }
      if (!formData.email || !emailRegex.test(formData.email)) {
        errors.push('Valid email is required.');
      }
      if (!formData.phone || !phoneRegex.test(formData.phone)) {
        errors.push('Valid phone number is required (10 digits).');
      }
      if (!formData.department || !allowedDepartments.includes(formData.department)) {
        errors.push('Department is required and must be valid.');
      }
      if (!formData.address || formData.address.length < 5) {
        errors.push('Address is required and must be at least 5 characters.');
      }
    } else if (activeTab === 'wardens') {
      if (!formData.username || formData.username.length < 3) {
        errors.push('Username is required and must be at least 3 characters.');
      }
      if (!formData.name || !nameRegex.test(formData.name)) {
        errors.push('Name is required, min 2 characters, letters and spaces only.');
      }
      if (!formData.email || !emailRegex.test(formData.email)) {
        errors.push('Valid email is required.');
      }
      if (!formData.phone || !phoneRegex.test(formData.phone)) {
        errors.push('Valid phone number is required (10 digits).');
      }
      if (!formData.address || formData.address.length < 5) {
        errors.push('Address is required and must be at least 5 characters.');
      }
      if (!formData.hostelType || formData.hostelType.trim() === '') {
        errors.push('Hostel type is required.');
      }
    }

    if (activeTab === 'students') {
      if (!formData.registrationNumber || !alphaNumRegex.test(formData.registrationNumber)) {
        errors.push('Registration number is required and must be alphanumeric.');
      }
      if (!formData.name || !nameRegex.test(formData.name)) {
        errors.push('Name is required, min 2 characters, letters and spaces only.');
      }
      if (!formData.email || !emailRegex.test(formData.email)) {
        errors.push('Valid email is required.');
      }
      if (!formData.phone || !phoneRegex.test(formData.phone)) {
        errors.push('Valid phone number is required (10 digits).');
      }
      if (!formData.department || !allowedDepartments.includes(formData.department)) {
        errors.push('Department is required and must be valid.');
      }
      if (!formData.year || !(formData.year >= 1 && formData.year <= 4)) {
        errors.push('Year is required and must be between 1 and 4.');
      }
      if (!formData.address || formData.address.length < 5) {
        errors.push('Address is required and must be at least 5 characters.');
      }
      if (!formData.parentId || !objectIdRegex.test(formData.parentId)) {
        errors.push('Valid parent ID is required.');
      }
      if (!formData.staffId || !objectIdRegex.test(formData.staffId)) {
        errors.push('Valid staff ID is required.');
      }
      if (!formData.hodId || !objectIdRegex.test(formData.hodId)) {
        errors.push('Valid HOD ID is required.');
      }
      if (!formData.wardenId || !objectIdRegex.test(formData.wardenId)) {
        errors.push('Valid warden ID is required.');
      }
      if (!formData.hostelType || !['Boys', 'Girls'].includes(formData.hostelType)) {
        errors.push('Valid hostel type is required (Boys or Girls).');
      }
    } else if (activeTab === 'parents') {
      if (!formData.username || formData.username.length < 3) {
        errors.push('Username is required and must be at least 3 characters.');
      }
      if (!formData.studentName || formData.studentName.length < 2) {
        errors.push('Student name is required and must be at least 2 characters.');
      }
      if (!formData.studentRegistrationNumber || !alphaNumRegex.test(formData.studentRegistrationNumber)) {
        errors.push('Student registration number is required and must be alphanumeric.');
      }
      if (!formData.relationship || !['Father','Mother','Guardian'].includes(formData.relationship)) {
        errors.push('Relationship must be Father, Mother, or Guardian.');
      }
      if (!formData.name || !nameRegex.test(formData.name)) {
        errors.push('Parent name is required, min 2 characters, letters and spaces only.');
      }
      if (!formData.email || !emailRegex.test(formData.email)) {
        errors.push('Valid parent email is required.');
      }
      if (!formData.phone || !phoneRegex.test(formData.phone)) {
        errors.push('Valid parent mobile is required (10 digits).');
      }
      if (!formData.address || formData.address.length < 5) {
        errors.push('Address is required and must be at least 5 characters.');
      }
      if (formData.occupation && formData.occupation.length < 2) {
        errors.push('Occupation must be at least 2 characters if provided.');
      }
    }

    if (errors.length > 0) {
      alert('Validation errors:\n' + errors.join('\n'));
      return;
    }

    try {
      setLoading(true);
      const token = getToken();

      if (!token) {
        setError('No authentication token found. Please generate a development token first.');
        return;
      }

      let endpoint = '';
      let method = 'POST';
      let successMessage = '';

      if (editingItem) {
        method = 'PUT';
        switch (activeTab) {
          case 'students':
            endpoint = `admin/students/${editingItem._id}`;
            successMessage = 'Student updated successfully';
            break;
          case 'staff':
            endpoint = `admin/staff/${editingItem._id}`;
            successMessage = 'Staff member updated successfully';
            break;
          case 'hods':
            endpoint = `admin/hods/${editingItem._id}`;
            successMessage = 'HOD updated successfully';
            break;
          case 'wardens':
            endpoint = `admin/wardens/${editingItem._id}`;
            successMessage = 'Warden updated successfully';
            break;
          case 'parents':
            endpoint = `admin/parents/${editingItem._id}`;
            successMessage = 'Parent updated successfully';
            break;
          default:
            endpoint = `admin/students/${editingItem._id}`;
            successMessage = 'Item updated successfully';
        }
      } else {
        // Use correct endpoint based on active tab
        switch (activeTab) {
          case 'students':
            endpoint = 'admin/students';
            successMessage = 'Student created successfully';
            break;
          case 'staff':
            endpoint = 'admin/staff';
            successMessage = 'Staff member created successfully';
            break;
          case 'hods':
            endpoint = 'admin/hods';
            successMessage = 'HOD created successfully';
            break;
          case 'wardens':
            endpoint = 'admin/wardens';
            successMessage = 'Warden created successfully';
            break;
          case 'parents':
            endpoint = 'admin/parents';
            successMessage = 'Parent created successfully';
            break;
          default:
            endpoint = 'admin/students';
            successMessage = 'Item created successfully';
        }
      }

      // Debug log for staff submission
      if (activeTab === 'staff' && !editingItem) {
        console.log('Submitting staff formData:', formData);
      }

      const response = await fetch(`${API_BASE}/${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert(successMessage);
        closeModal();
        loadData(); // Refresh data
      } else {
        setError(data.message || 'Operation failed');
        alert('Error: ' + (data.message || 'Operation failed'));
      }
    } catch (err) {
      setError('Network error');
      alert('Network error. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (item) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setLoading(true);
      const token = getToken();

      if (!token) {
        setError('No authentication token found. Please generate a development token first.');
        return;
      }


      let deleteEndpoint = '';
      switch (activeTab) {
        case 'students':
          deleteEndpoint = `admin/students/${item._id}`;
          break;
        case 'staff':
          deleteEndpoint = `admin/staff/${item._id}`;
          break;
        case 'hods':
          deleteEndpoint = `admin/hods/${item._id}`;
          break;
        case 'wardens':
          deleteEndpoint = `admin/wardens/${item._id}`;
          break;
        case 'parents':
          deleteEndpoint = `admin/parents/${item._id}`;
          break;
        default:
          deleteEndpoint = `admin/students/${item._id}`;
      }

      const response = await fetch(`${API_BASE}/${deleteEndpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('Item deleted successfully');
        loadData(); // Refresh data
      } else {
        setError(data.message || 'Delete operation failed');
        alert('Error: ' + (data.message || 'Delete operation failed'));
      }
    } catch (err) {
      setError('Network error');
      alert('Network error. Please try again.');
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'students': return students;
      case 'staff': return staff;
      case 'hods': return hods;
      case 'wardens': return wardens;
      case 'parents': return parents;
      default: return [];
    }
  };

  const filteredData = getCurrentData().filter(item =>
    Object.values(item).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const renderForm = () => {
    const commonFields = (
      <>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name || ''}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email || ''}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone || ''}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address || ''}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </>
    );

    if (activeTab === 'students') {
      return (
        <div className="space-y-4">
          {commonFields}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="registrationNumber"
              placeholder="Registration Number"
              value={formData.registrationNumber || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <select
              name="department"
              value={formData.department || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="year"
              value={formData.year || ''}
              onChange={e => {
                setFormData({
                  ...formData,
                  year: e.target.value ? parseInt(e.target.value) : ''
                });
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Year</option>
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
            </select>
            <select
              name="parentId"
              value={formData.parentId || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Parent</option>
              {parents.map(p => (
                <option key={p._id} value={p._id}>{p.username}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <select
              name="staffId"
              value={formData.staffId || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Staff</option>
              {staff.map(s => (
                <option key={s._id} value={s._id}>{s.username} ({s._id.slice(-6)})</option>
              ))}
            </select>
            <select
              name="hodId"
              value={formData.hodId || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select HOD</option>
              {hods.map(h => (
                <option key={h._id} value={h._id}>{h.username} ({h._id.slice(-6)})</option>
              ))}
            </select>
            <select
              name="wardenId"
              value={formData.wardenId || ''}
              onChange={(e) => {
                const selectedWardenId = e.target.value;
                setFormData({
                  ...formData,
                  wardenId: selectedWardenId
                });
                // Auto-set hostelType based on selected warden
                if (selectedWardenId) {
                  const selectedWarden = wardens.find(w => w._id === selectedWardenId);
                  if (selectedWarden && selectedWarden.hostelType) {
                    setFormData(prev => ({
                      ...prev,
                      hostelType: selectedWarden.hostelType
                    }));
                  }
                } else {
                  setFormData(prev => ({
                    ...prev,
                    hostelType: ''
                  }));
                }
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Warden</option>
              {wardens.map(w => (
                <option key={w._id} value={w._id}>{w.username} ({w._id.slice(-6)})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <select
              name="hostelType"
              value={formData.hostelType || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Hostel Type</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
            </select>
          </div>
        </div>
      );
    }

    if (activeTab === 'staff' || activeTab === 'hods') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID (Username) - Unique identifier for this staff member</label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <select
              name="department"
              value={formData.department || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>
          {commonFields}
        </div>
      );
    }

    if (activeTab === 'wardens') {
      return (
        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username || ''}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {commonFields}
          <input
            type="text"
            name="hostelType"
            placeholder="Hostel Type"
            value={formData.hostelType || ''}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      );
    }

    if (activeTab === 'parents') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              name="studentName"
              placeholder="Student Name"
              value={formData.studentName || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="studentRegistrationNumber"
              placeholder="Student Registration Number"
              value={formData.studentRegistrationNumber || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              name="relationship"
              placeholder="Relationship (Father/Mother/Guardian)"
              value={formData.relationship || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          {commonFields}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              value={formData.occupation || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      );
    }
  };

  const renderTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading...</div>
        </div>
      );
    }

    if (error && !getToken()) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-yellow-800 mb-3">{error}</div>
          <button
            onClick={generateDevToken}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Key size={16} />
            <span>Generate Development Token</span>
          </button>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
          <button
            onClick={loadData}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      );
    }

    if (activeTab === 'students') {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reg No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">HOD Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warden Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{student.registrationNumber}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{student.department}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{student.email}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{student.phone}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{getParentEmailById(student.parentId)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{getEmailById(student.hodId, 'hod')}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{getEmailById(student.wardenId, 'warden')}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(student)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(student)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'parents') {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Reg No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Relationship</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occupation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((parent, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{parent.profile?.studentName || 'N/A'}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{parent.profile?.studentRegistrationNumber || 'N/A'}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{parent.profile?.name || parent.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{parent.email}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{parent.profile?.phone || parent.phone}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{parent.profile?.relationship || 'N/A'}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{parent.profile?.occupation || 'N/A'}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(parent)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(parent)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Table for staff, hods, wardens
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff ID</th>
              {(activeTab === 'staff' || activeTab === 'hods') && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => {
              // Debug log for staff items
              if (activeTab === 'staff') {
                console.log('Staff item data:', item);
                console.log('Staff username:', item.username);
              }

              // For staff (Tutor), use flat fields; fallback for other entities
              const displayName = item.profile?.name || item.name || item.username || 'N/A';
              const displayUsername = item.username || 'No ID assigned';
              const displayDepartment = (activeTab === 'staff' || activeTab === 'hods') ? (item.profile?.department || item.department || 'N/A') : null;
              const displayPhone = item.profile?.phone || item.phone || 'N/A';
              const displayAddress = item.profile?.address || item.address || 'N/A';

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{displayName}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{displayUsername}</td>
                  {displayDepartment && (
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{displayDepartment}</td>
                  )}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.email}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{displayPhone}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{displayAddress}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'students': return <User size={20} />;
      case 'staff': return <Users size={20} />;
      case 'hods': return <UserCheck size={20} />;
      case 'wardens': return <Shield size={20} />;
      case 'parents': return <Users size={20} />;
      default: return <User size={20} />;
    }
  };

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'students': return 'Students';
      case 'staff': return 'Staff';
      case 'hods': return 'HODs';
      case 'wardens': return 'Wardens';
      case 'parents': return 'Parents';
      default: return 'Students';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                National Engineering College
              </h1>
              <p className="text-lg md:text-xl text-blue-200 mb-2">
                (An Autonomous Institution - Affiliated to Anna University, Chennai)
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Panel Title */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h2 className="text-2xl font-bold text-gray-800">Admin Management Panel</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {['students', 'staff', 'hods', 'wardens', 'parents'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {getTabIcon(tab)}
                  <span>{getTabLabel(tab)}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Controls */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={`Search ${getTabLabel(activeTab).toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              <button
                onClick={() => openModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus size={20} />
                <span>Add {getTabLabel(activeTab).slice(0, -1)}</span>
              </button>
            </div>

            {/* Table */}
            {renderTable()}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingItem ? 'Edit' : 'Add'} {getTabLabel(activeTab).slice(0, -1)}
              </h3>
            </div>

            <div className="p-6">
              {renderForm()}

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : (editingItem ? 'Update' : 'Add')} {getTabLabel(activeTab).slice(0, -1)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeAdminPage;
