import request from 'supertest';
import express from 'express';
import orderRoutes from '../routes/orderRoutes'; // Adjust the path as necessary
import Order from '../models/Order';
import Cart from '../models/Cart';
import authMiddleware from '../middlewares/authMiddleware';

const app = express();
app.use(express.json());
app.use(orderRoutes);

// Mock the authMiddleware
jest.mock('../middlewares/authMiddleware', () => {
  return (req, res, next) => {
    req.user = { id: 'user123', isAdmin: false }; // Mock user object
    next();
  };
});

// Mock the models
jest.mock('../models/Order');
jest.mock('../models/Cart');

const mockedOrder = Order as jest.Mocked<typeof Order>;
const mockedCart = Cart as jest.Mocked<typeof Cart>;

describe('Order Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /orders', () => {
    it('should place a new order and delete the cart', async () => {
      mockedCart.findById.mockResolvedValue({
        _id: 'cart123',
        items: [{ productId: 'product123', quantity: 1 }],
        save: jest.fn(),
      } as any);

      mockedOrder.prototype.save = jest.fn().mockResolvedValue({
        _id: 'order123',
        user: 'user123',
        items: [{ productId: 'product123', quantity: 1 }],
        status: 'Pending',
      } as any);

      mockedCart.findByIdAndDelete.mockResolvedValue({} as any);

      const response = await request(app).post('/orders').send({ cartId: 'cart123' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id', 'order123');
      expect(mockedCart.findById).toHaveBeenCalledWith('cart123');
      expect(mockedCart.findByIdAndDelete).toHaveBeenCalledWith('cart123');
    });

    it('should return 404 if cart not found', async () => {
      mockedCart.findById.mockResolvedValue(null);

      const response = await request(app).post('/orders').send({ cartId: 'cart123' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Cart not found');
    });
  });

  describe('GET /orders', () => {
    it('should get all orders for the logged-in user', async () => {
      mockedOrder.find.mockResolvedValue([
        {
          _id: 'order123',
          user: 'user123',
          items: [{ productId: 'product123', quantity: 1 }],
          status: 'Pending',
        },
      ] as any);

      const response = await request(app).get('/orders');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(mockedOrder.find).toHaveBeenCalledWith({ user: 'user123' });
    });

    it('should get all orders if admin', async () => {
      // Mock admin middleware
      jest.mock('../middlewares/authMiddleware', () => {
        return (req, res, next) => {
          req.user = { id: 'admin123', isAdmin: true };
          next();
        };
      });

      mockedOrder.find.mockResolvedValue([
        {
          _id: 'order123',
          user: 'user123',
          items: [{ productId: 'product123', quantity: 1 }],
          status: 'Pending',
        },
      ] as any);

      const response = await request(app).get('/orders');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(mockedOrder.find).toHaveBeenCalledWith({admin: 'admin123'});
    });
  });

  describe('PUT /orders/:id', () => {
    it('should update the order status if admin', async () => {
      // Mock admin middleware
      jest.mock('../middlewares/authMiddleware', () => {
        return (req, res, next) => {
          req.user = { id: 'admin123', isAdmin: true };
          next();
        };
      });

      mockedOrder.findById.mockResolvedValue({
        _id: 'order123',
        user: 'user123',
        items: [{ productId: 'product123', quantity: 1 }],
        status: 'Pending',
        save: jest.fn().mockResolvedValue(true),
      } as any);

      const response = await request(app).put('/orders/order123').send({ status: 'Shipped' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'Shipped');
       expect(mockedOrder.find).toHaveBeenCalledWith({admin: 'admin123'});
    });

    it('should return 403 if not admin', async () => {
      const response = await request(app).put('/orders/order123').send({ status: 'Shipped' });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Access denied');
    });

    it('should return 404 if order not found', async () => {
      // Mock admin middleware
      jest.mock('../middlewares/authMiddleware', () => {
        return (req, res, next) => {
          req.user = { id: 'admin123', isAdmin: true };
          next();
        };
      });

      mockedOrder.findById.mockResolvedValue(null);

      const response = await request(app).put('/orders/order123').send({ status: 'Shipped' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Order not found');
    });
  });

  describe('DELETE /orders/:id', () => {
    it('should delete the order', async () => {
      mockedOrder.findOne.mockResolvedValue({
        _id: 'order123',
        user: 'user123',
        deleteOne: jest.fn().mockResolvedValue(true),
      } as any);

      const response = await request(app).delete('/orders/order123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Order deleted');
      expect(mockedOrder.findOne).toHaveBeenCalledWith({ _id: 'order123', user: 'user123' });
    });

    it('should return 404 if order not found', async () => {
      mockedOrder.findOne.mockResolvedValue(null);

      const response = await request(app).delete('/orders/order123');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Order not found');
    });
  });

  describe('GET /:ordersId', () => {
    it('should get an order by ID', async () => {
      mockedOrder.findOne.mockResolvedValue({
        _id: 'order123',
        user: 'user123',
        items: [{ productId: 'product123', quantity: 1 }],
        status: 'Pending',
      } as any);

      const response = await request(app).get('/order123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', 'order123');
    });

    it('should return 404 if order not found', async () => {
      mockedOrder.findOne.mockResolvedValue(null);

      const response = await request(app).get('/orders/order123');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Order not found');
    });
  });
});
