
import { memo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, User, Briefcase, CreditCard, FileText } from "lucide-react";
import { Staff } from "../../types";

interface EditFormType {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  gender?: string;
  address?: string;
  account?: string;
  workHours?: string;
  memo?: string;
}

interface EditStaffDialogProps {
  staff: Staff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editForm: EditFormType;
  setEditForm: (form: EditFormType) => void;
  onSave: () => void;
}

export const EditStaffDialog = memo<EditStaffDialogProps>(({
  staff,
  open,
  onOpenChange,
  editForm,
  setEditForm,
  onSave
}) => {
  const [addressSearchOpen, setAddressSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  
  // 주소 검색 함수 (실제로는 다음 우편번호 API나 카카오 주소 API 사용)
  const handleAddressSearch = () => {
    if (!searchQuery.trim()) return;
    
    // 모의 주소 검색 결과
    const mockResults = [
      `서울특별시 강남구 테헤란로 ${Math.floor(Math.random() * 100) + 1}`,
      `서울특별시 강남구 역삼동 ${Math.floor(Math.random() * 999) + 1}-${Math.floor(Math.random() * 99) + 1}`,
      `서울특별시 서초구 서초대로 ${Math.floor(Math.random() * 100) + 1}`,
      `서울특별시 송파구 올림픽로 ${Math.floor(Math.random() * 100) + 1}`,
      `경기도 성남시 분당구 판교역로 ${Math.floor(Math.random() * 100) + 1}`
    ].filter(addr => addr.includes(searchQuery));
    
    setSearchResults(mockResults.length > 0 ? mockResults : [
      `${searchQuery} 관련 주소를 찾을 수 없습니다. 직접 입력해주세요.`
    ]);
  };
  
  const handleAddressSelect = (address: string) => {
    setEditForm({ ...editForm, address });
    setAddressSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center">
              <User className="h-6 w-6 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">직원 정보 수정</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {staff.name}님의 정보를 수정할 수 있습니다.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          {/* 기본 정보 섹션 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">기본 정보</h3>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span>이름</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="이름을 입력하세요"
                    className="h-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span>연락처</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="010-0000-0000"
                    className="h-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="example@email.com"
                    className="h-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    성별
                  </Label>
                  <Select
                    value={editForm.gender || '남성'}
                    onValueChange={(value) => setEditForm({ ...editForm, gender: value })}
                  >
                    <SelectTrigger className="h-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors">
                      <SelectValue placeholder="성별 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="남성">남성</SelectItem>
                      <SelectItem value="여성">여성</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  주소
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="address"
                    value={editForm.address || ''}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="주소를 입력하거나 검색 버튼을 클릭하세요"
                    className="flex-1 h-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddressSearchOpen(true)}
                    className="h-10 px-4 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 직무 정보 섹션 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">직무 정보</h3>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="position" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    직급/직책
                  </Label>
                  <Input
                    id="position"
                    value={editForm.position || ''}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                    placeholder="예: 수석 트레이너, 매니저"
                    className="h-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  />
                </div>

                {!staff?.isRegistration && (
                  <div className="space-y-3">
                    <Label htmlFor="workHours" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      근무 시간
                    </Label>
                    <Input
                      id="workHours"
                      value={editForm.workHours || ''}
                      onChange={(e) => setEditForm({ ...editForm, workHours: e.target.value })}
                      placeholder="예: 09:00-18:00"
                      className="h-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 재무 정보 섹션 */}
          {!staff?.isRegistration && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">재무 정보</h3>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
                <div className="space-y-3">
                  <Label htmlFor="account" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    계좌 정보
                  </Label>
                  <Input
                    id="account"
                    value={editForm.account || ''}
                    onChange={(e) => setEditForm({ ...editForm, account: e.target.value })}
                    placeholder="예: 국민은행 123-456-789012"
                    className="h-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 추가 정보 섹션 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">추가 정보</h3>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
              <div className="space-y-3">
                <Label htmlFor="memo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  특이사항/메모
                </Label>
                <Textarea
                  id="memo"
                  value={editForm.memo || ''}
                  onChange={(e) => setEditForm({ ...editForm, memo: e.target.value })}
                  placeholder="특이사항이나 참고할 내용을 입력하세요"
                  rows={4}
                  className="border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-3 pt-6 border-t border-gray-100">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="px-6 h-10 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            취소
          </Button>
          <Button 
            onClick={onSave} 
            className="px-8 h-10 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            저장하기
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* 주소 검색 다이얼로그 */}
      <Dialog open={addressSearchOpen} onOpenChange={setAddressSearchOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">주소 검색</DialogTitle>
                <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  검색어를 입력하여 주소를 찾아보세요.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex gap-3">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="지역명, 도로명, 건물명 등을 입력하세요"
                onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch()}
                className="flex-1 h-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
              <Button 
                onClick={handleAddressSearch}
                className="h-10 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <Search className="h-4 w-4 mr-2" />
                검색
              </Button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">검색 결과</Label>
                <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  {searchResults.map((address, index) => (
                    <div
                      key={index}
                      onClick={() => handleAddressSelect(address)}
                      className="p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-sm border-b last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <span className="font-medium text-gray-900 dark:text-white">{address}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="pt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={() => setAddressSearchOpen(false)}
              className="px-6 h-10"
            >
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
});

EditStaffDialog.displayName = 'EditStaffDialog';
