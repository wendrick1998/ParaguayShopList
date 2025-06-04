import { Button } from '@/components/ui/button';
import { Check, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ListItem } from '@shared/schema';

interface ProductItemProps {
  item: ListItem;
  showActions?: boolean;
  onMarkPurchased?: () => void;
  onMarkCancelled?: () => void;
  onRemove?: () => void;
}

export function ProductItem({ 
  item, 
  showActions = false, 
  onMarkPurchased, 
  onMarkCancelled,
  onRemove 
}: ProductItemProps) {
  const getStatusIcon = () => {
    switch (item.status) {
      case 'purchased':
        return <Check className="w-4 h-4 text-white" />;
      case 'cancelled':
        return <X className="w-4 h-4 text-white" />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (item.status) {
      case 'purchased':
        return (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            {getStatusIcon()}
          </div>
        );
      case 'cancelled':
        return (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            {getStatusIcon()}
          </div>
        );
      default:
        return <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getStatusText = () => {
    switch (item.status) {
      case 'purchased':
        return (
          <div className="text-xs text-green-600 mt-1">
            Comprado • {item.actualPrice ? `$${item.actualPrice}` : 'Preço não informado'}
          </div>
        );
      case 'cancelled':
        return (
          <div className="text-xs text-red-600 mt-1">
            Cancelado {item.notes ? `• ${item.notes}` : ''}
          </div>
        );
      default:
        return (
          <div className="text-xs text-gray-400 mt-1">
            Aguardando processamento
          </div>
        );
    }
  };

  const backgroundClass = cn(
    "px-4 py-4",
    item.status === 'purchased' && "bg-green-50",
    item.status === 'cancelled' && "bg-red-50",
    item.status === 'pending' && "bg-white"
  );

  return (
    <div className={backgroundClass}>
      <div className="flex items-center space-x-3">
        {getStatusBadge()}
        
        <div className="flex-1">
          <div className={cn(
            "font-medium text-gray-900",
            (item.status === 'purchased' || item.status === 'cancelled') && "line-through"
          )}>
            {item.name}
          </div>
          <div className="text-sm text-gray-500">
            Qty: {item.quantity}
            {item.estimatedPrice && ` • Estimado: $${item.estimatedPrice}`}
          </div>
          {getStatusText()}
        </div>

        {showActions && item.status === 'pending' && (
          <div className="flex space-x-1">
            {onMarkPurchased && (
              <Button
                size="sm"
                onClick={onMarkPurchased}
                className="bg-green-500 hover:bg-green-600 text-white p-1.5 h-auto"
              >
                <Check className="w-4 h-4" />
              </Button>
            )}
            {onMarkCancelled && (
              <Button
                size="sm"
                variant="destructive"
                onClick={onMarkCancelled}
                className="p-1.5 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        {onRemove && item.status === 'pending' && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onRemove}
            className="p-1 text-red-500 hover:bg-red-50"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
