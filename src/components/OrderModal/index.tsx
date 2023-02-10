import { Actions, ModalBody, OrderDetails, Overlay } from './styles';
import closeIcon from '../../assets/images/close-icon.svg';
import { Order } from '../../Types/Order';
import { formatCurrency } from '../../Utils/formatCurrency';
import { useEffect } from 'react';

interface OrderModalProps {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
  onCancelOrder: () => void;
  onChangeOrderStatus: () => void;
  isLoading: boolean;
}

export default function OrderModal({ visible, order, onClose, onCancelOrder, isLoading, onChangeOrderStatus }: OrderModalProps) {
  useEffect(() => {
    function handleKeyEscape(event: KeyboardEvent) {
      if(event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyEscape);

    return () => {
      document.removeEventListener('keydown', handleKeyEscape);
    };
  },[onClose]);

  if(!visible || !order) {
    return null;
  }

  const total = order.products
    .reduce((acc, { product, quantity}) =>  (acc + (quantity * product.price)), 0);

  return (
    <Overlay>
      <ModalBody>
        <header>
          <strong>Mesa {order.table}</strong>

          <button type="button" onClick={onClose} >
            <img src={closeIcon} alt="Close Icon" />
          </button>
        </header>

        <div className='status-container'>
          <small>Status do pedido</small>
          <div>
            <span>
              {order.status === 'WAITING' && '🕐'}
              {order.status === 'IN_PRODUCTION' && '👩‍🍳'}
              {order.status === 'DONE' && '✅'}
            </span>
            <strong>
              {order.status === 'WAITING' && 'Fila de espera'}
              {order.status === 'IN_PRODUCTION' && 'Em preparação'}
              {order.status === 'DONE' && 'Pronto'}
            </strong>
          </div>
        </div>

        <OrderDetails>
          <strong>Itens</strong>

          <div className="order-items">
            {order.products.map(({ _id, product, quantity }) => (
              <div className="item" key={_id}>
                <img
                  src={`http://localhost:3001/uploads/${product.imagePath}`}
                  alt={product.name}
                  width="56"
                  height="28.51"
                />

                <span className="quantity">{quantity}x</span>

                <div className="product-details">
                  <strong>{product.name}</strong>
                  <span>{formatCurrency(product.price)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </OrderDetails>
        <Actions>
          {order.status !== 'DONE' && (
            <button
              type='button'
              className="primary"
              disabled={isLoading}
              onClick={onChangeOrderStatus}
            >
              <span>
                {order.status === 'WAITING' && '👩‍🍳'}
                {order.status === 'IN_PRODUCTION' && '✅'}

              </span>
              <strong>
                {order.status === 'WAITING' && 'Iniciar produção'}
                {order.status === 'IN_PRODUCTION' && 'Concluir pedido'}
              </strong>
            </button>
          )}
          <button
            type="button"
            className="secondary"
            disabled={isLoading}
            onClick={onCancelOrder}
          >
              Cancelar Pedido
          </button>
        </Actions>
      </ModalBody>
    </Overlay>
  );
}
