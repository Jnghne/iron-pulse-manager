// src/pages/products/ProductListPage.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
// Link와 useNavigate는 더 이상 직접 사용하지 않으므로 주석 처리 또는 삭제 가능
// import { Link, useNavigate } from 'react-router-dom'; 
import { Product, ProductType } from '@/types/product'; 
import { mockProducts } from '@/data/mockProducts';
import { ProductAddModal } from '@/components/features/product/ProductAddModal';
import { ProductEditModal } from '@/components/features/product/ProductEditModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // ShadCN Table
import { Badge } from "@/components/ui/badge"; // ShadCN Badge
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Tabs 관련 컴포넌트 임포트

// 상품 유형 이름을 반환하는 함수 (기존과 동일)
const getProductTypeName = (type: ProductType): string => {
  switch (type) {
    case ProductType.MEMBERSHIP: return '회원권';
    case ProductType.PT: return 'PT';
    case ProductType.LOCKER: return '락커';
    case ProductType.OTHER: return '기타';
    default: return '알 수 없음';
  }
};

// 탭 정의
const productTabs = [
  { value: 'all', label: '전체' },
  { value: ProductType.MEMBERSHIP, label: getProductTypeName(ProductType.MEMBERSHIP) },
  { value: ProductType.PT, label: getProductTypeName(ProductType.PT) },
  { value: ProductType.LOCKER, label: getProductTypeName(ProductType.LOCKER) },
  { value: ProductType.OTHER, label: getProductTypeName(ProductType.OTHER) },
];

const ProductListPage: React.FC = () => {
  // const navigate = useNavigate(); // 더 이상 직접 사용하지 않음
  const [activeTab, setActiveTab] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>(mockProducts); // 상품 목록 상태로 관리

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleOpenEditModal = (product: Product) => {
    setSelectedProductForEdit(product);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setSelectedProductForEdit(null);
    setIsEditModalOpen(false);
  };

  const handleProductAdd = (newProduct: Product) => {
    // 실제 앱에서는 API 호출 후 응답으로 상태를 업데이트합니다.
    setProducts(prevProducts => [newProduct, ...prevProducts]);
    // mockProducts 배열도 직접 업데이트 (임시)
    mockProducts.unshift(newProduct);
  };

  const handleProductUpdate = (updatedProduct: Product) => {
    // 실제 앱에서는 API 호출 후 응답으로 상태를 업데이트합니다.
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
    // mockProducts 배열도 직접 업데이트 (임시)
    const index = mockProducts.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      mockProducts[index] = updatedProduct;
    }
  };

  const handleDeleteProduct = (productId: string) => {
    const productToDelete = mockProducts.find(p => p.id === productId);
    // TODO: API 연동하여 실제 삭제 처리
    console.log(`Deleting product ${productId}`);
    toast({
      title: "상품 삭제 (구현 예정)",
      description: `${productToDelete?.name || productId} 상품에 대한 삭제 기능은 API 연동 후 구현될 예정입니다.`,
    });
  };

  // 선택된 탭에 따라 상품 필터링 (상태로 관리되는 products 사용)
  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter(product => product.type === activeTab);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">상품 관리</h1>
        <Button onClick={handleOpenAddModal} className="bg-gym-primary hover:bg-gym-primary/90 text-white">
          <PlusCircle className="mr-2 h-5 w-5" /> 상품 추가
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          {productTabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>상품명</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>가격</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>최근 수정일</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            product.type === ProductType.MEMBERSHIP ? "default" :
                            product.type === ProductType.PT ? "secondary" :
                            product.type === ProductType.LOCKER ? "outline" : 
                            "destructive" // 기타 등등
                          }
                          className={
                            product.type === ProductType.MEMBERSHIP ? "bg-blue-500 text-white" :
                            product.type === ProductType.PT ? "bg-purple-500 text-white" :
                            product.type === ProductType.LOCKER ? "bg-gray-500 text-white" : 
                            "bg-orange-500 text-white" // 기타 등등
                          }
                        >
                          {getProductTypeName(product.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.price.toLocaleString()}원</TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.isActive ? 'default' : 'outline'}
                          className={product.isActive ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
                        >
                          {product.isActive ? '활성' : '비활성'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(product.updatedAt).toLocaleDateString('ko-KR')}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditModal(product)}
                          className="hover:border-gym-primary hover:text-gym-primary"
                          aria-label="상품 수정"
                        >
                          <Edit className="mr-1 h-4 w-4" /> 수정
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          aria-label="상품 삭제"
                        >
                          <Trash2 className="mr-1 h-4 w-4" /> 삭제
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      {activeTab === 'all' && mockProducts.length === 0 
                        ? '등록된 상품이 없습니다. 새 상품을 추가해주세요.' 
                        : `${getProductTypeName(activeTab as ProductType)} 유형의 상품이 없습니다.`}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

      <ProductAddModal 
        isOpen={isAddModalOpen} 
        onClose={handleCloseAddModal} 
        onProductAdd={handleProductAdd} 
      />
      {selectedProductForEdit && (
        <ProductEditModal 
          isOpen={isEditModalOpen} 
          onClose={handleCloseEditModal} 
          product={selectedProductForEdit} 
          onProductUpdate={handleProductUpdate} 
        />
      )}
    </div>
  );
};

export default ProductListPage;
