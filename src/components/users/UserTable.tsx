import { User } from '@/store/slices/usersSlice';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserTable = ({ users, onEdit, onDelete }: UserTableProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-16"></TableHead>
            <TableHead>Email</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.first_name} />
                  <AvatarFallback>
                    {user.first_name[0]}
                    {user.last_name[0]}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>
                <a href={`mailto:${user.email}`} className="text-primary hover:underline">
                  {user.email}
                </a>
              </TableCell>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button size="sm" onClick={() => onEdit(user)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(user)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
