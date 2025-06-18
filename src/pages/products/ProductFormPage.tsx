// src/pages/products/ProductFormPage.tsx
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ProductFormValues, ProductType } from '@/types/product';
import { toast } from '@/components/ui/use-toast';
import { mockProducts } from '@/data/mockProducts';

// Zod 스키마 정의
const productFormSchema = z.object({
  name: z.string().min(2, { message: '상품명은 2자 이상이어야 합니다.' }),
  type: z.nativeEnum(ProductType, {
    errorMap: () => ({ message: '상품 유형을 선택해주세요.' }),
  }),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: '유효한 가격을 입력해주세요 (0 이상).',
  }),
  description: z.string().optional(),
  durationDays: z.string().optional().refine(val => !val || (parseInt(val) > 0), { message: '기간은 0보다 커야 합니다.'}),
  totalSessions: z.string().optional().refine(val => !val || (parseInt(val) > 0), { message: '횟수는 0보다 커야 합니다.'}),
  isActive: z.boolean().default(true),
});

const ProductFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const isEditMode = Boolean(productId); 

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { // TODO: isEditMode 시 existingProductData로 채우기
      name: '',
      type: undefined, // ProductType.MEMBERSHIP,
      price: '',
      description: '',
      durationDays: '',
      totalSessions: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (isEditMode && productId) {
      const productToEdit = mockProducts.find(p => p.id === productId);
      if (productToEdit) {
        form.reset({
          name: productToEdit.name,
          type: productToEdit.type,
          price: productToEdit.price.toString(), // 숫자를 문자열로 변환
          description: productToEdit.description || '',
          durationDays: productToEdit.durationDays?.toString() || '', // 숫자를 문자열로 변환
          totalSessions: productToEdit.totalSessions?.toString() || '', // 숫자를 문자열로 변환
          isActive: productToEdit.isActive,
        });
      } else {
        toast({
          title: '오류',
          description: '수정할 상품을 찾을 수 없습니다.',
          variant: 'destructive',
        });
        navigate('/products');
      }
    }
  }, [isEditMode, productId, form, navigate]);

  const selectedProductType = form.watch('type');

  const onSubmit = async (data: ProductFormValues) => {
    console.log('Product form data:', data);
    const numericPrice = parseFloat(data.price);
    const numericDurationDays = data.durationDays ? parseInt(data.durationDays) : undefined;
    const numericTotalSessions = data.totalSessions ? parseInt(data.totalSessions) : undefined;

    // TODO: API 호출하여 상품 저장/수정
    // 여기에서 isEditMode와 productId를 사용하여 생성 또는 수정 API를 선택적으로 호출
    // 예:
    // if (isEditMode && productId) {
    //   // 수정 API 호출: updateProduct({ id: productId, ...data, price: numericPrice, ... })
    // } else {
    //   // 생성 API 호출: createProduct({ ...data, price: numericPrice, ... })
    // }

    try {
      // 임시 저장 로직 (실제로는 API 호출 결과에 따라 처리)
      if (isEditMode && productId) {
        // mockProducts 배열 업데이트 (실제로는 불변성 유지하며 상태 관리 라이브러리에서 처리)
        const index = mockProducts.findIndex(p => p.id === productId);
        if (index !== -1) {
          mockProducts[index] = {
            ...mockProducts[index],
            ...data,
            price: numericPrice,
            durationDays: numericDurationDays,
            totalSessions: numericTotalSessions,
            updatedAt: new Date(),
          };
        }
      } else {
        // mockProducts 배열에 새 상품 추가 (실제로는 불변성 유지)
        const newProduct = {
          id: `prod_${Date.now().toString()}`, // 임시 ID 생성
          ...data,
          price: numericPrice,
          durationDays: numericDurationDays,
          totalSessions: numericTotalSessions,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockProducts.push(newProduct); // 주의: 실제 앱에서는 상태관리 라이브러리 사용
      }

      toast({
        title: `상품이 성공적으로 ${isEditMode ? '수정' : '등록'}되었습니다.`,
        description: data.name,
      });
      navigate('/products');
    } catch (error) {
      toast({
        title: '오류 발생',
        description: `상품 ${isEditMode ? '수정' : '등록'} 중 오류가 발생했습니다.`,
        variant: 'destructive',
      });
    }
  };

  // TODO: isLoadingProduct 시 로딩 상태 표시

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? '상품 수정' : '새 상품 등록'}
      </h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <div>
          <Label htmlFor="name">상품명</Label>
          <Input id="name" {...form.register('name')} />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="type">상품 유형</Label>
          <Select
            value={form.watch('type')} // value prop 추가하여 제어
            onValueChange={(value) => form.setValue('type', value as ProductType, { shouldValidate: true })}
            // defaultValue={form.getValues('type')} // defaultValue 대신 value 사용
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="상품 유형 선택" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ProductType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type === ProductType.MEMBERSHIP && '회원권'}
                  {type === ProductType.LESSON && '개인레슨'}
                  {type === ProductType.LOCKER && '락커'}
                  {type === ProductType.OTHER && '기타'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.type && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.type.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="price">가격</Label>
          <Input id="price" type="number" {...form.register('price')} placeholder="예: 50000" />
          {form.formState.errors.price && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.price.message}</p>
          )}
        </div>
        
        {selectedProductType === ProductType.MEMBERSHIP && (
          <div>
            <Label htmlFor="durationDays">기간 (일)</Label>
            <Input id="durationDays" type="number" {...form.register('durationDays')} placeholder="예: 30 (30일)" />
            {form.formState.errors.durationDays && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.durationDays.message}</p>
            )}
          </div>
        )}

        {selectedProductType === ProductType.LESSON && (
          <div>
            <Label htmlFor="totalSessions">총 횟수</Label>
            <Input id="totalSessions" type="number" {...form.register('totalSessions')} placeholder="예: 10 (10회)" />
            {form.formState.errors.totalSessions && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.totalSessions.message}</p>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="description">상품 설명 (선택)</Label>
          <Textarea id="description" {...form.register('description')} />
        </div>

        <div className="flex items-center space-x-2">
          <Switch 
            id="isActive" 
            checked={form.watch('isActive')}
            onCheckedChange={(checked) => form.setValue('isActive', checked)}
          />
          <Label htmlFor="isActive">상품 활성화</Label>
        </div>
        
        <div className="flex space-x-2">
          <Button type="submit" className="bg-gym-primary hover:bg-gym-primary/90">
            {isEditMode ? '상품 저장' : '상품 등록'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/products')}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
