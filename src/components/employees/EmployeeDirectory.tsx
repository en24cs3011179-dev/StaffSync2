import React, { useState } from 'react';
import { User, EmployeeDetails, UserRole } from '../../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building,
  Calendar,
  X,
  Check,
  Shield,
  DollarSign,
  Briefcase,
} from 'lucide-react';

interface EmployeeDirectoryProps {
  currentUser: User;
  users: User[];
  onAddEmployee: (data: Partial<User> & { salary?: number; skills?: string[] }) => User;
  onUpdateEmployee: (userId: string, data: Partial<User>, details?: Partial<EmployeeDetails>) => void;
  onDeleteEmployee: (userId: string) => void;
  getEmployeeDetails: (userId: string) => EmployeeDetails;
}

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({
  currentUser,
  users,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  getEmployeeDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  // Add form fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('employee');
  const [formDept, setFormDept] = useState('Engineering');
  const [formDesignation, setFormDesignation] = useState('');
  const [formSalary, setFormSalary] = useState('125000');
  const [formSkills, setFormSkills] = useState('TypeScript, React, Cloud');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.designation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || u.department === selectedDept;
    const matchesRole = selectedRole === 'All' || u.role === selectedRole.toLowerCase();

    return matchesSearch && matchesDept && matchesRole;
  });

  const departments = ['All', 'Engineering', 'Product Design', 'Human Resources', 'Marketing', 'Finance & Legal'];

  const handleOpenAdd = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('+1 (555) 000-0000');
    setFormRole('employee');
    setFormDept('Engineering');
    setFormDesignation('');
    setFormSalary('120000');
    setFormSkills('Collaboration, Technical Excellence');
    setIsAddModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    onAddEmployee({
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      role: formRole,
      department: formDept,
      designation: formDesignation || 'Specialist',
      salary: Number(formSalary) || 100000,
      skills: formSkills.split(',').map((s) => s.trim()).filter(Boolean),
    });

    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPhone(user.phone);
    setFormRole(user.role);
    setFormDept(user.department);
    setFormDesignation(user.designation);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    onUpdateEmployee(editingUser.id, {
      name: formName,
      email: formEmail,
      phone: formPhone,
      role: formRole,
      department: formDept,
      designation: formDesignation,
    });

    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {currentUser.role === 'manager' ? 'Department Team Directory' : 'Organization Employee Directory'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse, manage, and inspect complete personnel records and employment profiles.
          </p>
        </div>

        {currentUser.role === 'hr' && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Employee</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, title, or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Dept:</span>
          </div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 ml-1"
          >
            <option value="All">All Roles</option>
            <option value="hr">HR Personnel</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department & Title</th>
                <th className="py-3 px-4">Join Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No matching employee records found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    {/* User */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                            {u.name.substring(0, 2)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* ID */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-600">
                      {u.employeeId}
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-[11px] uppercase tracking-wide px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {u.role}
                      </span>
                    </td>

                    {/* Department & Title */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{u.designation}</div>
                      <div className="text-[11px] text-slate-500">{u.department}</div>
                    </td>

                    {/* Join Date */}
                    <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">
                      {u.joinDate}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-emerald-700">
                        {u.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingUser(u)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {currentUser.role === 'hr' && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(u)}
                              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                              title="Edit Employee"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete ${u.name}?`)) {
                                  onDeleteEmployee(u.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Add New Team Member</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Rachel Adams"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="rachel.adams@korehr.internal"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="hr">HR Personnel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance & Legal">Finance & Legal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={formDesignation}
                    onChange={(e) => setFormDesignation(e.target.value)}
                    placeholder="e.g. Backend Engineer"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Base Salary (USD)</label>
                  <input
                    type="number"
                    value={formSalary}
                    onChange={(e) => setFormSalary(e.target.value)}
                    placeholder="120000"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={formSkills}
                  onChange={(e) => setFormSkills(e.target.value)}
                  placeholder="e.g. Python, AWS, Docker, Kubernetes"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Edit Employee: {editingUser.name}</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="hr">HR Personnel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance & Legal">Finance & Legal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={formDesignation}
                  onChange={(e) => setFormDesignation(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Update Information
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Profile Drawer / Modal */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                {viewingUser.avatar ? (
                  <img
                    src={viewingUser.avatar}
                    alt={viewingUser.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-base">
                    {viewingUser.name.substring(0, 2)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-base text-slate-900">{viewingUser.name}</h3>
                  <div className="text-xs text-slate-500">
                    {viewingUser.designation} · {viewingUser.department}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingUser(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            {(() => {
              const details = getEmployeeDetails(viewingUser.id);
              return (
                <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
                  {/* Basic Identifiers */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-semibold">Employee ID</div>
                      <div className="font-mono font-bold text-slate-900">{viewingUser.employeeId}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-semibold">Role</div>
                      <div className="capitalize font-semibold text-slate-900">{viewingUser.role}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-semibold">Join Date</div>
                      <div className="font-mono tabular-nums text-slate-900">{viewingUser.joinDate}</div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xs mb-2">Contact & Location</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                        <span className="text-[11px] text-slate-400 block">Email Address</span>
                        <span className="font-medium font-mono text-slate-800">{viewingUser.email}</span>
                      </div>
                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                        <span className="text-[11px] text-slate-400 block">Phone</span>
                        <span className="font-medium text-slate-800">{viewingUser.phone}</span>
                      </div>
                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg sm:col-span-2">
                        <span className="text-[11px] text-slate-400 block">Residential Address</span>
                        <span className="font-medium text-slate-800">{details.personalInfo.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compensation & Bank Info (Protected View) */}
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xs mb-2 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Compensation & Payroll</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-[11px] text-slate-400 block">Annual Base Salary</span>
                        <span className="font-bold text-slate-900 font-mono tabular-nums">
                          ${details.compensation.baseSalary.toLocaleString()} {details.compensation.currency}
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-[11px] text-slate-400 block">Direct Deposit Account</span>
                        <span className="font-medium text-slate-800">
                          {details.compensation.bankName} ({details.compensation.accountNumber})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xs mb-2">Emergency Contact</h4>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-800">{details.personalInfo.emergencyContact.name}</span>
                        <span className="text-slate-400 ml-2">({details.personalInfo.emergencyContact.relation})</span>
                      </div>
                      <span className="font-mono text-slate-600">{details.personalInfo.emergencyContact.phone}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xs mb-2">Competencies & Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {details.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md text-[11px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
