// src/pages/products/ProductListPage.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Package, ShoppingBag, Star, Calendar, DollarSign, MoreHorizontal } from 'lucide-react';
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
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 상품 유형 이름을 반환하는 함수 (기존과 동일)
const getProductTypeName = (type: ProductType): string => {
  switch (type) {
    case ProductType.MEMBERSHIP: return '헬스';
    case ProductType.LESSON: return '개인레슨';
    case ProductType.LOCKER: return '락커';
    case ProductType.OTHER: return '기타';
    default: return '알 수 없음';
  }
};

// 상품 유형별 뱃지 스타일과 아이콘
const getProductTypeBadgeStyle = (type: ProductType) => {
  switch (type) {
    case ProductType.MEMBERSHIP:
      return {
        className: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <ShoppingBag className="w-3 h-3 mr-1" />
      };
    case ProductType.LESSON:
      return {
        className: "bg-purple-50 text-purple-700 border-purple-200",
        icon: <Star className="w-3 h-3 mr-1" />
      };
    case ProductType.LOCKER:
      return {
        className: "bg-green-50 text-green-700 border-green-200",
        icon: <Package className="w-3 h-3 mr-1" />
      };
    case ProductType.OTHER:
      return {
        className: "bg-gray-100 text-gray-700 border-gray-200",
        icon: <MoreHorizontal className="w-3 h-3 mr-1" />
      };
    default:
      return {
        className: "bg-gray-100 text-gray-700 border-gray-200",
        icon: <MoreHorizontal className="w-3 h-3 mr-1" />
      };
  }
};

// 탭 정의
const productTabs = [
  { value: 'all', label: '전체' },
  { value: ProductType.MEMBERSHIP, label: getProductTypeName(ProductType.MEMBERSHIP) },
  { value: ProductType.LESSON, label: getProductTypeName(ProductType.LESSON) },
  { value: ProductType.LOCKER, label: getProductTypeName(ProductType.LOCKER) },
  { value: ProductType.OTHER, label: getProductTypeName(ProductType.OTHER) },
];

const ProductListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>(mockProducts);

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
    setProducts(prevProducts => [newProduct, ...prevProducts]);
    mockProducts.unshift(newProduct);
  };

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
    const index = mockProducts.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      mockProducts[index] = updatedProduct;
    }
  };

  const handleDeleteProduct = (productId: string) => {
    const productToDelete = mockProducts.find(p => p.id === productId);
    console.log(`Deleting product ${productId}`);
    toast({
      title: "상품 삭제 (구현 예정)",
      description: `${productToDelete?.name || productId} 상품에 대한 삭제 기능은 API 연동 후 구현될 예정입니다.`,
    });
  };

  // 선택된 탭에 따라 상품 필터링
  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter(product => product.type === activeTab);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-end items-center mb-6">
        <Button onClick={handleOpenAddModal} className="bg-blue-600 hover:bg-blue-700 text-white">
          <PlusCircle className="mr-2 h-5 w-5" /> 상품 등록
        </Button>
      </div>
      
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
        <CardHeader className="border-b bg-slate-50/70 dark:bg-slate-800/20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20">
                <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              상품 목록
              <Badge variant="secondary" className="ml-2">{filteredProducts.length}개</Badge>
            </CardTitle>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-auto"
            >
              <TabsList className="grid grid-cols-5 h-9">
                {productTabs.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value} className="text-xs px-3">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const badgeStyle = getProductTypeBadgeStyle(product.type);
                return (
                  <div key={product.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all duration-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50 flex items-center justify-center">
                          <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{product.name}</h4>
                            <Badge className={`${badgeStyle.className} border font-medium`}>
                              {badgeStyle.icon}
                              {getProductTypeName(product.type)}
                            </Badge>
                            {product.isActive ? (
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5"></div>
                                활성
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-50 text-gray-700 border-gray-200 font-medium">
                                <div className="w-2 h-2 bg-gray-500 rounded-full mr-1.5"></div>
                                비활성
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1 font-medium text-gray-900 dark:text-white">
                              <DollarSign className="h-3 w-3" />
                              {product.price.toLocaleString()}원
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(product.updatedAt).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEditModal(product)}>
                              <Edit className="mr-2 h-4 w-4" />
                              수정
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {activeTab === 'all' && mockProducts.length === 0 
                      ? '등록된 상품이 없습니다' 
                      : `${getProductTypeName(activeTab as ProductType)} 상품이 없습니다`}
                  </h3>
                  <p className="text-sm mb-4">
                    {activeTab === 'all' && mockProducts.length === 0 
                      ? '새 상품을 추가해주세요' 
                      : '다른 유형을 선택하거나 새 상품을 추가해보세요'}
                  </p>
                  <Button onClick={handleOpenAddModal} variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" /> 상품 등록
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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