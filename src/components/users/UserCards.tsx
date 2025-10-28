import { User } from '@/store/slices/usersSlice';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface UserCardsProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserCards = ({ users, onEdit, onDelete }: UserCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <Card key={user.id} className="group relative overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Avatar className="h-32 w-32 mx-auto mb-4">
              <AvatarImage src={user.avatar} alt={user.first_name} />
              <AvatarFallback className="text-2xl">
                {user.first_name[0]}
                {user.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold mb-1">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-muted-foreground">{user.email}</p>

            <div className="absolute inset-0 bg-muted/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <Button
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => onEdit(user)}
              >
                <Pencil className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="h-12 w-12 rounded-full"
                onClick={() => onDelete(user)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserCards;
