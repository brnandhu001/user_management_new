import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { deleteUser, User } from '@/store/slices/usersSlice';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface DeleteConfirmDialogProps {
  user: User | null;
  onClose: () => void;
}

const DeleteConfirmDialog = ({ user, onClose }: DeleteConfirmDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async () => {
    if (!user) return;

    try {
      await dispatch(deleteUser(user.id));
      toast.success('User deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <AlertDialog open={!!user} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{' '}
            <span className="font-semibold">
              {user?.first_name} {user?.last_name}
            </span>
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
