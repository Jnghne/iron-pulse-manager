
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Member } from "@/data/mockData";
import { formatPhoneNumber } from "@/lib/utils";
import { toast } from "sonner";

interface MemberEditDialogProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (member: Member) => void;
}

export const MemberEditDialog = ({ member, open, onOpenChange, onSave }: MemberEditDialogProps) => {
  const [formData, setFormData] = useState({
    name: member.name,
    phoneNumber: member.phoneNumber,
    email: member.email || '',
    address: member.address || '',
    birthDate: member.birthDate || '',
    gender: member.gender,
    smsConsent: member.smsConsent,
    trainerAssigned: member.trainerAssigned || '',
    trainerNotes: member.trainerNotes || ''
  });

  const handleSave = () => {
    const updatedMember: Member = {
      ...member,
      ...formData
    };
    
    onSave(updatedMember);
    toast.success("회원 정보가 수정되었습니다.");
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>회원 정보 수정</DialogTitle>
          <DialogDescription>
            회원의 기본 정보를 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">회원명</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">핸드폰 번호</Label>
              <Input
                id="phone"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="010-0000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="example@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">생년월일</Label>
              <Input
                id="birthDate"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                placeholder="YYYYMMDD"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">성별</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="성별 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">남성</SelectItem>
                  <SelectItem value="female">여성</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trainer">담당 트레이너</Label>
              <Select value={formData.trainerAssigned} onValueChange={(value) => handleInputChange('trainerAssigned', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="트레이너 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">선택 안함</SelectItem>
                  <SelectItem value="박지훈">박지훈</SelectItem>
                  <SelectItem value="김태양">김태양</SelectItem>
                  <SelectItem value="최수진">최수진</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 주소 */}
          <div className="space-y-2">
            <Label htmlFor="address">주소</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="주소를 입력하세요"
            />
          </div>

          {/* SMS 수신 동의 */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="smsConsent"
              checked={formData.smsConsent}
              onCheckedChange={(checked) => handleInputChange('smsConsent', checked)}
            />
            <Label htmlFor="smsConsent">SMS 수신에 동의합니다</Label>
          </div>

          {/* 트레이너 메모 */}
          <div className="space-y-2">
            <Label htmlFor="trainerNotes">트레이너 메모</Label>
            <Textarea
              id="trainerNotes"
              value={formData.trainerNotes}
              onChange={(e) => handleInputChange('trainerNotes', e.target.value)}
              placeholder="트레이너 메모를 입력하세요"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
