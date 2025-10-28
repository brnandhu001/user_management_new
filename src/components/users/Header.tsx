import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onLogout: () => void;
}

const Header = ({ onLogout }: HeaderProps) => {
  return (
    <header className="bg-header text-header-foreground">
      <div className="container mx-auto px-4 py-4 flex items-center justify-end">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Elon Musk</span>
          <Avatar className="h-10 w-10 bg-destructive">
            <AvatarFallback className="bg-destructive text-white font-semibold">
              E
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="text-header-foreground hover:bg-header/80"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
