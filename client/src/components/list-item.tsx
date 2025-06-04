import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MoreVertical } from 'lucide-react';
import type { ShoppingList } from '@shared/schema';

interface ListItemProps {
  list: ShoppingList & { itemCount?: number; completedCount?: number };
  onView: () => void;
  onEdit?: () => void;
  onOptions?: () => void;
}

export function ListItem({ list, onView, onEdit, onOptions }: ListItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'processing':
        return 'Em Processamento';
      case 'active':
        return 'Ativa';
      default:
        return 'Rascunho';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 truncate">{list.name}</h3>
          <Badge className={getStatusColor(list.status)}>
            {getStatusText(list.status)}
          </Badge>
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          <div>{list.itemCount || 0} itens • Criada em {formatDate(list.createdAt)}</div>
          {list.completedCount !== undefined && (
            <div className="mt-1">Comprados: {list.completedCount}/{list.itemCount || 0}</div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onView}
            className="flex-1"
          >
            {list.status === 'draft' && onEdit ? 'Editar Lista' : 'Ver Lista'}
          </Button>
          
          {onOptions && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOptions}
              className="p-2"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
