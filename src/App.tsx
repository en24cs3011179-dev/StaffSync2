import React, { useState, useEffect } from 'react';
import {
  User,
  EmployeeDetails,
  AttendanceRecord,
  LeaveRequest,
  Announcement,
  TrainingProgram,
  NotificationItem,
  WorkType,
  LeaveType,
  LeaveStatus,
  AnnouncementCategory,
  PriorityLevel,
  TrainingCategory,
} from './types';
import { hrmService } from './services/hrmDataService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { NotificationModal } from './components/NotificationModal';
import { HRDashboard } from './components/dashboards/HRDashboard';
import { ManagerDashboard } from './components/dashboards/ManagerDashboard';
import { EmployeeDashboard } from './components/dashboards/EmployeeDashboard';
import { EmployeeDirectory } from './components/employees/EmployeeDirectory';
import { AttendanceView } from './components/attendance/AttendanceView';
import { LeaveManagementView } from './components/leaves/LeaveManagementView';
import { AnnouncementsView } from './components/announcements/AnnouncementsView';
import { TrainingsView } from './components/trainings/TrainingsView';
import { ReportsView } from './components/reports/ReportsView';
import { SystemTestsView } from './components/testing/SystemTestsView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const session = hrmService.getCurrentSession();
    return session ? session.user : hrmService.getUsers()[0];
  });

  const [users, setUsers] = useState<User[]>(() => hrmService.getUsers());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => hrmService.getAttendance());
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => hrmService.getLeaves());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => hrmService.getAnnouncements());
  const [trainings, setTrainings] = useState<TrainingProgram[]>(() => hrmService.getTrainings());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    hrmService.getNotificationsForUser(currentUser.id)
  );

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isApplyLeaveModalOpen, setIsApplyLeaveModalOpen] = useState(false);

  // Sync notifications whenever user changes
  useEffect(() => {
    setNotifications(hrmService.getNotificationsForUser(currentUser.id));
  }, [currentUser]);

  // Refresh all state helper
  const refreshState = () => {
    setUsers(hrmService.getUsers());
    setAttendance(hrmService.getAttendance());
    setLeaves(hrmService.getLeaves());
    setAnnouncements(hrmService.getAnnouncements());
    setTrainings(hrmService.getTrainings());
    setNotifications(hrmService.getNotificationsForUser(currentUser.id));
  };

  // Role Switching
  const handleRoleSwitch = (role: 'hr' | 'manager' | 'employee') => {
    const targetUser = hrmService.switchRole(role);
    setCurrentUser(targetUser);
    refreshState();
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    refreshState();
  };

  const handleLogout = () => {
    setIsAuthModalOpen(true);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all HRM database tables to initial corporate seed state?')) {
      hrmService.resetToFactoryDefaults();
      const session = hrmService.getCurrentSession();
      if (session) setCurrentUser(session.user);
      refreshState();
    }
  };

  // Clock In / Clock Out
  const handleClockIn = (workType: WorkType) => {
    hrmService.clockIn(currentUser, workType);
    refreshState();
  };

  const handleClockOut = () => {
    hrmService.clockOut(currentUser.employeeId);
    refreshState();
  };

  // Leave Actions
  const handleApplyLeave = (data: {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    const res = hrmService.applyLeave(currentUser, data);
    refreshState();
    return res;
  };

  const handleReviewLeave = (leaveId: string, status: LeaveStatus, remarks?: string) => {
    hrmService.reviewLeave(leaveId, status, currentUser, remarks);
    refreshState();
  };

  // Employee CRUD
  const handleAddEmployee = (data: Partial<User> & { salary?: number; skills?: string[] }) => {
    const newUser = hrmService.addEmployee(data);
    refreshState();
    return newUser;
  };

  const handleUpdateEmployee = (
    userId: string,
    data: Partial<User>,
    details?: Partial<EmployeeDetails>
  ) => {
    hrmService.updateEmployee(userId, data, details);
    refreshState();
  };

  const handleDeleteEmployee = (userId: string) => {
    hrmService.deleteEmployee(userId);
    refreshState();
  };

  // Announcements
  const handleCreateAnnouncement = (data: {
    title: string;
    category: AnnouncementCategory;
    content: string;
    targetRole: Announcement['targetRole'];
    priority: PriorityLevel;
    isPinned?: boolean;
  }) => {
    hrmService.createAnnouncement(currentUser, data);
    refreshState();
  };

  const handleDeleteAnnouncement = (id: string) => {
    hrmService.deleteAnnouncement(id);
    refreshState();
  };

  // Trainings
  const handleToggleEnrollTraining = (trainingId: string) => {
    hrmService.toggleEnrollment(trainingId, currentUser.employeeId);
    refreshState();
  };

  const handleCreateTraining = (data: {
    title: string;
    category: TrainingCategory;
    instructor: string;
    durationHours: number;
    scheduleDate: string;
    maxParticipants: number;
    description: string;
    learningOutcomes: string[];
  }) => {
    hrmService.createTraining(data);
    refreshState();
  };

  // Notifications
  const handleMarkNotifRead = (id: string) => {
    hrmService.markNotificationAsRead(id);
    refreshState();
  };

  const handleMarkAllNotifsRead = () => {
    hrmService.markAllNotificationsAsRead(currentUser.id);
    refreshState();
  };

  // Computed data
  const employeeDetails = hrmService.getEmployeeDetails(currentUser.id);
  const todayAttendance = hrmService.getTodayAttendance(currentUser.employeeId);
  const myAttendance = hrmService.getAttendanceForUser(currentUser.employeeId);
  const myLeaves = hrmService.getLeavesForUser(currentUser.employeeId);
  const analytics = hrmService.getAnalytics();
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onResetData={handleResetData}
        onLogout={handleLogout}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Bar Header */}
        <Header
          currentUser={currentUser}
          onRoleSwitch={handleRoleSwitch}
          onOpenNotifications={() => setIsNotifModalOpen(true)}
          unreadCount={unreadNotifCount}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          activeTab={activeTab}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* View 1: Dashboard (Role-specific view) */}
            {activeTab === 'dashboard' && (
              <>
                {currentUser.role === 'hr' && (
                  <HRDashboard
                    currentUser={currentUser}
                    analytics={analytics}
                    todayAttendance={attendance}
                    leaves={leaves}
                    announcements={announcements}
                    onNavigateTab={setActiveTab}
                    onReviewLeave={handleReviewLeave}
                  />
                )}

                {currentUser.role === 'manager' && (
                  <ManagerDashboard
                    currentUser={currentUser}
                    users={users}
                    todayAttendance={attendance}
                    leaves={leaves}
                    trainings={trainings}
                    onNavigateTab={setActiveTab}
                    onReviewLeave={handleReviewLeave}
                  />
                )}

                {currentUser.role === 'employee' && (
                  <EmployeeDashboard
                    currentUser={currentUser}
                    employeeDetails={employeeDetails}
                    todayAttendance={todayAttendance}
                    myAttendance={myAttendance}
                    myLeaves={myLeaves}
                    trainings={trainings}
                    announcements={announcements}
                    onClockIn={handleClockIn}
                    onClockOut={handleClockOut}
                    onNavigateTab={setActiveTab}
                    onOpenApplyLeave={() => setIsApplyLeaveModalOpen(true)}
                  />
                )}
              </>
            )}

            {/* View 2: Employee Directory */}
            {activeTab === 'employees' && (
              <EmployeeDirectory
                currentUser={currentUser}
                users={users}
                onAddEmployee={handleAddEmployee}
                onUpdateEmployee={handleUpdateEmployee}
                onDeleteEmployee={handleDeleteEmployee}
                getEmployeeDetails={(id) => hrmService.getEmployeeDetails(id)}
              />
            )}

            {/* View 3: Attendance Logs & Punch */}
            {activeTab === 'attendance' && (
              <AttendanceView
                currentUser={currentUser}
                attendance={attendance}
                todayAttendance={todayAttendance}
                onClockIn={handleClockIn}
                onClockOut={handleClockOut}
              />
            )}

            {/* View 4: Leave Requests & Approvals */}
            {activeTab === 'leaves' && (
              <LeaveManagementView
                currentUser={currentUser}
                leaves={leaves}
                employeeDetails={employeeDetails}
                onApplyLeave={handleApplyLeave}
                onReviewLeave={handleReviewLeave}
                isApplyModalOpen={isApplyLeaveModalOpen}
                onSetApplyModalOpen={setIsApplyLeaveModalOpen}
              />
            )}

            {/* View 5: Announcements */}
            {activeTab === 'announcements' && (
              <AnnouncementsView
                currentUser={currentUser}
                announcements={announcements}
                onCreateAnnouncement={handleCreateAnnouncement}
                onDeleteAnnouncement={handleDeleteAnnouncement}
              />
            )}

            {/* View 6: Training Hub */}
            {activeTab === 'trainings' && (
              <TrainingsView
                currentUser={currentUser}
                trainings={trainings}
                onToggleEnroll={handleToggleEnrollTraining}
                onCreateTraining={handleCreateTraining}
              />
            )}

            {/* View 7: Reports & Analytics */}
            {activeTab === 'reports' && (
              <ReportsView
                currentUser={currentUser}
                users={users}
                attendance={attendance}
                leaves={leaves}
                analytics={analytics}
                getEmployeeDetails={(id) => hrmService.getEmployeeDetails(id)}
              />
            )}

            {/* View 8: System Test Runner */}
            {activeTab === 'tests' && <SystemTestsView />}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        users={users}
        onRegisterUser={handleAddEmployee}
      />

      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotifRead}
        onMarkAllRead={handleMarkAllNotifsRead}
        onNavigateTab={setActiveTab}
      />
    </div>
  );
}
