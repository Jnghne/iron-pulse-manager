import React, { useEffect } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { ProductFormValues, ProductType, Product } from '@/types/product';
import { toast } from '@/components/ui/use-toast';

// Zod 스키마 (ProductFormPage.tsx와 동일하게 사용)
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

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null; // 수정할 상품 데이터, 없을 경우 null
  onProductUpdate: (updatedProduct: Product) => void; // 실제로는 API 호출 후 반환된 Product 객체
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({ isOpen, onClose, product, onProductUpdate }) => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      type: undefined,
      price: '',
      description: '',
      durationDays: '',
      totalSessions: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen && product) {
      form.reset({
        name: product.name,
        type: product.type,
        price: product.price.toString(),
        description: product.description || '',
        durationDays: product.durationDays?.toString() || '',
        totalSessions: product.totalSessions?.toString() || '',
        isActive: product.isActive,
      });
    } else if (isOpen && !product) {
      // product가 null인데 모달이 열린 경우 (오류 상황), 폼을 기본값으로 리셋하고 경고
      form.reset();
      toast({
        title: '오류',
        description: '수정할 상품 정보가 없습니다.',
        variant: 'destructive',
      });
      onClose(); // 모달 닫기
    }
  }, [isOpen, product, form, onClose]);

  const selectedProductType = form.watch('type');

  const onSubmit = async (data: ProductFormValues) => {
    if (!product) return; // product가 없으면 제출 로직 실행 안함

    console.log('Product edit form data:', data);
    const numericPrice = parseFloat(data.price);
    const numericDurationDays = data.durationDays ? parseInt(data.durationDays) : undefined;
    const numericTotalSessions = data.totalSessions ? parseInt(data.totalSessions) : undefined;

    try {
      const updatedProduct: Product = {
        ...product, // 기존 상품 정보 유지
        ...data,    // 폼에서 수정된 정보 덮어쓰기
        price: numericPrice,
        durationDays: numericDurationDays,
        totalSessions: numericTotalSessions,
        updatedAt: new Date(),
      };
      
      onProductUpdate(updatedProduct);
      toast({
        title: '상품이 성공적으로 수정되었습니다.',
        description: data.name,
      });
      onClose();
    } catch (error) {
      toast({
        title: '오류 발생',
        description: '상품 수정 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  if (!isOpen || !product) return null; // product가 없으면 모달을 렌더링하지 않음

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>상품 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
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
              value={form.watch('type')}
              onValueChange={(value) => form.setValue('type', value as ProductType, { shouldValidate: true })}
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
            <Textarea id="description" {...form.register('description')} placeholder="상품에 대한 설명을 입력하세요." />
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="isActive" 
              checked={form.watch('isActive')} 
              onCheckedChange={(checked) => form.setValue('isActive', checked)}
            />
            <Label htmlFor="isActive">상품 활성화</Label>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">취소</Button>
            </DialogClose>
            <Button type="submit">수정하기</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
