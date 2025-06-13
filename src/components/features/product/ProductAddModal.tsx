
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
  DialogDescription,
} from '@/components/ui/dialog';
import { ProductFormValues, ProductType, Product } from '@/types/product';
import { toast } from '@/components/ui/use-toast';
import { Package, Calendar, Users, Dumbbell, Settings } from 'lucide-react';

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

interface ProductAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdd: (newProduct: Product) => void;
}

const getProductTypeIcon = (type: ProductType) => {
  switch (type) {
    case ProductType.MEMBERSHIP:
      return <Calendar className="h-4 w-4" />;
    case ProductType.PT:
      return <Dumbbell className="h-4 w-4" />;
    case ProductType.LOCKER:
      return <Settings className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getProductTypeName = (type: ProductType) => {
  switch (type) {
    case ProductType.MEMBERSHIP:
      return '회원권';
    case ProductType.PT:
      return 'PT';
    case ProductType.LOCKER:
      return '락커';
    case ProductType.OTHER:
      return '기타';
    default:
      return '';
  }
};

export const ProductAddModal: React.FC<ProductAddModalProps> = ({ isOpen, onClose, onProductAdd }) => {
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
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const selectedProductType = form.watch('type');

  const onSubmit = async (data: ProductFormValues) => {
    console.log('Product add form data:', data);
    const numericPrice = parseFloat(data.price);
    const numericDurationDays = data.durationDays ? parseInt(data.durationDays) : undefined;
    const numericTotalSessions = data.totalSessions ? parseInt(data.totalSessions) : undefined;

    try {
      const newProduct: Product = {
        id: `prod_${Date.now().toString()}`,
        ...data,
        price: numericPrice,
        durationDays: numericDurationDays,
        totalSessions: numericTotalSessions,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      onProductAdd(newProduct);
      toast({
        title: '상품이 성공적으로 등록되었습니다.',
        description: data.name,
      });
      onClose();
    } catch (error) {
      toast({
        title: '오류 발생',
        description: '상품 등록 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            새 상품 추가
          </DialogTitle>
          <DialogDescription>
            새로운 상품의 정보를 입력하여 등록하세요.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* 기본 정보 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">기본 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  상품명 <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="name" 
                  {...form.register('name')} 
                  placeholder="예: 헬스 3개월 회원권"
                  className={form.formState.errors.name ? "border-red-500" : ""}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  상품 유형 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.watch('type')}
                  onValueChange={(value) => form.setValue('type', value as ProductType, { shouldValidate: true })}
                >
                  <SelectTrigger 
                    id="type" 
                    className={form.formState.errors.type ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="상품 유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ProductType).map((type) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          {getProductTypeIcon(type)}
                          {getProductTypeName(type)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.type && (
                  <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                가격 <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input 
                  id="price" 
                  type="number" 
                  {...form.register('price')} 
                  placeholder="50000" 
                  className={`pr-8 ${form.formState.errors.price ? "border-red-500" : ""}`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">원</span>
              </div>
              {form.formState.errors.price && (
                <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
              )}
            </div>
          </div>

          {/* 상품별 옵션 섹션 */}
          {selectedProductType && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">상품 옵션</h3>
              
              {selectedProductType === ProductType.MEMBERSHIP && (
                <div className="space-y-2">
                  <Label htmlFor="durationDays" className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    이용 기간 (일)
                  </Label>
                  <div className="relative">
                    <Input 
                      id="durationDays" 
                      type="number" 
                      {...form.register('durationDays')} 
                      placeholder="30" 
                      className={`pr-8 ${form.formState.errors.durationDays ? "border-red-500" : ""}`}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">일</span>
                  </div>
                  {form.formState.errors.durationDays && (
                    <p className="text-sm text-red-500">{form.formState.errors.durationDays.message}</p>
                  )}
                </div>
              )}

              {selectedProductType === ProductType.PT && (
                <div className="space-y-2">
                  <Label htmlFor="totalSessions" className="text-sm font-medium flex items-center gap-2">
                    <Dumbbell className="h-4 w-4" />
                    총 이용 횟수
                  </Label>
                  <div className="relative">
                    <Input 
                      id="totalSessions" 
                      type="number" 
                      {...form.register('totalSessions')} 
                      placeholder="10" 
                      className={`pr-8 ${form.formState.errors.totalSessions ? "border-red-500" : ""}`}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">회</span>
                  </div>
                  {form.formState.errors.totalSessions && (
                    <p className="text-sm text-red-500">{form.formState.errors.totalSessions.message}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 추가 정보 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">추가 정보</h3>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                상품 설명
              </Label>
              <Textarea 
                id="description" 
                {...form.register('description')} 
                placeholder="상품에 대한 자세한 설명을 입력하세요."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="isActive" className="text-sm font-medium">
                  상품 활성화
                </Label>
                <p className="text-xs text-gray-500">
                  비활성화된 상품은 고객이 구매할 수 없습니다.
                </p>
              </div>
              <Switch 
                id="isActive" 
                checked={form.watch('isActive')} 
                onCheckedChange={(checked) => form.setValue('isActive', checked)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">취소</Button>
            </DialogClose>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Package className="h-4 w-4 mr-2" />
              상품 등록
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
