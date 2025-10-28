import { Button } from '@/components/ui/button';
import { Table, LayoutGrid } from 'lucide-react';

interface ViewToggleProps {
  view: 'table' | 'card';
  onViewChange: (view: 'table' | 'card') => void;
}

const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex gap-2 mb-6">
      <Button
        variant={view === 'table' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewChange('table')}
        className="gap-2"
      >
        <Table className="h-4 w-4" />
        Table
      </Button>
      <Button
        variant={view === 'card' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewChange('card')}
        className="gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        Card
      </Button>
    </div>
  );
};

export default ViewToggle;
