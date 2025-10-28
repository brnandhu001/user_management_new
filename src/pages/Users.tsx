import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchUsers, User } from '@/store/slices/usersSlice';
import { logoutUser } from '@/store/slices/authSlice'; // ✅ updated import
import { useNavigate } from 'react-router-dom';
import Header from '@/components/users/Header';
import SearchBar from '@/components/users/SearchBar';
import ViewToggle from '@/components/users/ViewToggle';
import UserTable from '@/components/users/UserTable';
import UserCards from '@/components/users/UserCards';
import UserModal from '@/components/users/UserModal';
import DeleteConfirmDialog from '@/components/users/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Pagination from '@/components/users/Pagination';

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state: RootState) => state.users);
  const { isAuthenticated, loading: authLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const [view, setView] = useState<'table' | 'card'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const itemsPerPage = 5;

  // ✅ Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(fetchUsers(1));
  }, [dispatch, isAuthenticated, navigate]);

  // ✅ Secure Logout Handler (calls /logout API)
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setDeletingUser(user);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Users</h1>
            <div className="flex items-center gap-4">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <Button onClick={handleCreate}>Create User</Button>
            </div>
          </div>

          <ViewToggle view={view} onViewChange={setView} />

          {loading || authLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {view === 'table' ? (
                <UserTable
                  users={paginatedUsers}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ) : (
                <UserCards
                  users={paginatedUsers}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}

              {filteredUsers.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
      />

      <DeleteConfirmDialog
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
      />
    </div>
  );
};

export default Users;
