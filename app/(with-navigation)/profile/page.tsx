"use client";

import { useAuth } from "../../../lib/auth-context";
import { Card } from "../../../components/ui/card/card";
import { Modal } from "../../../components/ui/modal/modal";
import { Button } from "@/components/ui/button/button";
import styles from "./profile.module.css";
import { Calendar, Camera, Clock, Mail, PencilIcon, Shield, Trash2, User, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isUpdateEmailOpen, setIsUpdateEmailOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal-specific error states
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    bio: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: ''
  });

  const showSuccessMessage = (text: string) => {
    setSuccessMessage(text);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const clearModalErrors = () => {
    setProfileError(null);
    setPasswordError(null);
    setEmailError(null);
    setDeleteError(null);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProfileError(null);
    
    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profileForm.fullName,
          bio: profileForm.bio
        }
      });

      if (error) throw error;
      
      showSuccessMessage('Profile updated successfully!');
      setIsUpdateProfileOpen(false);
      setProfileForm({ fullName: '', bio: '' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;
      
      showSuccessMessage('Password changed successfully!');
      setIsChangePasswordOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        email: emailForm.newEmail
      });

      if (error) throw error;
      
      showSuccessMessage('Email update initiated. Please check your new email for confirmation.');
      setIsUpdateEmailOpen(false);
      setEmailForm({ newEmail: '', password: '' });
    } catch (error) {
      console.error('Error updating email:', error);
      setEmailError('Failed to update email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setDeleteError(null);
    
    try {
      // Delete user account
      // const { error } = await supabase.auth.admin.deleteUser(user?.id || '');
      
      // if (error) {
      //   // If admin delete fails, try to delete user data and sign out
      //   await signOut();
      //   showSuccessMessage('Account deletion initiated. Please contact support if you need to recover your data.');
      // } else {
      //   showSuccessMessage('Account deleted successfully.');
      // }
      
      // Temporarily disabled for safety
      setDeleteError('Account deletion is temporarily disabled for safety reasons.');
      
      setIsDeleteAccountOpen(false);
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteError('Failed to delete account. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Profile</h1>
          <p>Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Profile</h1>
        <p className={styles.subtitle}>Manage your account settings and preferences</p>
        
        {/* Success Message Display */}
        {successMessage && (
          <div className={`${styles.message} ${styles.success}`}>
            {successMessage}
            <button onClick={() => setSuccessMessage(null)} className={styles.messageClose}>
              <X size={16} />
            </button>
          </div>
        )}
        
        {/* User Profile Summary */}
        <Card className={styles.profileSummaryCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
              {user.email ? user.email.charAt(0).toUpperCase() : <User/>}
              </div>
              <button className={styles.cameraButton}>
                <Camera size={16}/>
              </button>
            </div>
            <div className={styles.userInfo}>
                {/** TODO: Hook up to user name */}
              {/* <div className={styles.nameSection}>
                <h2>Khamudom User</h2>
                <button className={styles.editButton}>
                  <PenIcon size={16}/>
                </button>
              </div> */}
              <div className={styles.emailSection}>
                <span>{user.email}</span>
              </div>
              <div className={styles.statusBadge}>
                Active Account
              </div>
            </div>
          </div>
        </Card>

        {/* Account Information & Actions - Two Columns */}
        <div className={styles.twoColumnSection}>
          {/* Account Information Card */}
          <Card className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <Shield size={24}/>
              <h3>Account Information</h3>
            </div>
            <p className={styles.cardSubtitle}>Your account details and security information</p>
            <div className={styles.infoItems}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email Address</span>
                <span className={styles.infoValue}>{user.email}</span>
              </div>
              <div className={styles.infoItem}>
                <Calendar size={20}/>
                <span className={styles.infoLabel}>Account Created</span>
                <span className={styles.infoValue}>{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              <div className={styles.infoItem}>
                <Clock size={20}/>
                <span className={styles.infoLabel}>Last Sign In</span>
                <span className={styles.infoValue}>{new Date(user.last_sign_in_at || user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>

          {/* Account Actions Card */}
          <Card className={styles.actionsCard}>
            <div className={styles.cardHeader}>
              <h3>Account Actions</h3>
            </div>
            <p className={styles.cardSubtitle}>Manage your account settings and security</p>
            <div className={styles.actionButtons}>
              <Button 
                variant="outline" 
                align="left" 
                style={{columnGap: "20px"}}
                onClick={() => {
                  clearModalErrors();
                  setIsUpdateProfileOpen(true);
                }}
              >
                <PencilIcon size={20}/>
                Update Profile Information
              </Button>
              <Button 
                variant="outline" 
                align="left" 
                style={{columnGap: "20px"}}
                onClick={() => {
                  clearModalErrors();
                  setIsChangePasswordOpen(true);
                }}
              >
                <Shield size={20}/>
                Change Password
              </Button>
              <Button 
                variant="outline" 
                align="left" 
                style={{columnGap: "20px"}}
                onClick={() => {
                  clearModalErrors();
                  setIsUpdateEmailOpen(true);
                }}
              >
                <Mail size={20}/>
                Update Email Address
              </Button>
              <Button 
                variant="outline" 
                align="left"  
                style={{columnGap: "20px"}} 
                status="danger"
                onClick={() => {
                  clearModalErrors();
                  setIsDeleteAccountOpen(true);
                }}
              >
                <Trash2 size={20}/>
                Delete Account
              </Button>
            </div>
          </Card>
        </div>

        {/* Update Profile Modal */}
        <Modal
          isOpen={isUpdateProfileOpen}
          onClose={() => {
            setIsUpdateProfileOpen(false);
            setProfileError(null);
          }}
          title="Update Profile Information"
          className={styles.profileModal}
        >
          <form onSubmit={handleUpdateProfile} className={styles.form}>
            {profileError && (
              <div className={`${styles.message} ${styles.error}`}>
                {profileError}
              </div>
            )}
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={profileForm.bio}
                onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>
            <div className={styles.formActions}>
              <Button type="button" variant="outline" onClick={() => setIsUpdateProfileOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Change Password Modal */}
        <Modal
          isOpen={isChangePasswordOpen}
          onClose={() => {
            setIsChangePasswordOpen(false);
            setPasswordError(null);
          }}
          title="Change Password"
          className={styles.profileModal}
        >
          <form onSubmit={handleChangePassword} className={styles.form}>
            {passwordError && (
              <div className={`${styles.message} ${styles.error}`}>
                {passwordError}
              </div>
            )}
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                placeholder="Enter new password"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                placeholder="Confirm new password"
                required
              />
            </div>
            <div className={styles.formActions}>
              <Button type="button" variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Update Email Modal */}
        <Modal
          isOpen={isUpdateEmailOpen}
          onClose={() => {
            setIsUpdateEmailOpen(false);
            setEmailError(null);
          }}
          title="Update Email Address"
          className={styles.profileModal}
        >
          <form onSubmit={handleUpdateEmail} className={styles.form}>
            {emailError && (
              <div className={`${styles.message} ${styles.error}`}>
                {emailError}
              </div>
            )}
            <div className={styles.formGroup}>
              <label htmlFor="newEmail">New Email Address</label>
              <input
                type="email"
                id="newEmail"
                value={emailForm.newEmail}
                onChange={(e) => setEmailForm({...emailForm, newEmail: e.target.value})}
                placeholder="Enter new email address"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Current Password</label>
              <input
                type="password"
                id="password"
                value={emailForm.password}
                onChange={(e) => setEmailForm({...emailForm, password: e.target.value})}
                placeholder="Enter your current password"
                required
              />
            </div>
            <div className={styles.formActions}>
              <Button type="button" variant="outline" onClick={() => setIsUpdateEmailOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Email'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Account Modal */}
        <Modal
          isOpen={isDeleteAccountOpen}
          onClose={() => {
            setIsDeleteAccountOpen(false);
            setDeleteError(null);
          }}
          title="Delete Account"
          className={styles.profileModal}
        >
          <div className={styles.deleteAccountContent}>
            {deleteError && (
              <div className={`${styles.message} ${styles.error}`}>
                {deleteError}
              </div>
            )}
            <p className={styles.deleteWarning}>
              <strong>Warning:</strong> This action cannot be undone. All your data, including recipes and preferences, will be permanently deleted.
            </p>
            <p>Are you sure you want to delete your account?</p>
            <div className={styles.formActions}>
              <Button type="button" variant="outline" onClick={() => setIsDeleteAccountOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="button" 
                status="danger" 
                disabled={isLoading}
                onClick={handleDeleteAccount}
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
} 