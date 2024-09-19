import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/store/userSlice';
import { User, UserRole } from '@/types';
import { Table } from '@/components/UI/Table';
import { Button } from '@/components/UI/Button';
import { Modal } from '@/components/UI/Modal';
import { Form, Input, Select } from '@/components/UI/Form';
import { validateEmail, validatePassword } from '@/utils/validators';
import styles from '@/styles/UserManagement.module.css';

const UserManagement: React.FC = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.user.users);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCreateUser = async (userData: User) => {
    if (!validateEmail(userData.email) || !validatePassword(userData.password)) {
      // Show error message
      return;
    }
    await dispatch(createUser(userData));
    setIsModalOpen(false);
    // Show success message
  };

  const handleUpdateUser = async (userData: User) => {
    if (!validateEmail(userData.email)) {
      // Show error message
      return;
    }
    await dispatch(updateUser(userData));
    setIsModalOpen(false);
    setSelectedUser(null);
    // Show success message
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await dispatch(deleteUser(userId));
      // Show success message
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    {
      header: 'Actions',
      cell: (row: User) => (
        <>
          <Button onClick={() => { setSelectedUser(row); setIsModalOpen(true); }}>Edit</Button>
          <Button onClick={() => handleDeleteUser(row.id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div className={styles.userManagement}>
      <h1>User Management</h1>
      <Button onClick={() => setIsModalOpen(true)}>Create User</Button>
      <Table data={users} columns={columns} />

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedUser(null); }}>
        <Form
          onSubmit={(data) => selectedUser ? handleUpdateUser({ ...selectedUser, ...data }) : handleCreateUser(data as User)}
          initialValues={selectedUser || {}}
        >
          <Input name="name" label="Name" required />
          <Input name="email" label="Email" type="email" required />
          {!selectedUser && <Input name="password" label="Password" type="password" required />}
          <Select name="role" label="Role" options={Object.values(UserRole)} required />
          <Button type="submit">{selectedUser ? 'Update' : 'Create'} User</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;

// Human tasks:
// - Implement pagination or infinite scrolling for large user lists
// - Add sorting and filtering capabilities to the user table
// - Implement role-based access control for user management actions