import { Order } from '../../Types/Order';
import OrdersBoard from '../OrdersBoard';
import { Container } from './styles';

const orders: Order[] =
[{
  '_id': '63c86cb748b9deb9589b04f9',
  'table': '123',
  'status': 'WAITING',
  'products': [
    {
      'product': {
        'name': 'Pizza Quatro Queijos',
        'imagePath': '1674078132020-quatro-queijos.png',
        'price': 40,
      },
      'quantity': 2,
      '_id': '63c86cb748b9deb9589b04fa'
    },
    {
      'product': {
        'name': 'Coca cola',
        'imagePath': '1674078743142-coca-cola.png',
        'price': 7,
      },
      'quantity': 1,
      '_id': '63c86cb748b9deb9589b04fb'
    }
  ],
}
];

export default function Orders() {
  return (
    <Container>
      <OrdersBoard
        icon="🕐"
        title="Fila de espera"
        orders={orders}
      />
      <OrdersBoard
        icon="👩‍🍳"
        title="Em preparação"
        orders={[]}
      />
      <OrdersBoard
        icon="✅"
        title="Pronto!"
        orders={[]}
      />

    </Container>
  );
}
