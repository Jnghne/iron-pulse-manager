
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, X, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MarketItemWrite = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const categories = {
    cardio: "유산소 기구",
    weights: "웨이트 기구",
    accessories: "부속품",
    furniture: "가구",
    supplements: "보충제",
    other: "기타"
  };

  const conditions = {
    new: "새상품",
    "like-new": "거의새것",
    good: "상태좋음",
    fair: "보통",
    poor: "상태나쁨"
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImages(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !price.trim() || !category || !condition || !location.trim()) {
      toast({
        title: "입력 오류",
        description: "모든 필수 항목을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    const priceNum = parseInt(price.replace(/,/g, ""));
    if (isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: "가격 오류",
        description: "올바른 가격을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    const marketItemData = {
      title: title.trim(),
      description: description.trim(),
      price: priceNum,
      category,
      condition,
      location: location.trim(),
      images,
      seller: "현재사용자",
      gymName: "내 헬스장",
      createdAt: new Date().toLocaleString("ko-KR"),
      views: 0,
      likes: 0,
      status: "available"
    };

    // 실제로는 API 호출
    console.log("새 중고거래 상품:", marketItemData);
    
    toast({
      title: "상품 등록 완료",
      description: "중고거래 상품이 성공적으로 등록되었습니다."
    });

    navigate("/community/market");
  };

  const formatPrice = (value: string) => {
    const number = value.replace(/[^0-9]/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPrice(e.target.value);
    setPrice(formatted);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link to="/community/market">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">중고상품 판매하기</h1>
          <p className="text-muted-foreground">
            헬스장 관장님들과 안전하게 거래하세요
          </p>
        </div>
      </div>

      {/* 판매하기 폼 */}
      <Card>
        <CardHeader>
          <CardTitle>상품 정보 입력</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 카테고리 */}
          <div className="space-y-2">
            <Label htmlFor="category">카테고리 *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categories).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title">상품명 *</Label>
            <Input
              id="title"
              placeholder="예: 런닝머신 판매합니다 (거의 새것)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 가격 */}
          <div className="space-y-2">
            <Label htmlFor="price">판매가격 *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="price"
                placeholder="예: 1,200,000"
                value={price}
                onChange={handlePriceChange}
                className="pl-10"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                원
              </span>
            </div>
          </div>

          {/* 상태 */}
          <div className="space-y-2">
            <Label htmlFor="condition">상품 상태 *</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger>
                <SelectValue placeholder="상품 상태를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(conditions).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 거래 지역 */}
          <div className="space-y-2">
            <Label htmlFor="location">거래 지역 *</Label>
            <Input
              id="location"
              placeholder="예: 서울 강남구"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* 상품 설명 */}
          <div className="space-y-2">
            <Label htmlFor="description">상품 설명 *</Label>
            <Textarea
              id="description"
              placeholder="상품에 대한 자세한 설명을 입력하세요. 구입 시기, 사용 빈도, 상태, 판매 이유 등을 포함해주세요."
              className="min-h-[200px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* 이미지 업로드 */}
          <div className="space-y-2">
            <Label>상품 사진</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <span className="text-sm text-blue-600 hover:text-blue-500">
                      사진을 업로드하세요
                    </span>
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, JPEG 파일만 업로드 가능합니다. (최대 10장)
                </p>
              </div>
            </div>

            {/* 업로드된 이미지 미리보기 */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`업로드된 이미지 ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 거래 방법 안내 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">안전한 거래를 위한 안내</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 직거래를 우선으로 하며, 공개된 장소에서 거래하세요.</li>
              <li>• 상품 상태를 정확히 기재해주세요.</li>
              <li>• 연락처는 거래가 성사된 후 개별적으로 공유하세요.</li>
              <li>• 선입금 요구나 의심스러운 거래는 피하세요.</li>
            </ul>
          </div>

          {/* 등록 버튼 */}
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/community/market")}
            >
              취소
            </Button>
            <Button onClick={handleSubmit}>
              상품 등록하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketItemWrite;
