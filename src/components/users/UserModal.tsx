import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { createUser, updateUser, User } from '@/store/slices/usersSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const userSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserModal = ({ isOpen, onClose, user }: UserModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar: user.avatar || '',
      });
    } else {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        avatar: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEditing && user) {
        await dispatch(updateUser({ 
          ...user, 
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          avatar: data.avatar || user.avatar 
        }));
        toast.success('User updated successfully');
      } else {
        await dispatch(createUser({ 
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          avatar: data.avatar || 'https://reqres.in/img/faces/1-image.jpg' 
        }));
        toast.success('User created successfully');
      }
      onClose();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? 'Edit User' : 'Create New User'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">
              <span className="text-destructive">* </span>First Name
            </Label>
            <Input
              id="first_name"
              placeholder="Please enter first name"
              {...register('first_name')}
            />
            {errors.first_name && (
              <p className="text-sm text-destructive">{errors.first_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">
              <span className="text-destructive">* </span>Last Name
            </Label>
            <Input
              id="last_name"
              placeholder="Please enter last name"
              {...register('last_name')}
            />
            {errors.last_name && (
              <p className="text-sm text-destructive">{errors.last_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              <span className="text-destructive">* </span>Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Please enter email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">
              <span className="text-destructive">* </span>Profile Image Link
            </Label>
            <Input
              id="avatar"
              placeholder="Please enter profile image link"
              {...register('avatar')}
            />
            {errors.avatar && (
              <p className="text-sm text-destructive">{errors.avatar.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
