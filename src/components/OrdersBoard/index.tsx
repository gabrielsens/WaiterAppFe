import { Board, OrdersContainer } from './styles';
import { toast } from 'react-toastify';
import { Order } from '../../Types/Order';
import OrderModal from '../OrderModal';
import { useState } from 'react';
import { api } from '../../Utils/api';
interface OrdersBoardProps {
  icon: string,
  title: string;
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
  onChangeOrderStatus: (orderId: string, status: Order['status']) => void;
}

export default function OrdersBoard({ icon, title, orders, onCancelOrder, onChangeOrderStatus }: OrdersBoardProps) {
  const hasOrders = orders.length > 0;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<null | Order>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleOpenModal(order: Order) {
    setSelectedOrder(order);
    setIsModalVisible(true);
  }

  function handleCloseModal() {
    setIsModalVisible(false);
    setSelectedOrder(null);
  }

  async function handleChangeOrderStatus() {
    try {
      setIsLoading(true);

      const status = selectedOrder?.status === 'WAITING' ? 'IN_PRODUCTION' : 'DONE';
      console.log(status);

      await api.patch(`/orders/${selectedOrder?._id}`, { status });

      toast.success(`O pedido da mesa ${selectedOrder?.table} teve o status alterado!`);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onChangeOrderStatus(selectedOrder!._id, status);
    } finally {
      setIsLoading(false);
      handleCloseModal();
    }
  }

  async function handleCancelOrder() {
    try {
      setIsLoading(true);
      await api.delete(`/orders/${selectedOrder?._id}`);
      toast.success(`O pedido da mesa ${selectedOrder?.table} foi cancelado`);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onCancelOrder(selectedOrder!._id);
    } finally {
      setIsLoading(false);
      handleCloseModal();
    }
  }

  return (
    <Board >
      <OrderModal
        order={selectedOrder}
        visible={isModalVisible}
        onClose={handleCloseModal}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleChangeOrderStatus}
        isLoading={isLoading}
      />
      <header>
        <span>{icon}</span>
        <strong>{title}</strong>
        <span>({orders.length})</span>
      </header>
      {}
      {hasOrders && (
        <OrdersContainer>
          {orders.map((order) => (
            <button type='button' key={order._id} onClick={() => handleOpenModal(order)}>
              <strong>{order.table}</strong>
              <span>{order.products.length} itens</span>
            </button>
          ))}
        </OrdersContainer>
      )}
    </Board>
  );
}
