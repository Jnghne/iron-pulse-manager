// src/data/mockProducts.ts
import { Product, ProductType } from '@/types/product';

export const mockProducts: Product[] = [
  {
    id: 'prod_001',
    name: '헬스 1개월 이용권',
    type: ProductType.MEMBERSHIP,
    price: 50000,
    durationDays: 30,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod_002',
    name: '개인 PT 10회',
    type: ProductType.PT,
    price: 700000,
    totalSessions: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod_003',
    name: '개인 락커 1개월',
    type: ProductType.LOCKER,
    price: 10000,
    durationDays: 30,
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod_004',
    name: '프로틴 음료',
    type: ProductType.OTHER,
    price: 3000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
