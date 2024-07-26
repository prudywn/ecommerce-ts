import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import productRoutes, { getProduct } from '../routes/productRoutes';
import Product from '../models/Products';
import recordUserActivity from '../middlewares/recordUserActivities';

const app = express();
app.use(express.json());
app.use(productRoutes);

jest.mock('../models/Products');
jest.mock('../middlewares/recordUserActivities', () => jest.fn(() => (req, res, next) => next()));

const mockedProduct = Product as jest.Mocked<typeof Product>;

describe('Product Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /products', () => {
    it('should get all products', async () => {
      mockedProduct.find.mockResolvedValue([
        { _id: 'product1', name: 'Product 1', price: 100 },
        { _id: 'product2', name: 'Product 2', price: 200 },
      ] as any);

      const response = await request(app).get('/products');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(mockedProduct.find).toHaveBeenCalled();
    });

    it('should return 500 if server error occurs', async () => {
      mockedProduct.find.mockRejectedValue(new Error('Server error'));

      const response = await request(app).get('/products');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Server error');
    });
  });

  describe('POST /products', () => {
    it('should create a new product', async () => {
      mockedProduct.prototype.save = jest.fn().mockResolvedValue({
        _id: 'product1',
        name: 'Product 1',
        price: 100,
      } as any);

      const response = await request(app).post('/products').send({
        name: 'Product 1',
        price: 100,
        description: 'Product 1 description',
        imageUrl: 'http://example.com/image.jpg',
        quantity: 10,
        category: 'Category 1',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id', 'product1');
      expect(mockedProduct.prototype.save).toHaveBeenCalled();
    });

    it('should return 400 if validation error occurs', async () => {
      const response = await request(app).post('/products').send({
        name: '',
        price: -10,
        description: '',
        imageUrl: 'invalid-url',
        quantity: -1,
        category: '',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toEqual([
        'Name is required',
        'Price must be greater than 0',
        'Description is required',
        'Invalid image URL',
        'Quantity must be greater than 0',
        'Category is required',
      ]);
    });

    it('should return 500 if server error occurs', async () => {
      mockedProduct.prototype.save = jest.fn().mockRejectedValue(new Error('Server error'));

      const response = await request(app).post('/products').send({
        name: 'Product 1',
        price: 100,
        description: 'Product 1 description',
        imageUrl: 'http://example.com/image.jpg',
        quantity: 10,
        category: 'Category 1',
      });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Server error');
    });
  });

  describe('GET /products/:id', () => {
    it('should get a single product by ID', async () => {
      mockedProduct.findById.mockResolvedValue({
        _id: 'product1',
        name: 'Product 1',
        price: 100,
      } as any);

      const response = await request(app).get('/products/product1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', 'product1');
      expect(mockedProduct.findById).toHaveBeenCalledWith('product1');
    });

    it('should return 404 if product not found', async () => {
      mockedProduct.findById.mockResolvedValue(null);

      const response = await request(app).get('/products/product1');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Cannot find product');
    });

    it('should return 500 if server error occurs', async () => {
      mockedProduct.findById.mockRejectedValue(new Error('Server error'));

      const response = await request(app).get('/products/product1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Server error');
    });
  });

  describe('PATCH /products/:id', () => {
    it('should update a product', async () => {
      const mockProduct = {
        _id: 'product1',
        name: 'Product 1',
        price: 100,
        description: 'Product 1 description',
        imageUrl: 'http://example.com/image.jpg',
        quantity: 10,
        category: 'Category 1',
        save: jest.fn().mockResolvedValue({
          _id: 'product1',
          name: 'Updated Product 1',
          price: 150,
          description: 'Updated Product 1 description',
          imageUrl: 'http://example.com/updated-image.jpg',
          quantity: 20,
          category: 'Category 2',
        }),
      };

      mockedProduct.findById.mockResolvedValue(mockProduct as any);

      const response = await request(app).patch('/products/product1').send({
        name: 'Updated Product 1',
        price: 150,
        description: 'Updated Product 1 description',
        imageUrl: 'http://example.com/updated-image.jpg',
        quantity: 20,
        category: 'Category 2',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Product 1');
      expect(response.body).toHaveProperty('price', 150);
      expect(mockedProduct.findById).toHaveBeenCalledWith('product1');
      expect(mockProduct.save).toHaveBeenCalled();
    });

    it('should return 404 if product not found', async () => {
      mockedProduct.findById.mockResolvedValue(null);

      const response = await request(app).patch('/products/product1').send({
        name: 'Updated Product 1',
        price: 150,
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Cannot find product');
    });

    it('should return 400 if validation error occurs', async () => {
      const mockProduct = {
        _id: 'product1',
        name: 'Product 1',
        price: 100,
        description: 'Product 1 description',
        imageUrl: 'http://example.com/image.jpg',
        quantity: 10,
        category: 'Category 1',
        save: jest.fn().mockRejectedValue(new Error('Validation error')),
      };

      mockedProduct.findById.mockResolvedValue(mockProduct as any);

      const response = await request(app).patch('/products/product1').send({
        name: '',
        price: -10,
        description: '',
        imageUrl: 'invalid-url',
        quantity: -1,
        category: '',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toEqual([
        'Name is required',
        'Price must be greater than 0',
        'Description is required',
        'Invalid image URL',
        'Quantity must be greater than 0',
        'Category is required',
      ]);
    });
  });
  describe('DELETE /products/:id', () => {
    it('should delete a product', async () => {
      mockedProduct.findById.mockResolvedValue({
        _id: 'product1',
        name: 'Product 1',
        price: 100,
        deleteOne: jest.fn().mockResolvedValue({}),
      } as any);

      const response = await request(app).delete('/products/product1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Deleted product');
      expect(mockedProduct.findById).toHaveBeenCalledWith('product1');
    });

    it('should return 404 if product not found', async () => {
      mockedProduct.findById.mockResolvedValue(null);

      const response = await request(app).delete('/products/product1');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Cannot find product');
    });

    it('should return 500 if server error occurs', async () => {
      mockedProduct.findById.mockRejectedValue(new Error('Server error'));

      const response = await request(app).delete('/products/product1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Server error');
    });
  });
});
