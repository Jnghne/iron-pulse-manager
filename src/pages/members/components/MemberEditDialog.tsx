
import { useState, useEffect, useRef } from 'react'; // useEffect, useRef 추가
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Member } from "@/data/mockData";
// import { formatPhoneNumber } from "@/lib/utils"; // 현재 사용되지 않으므로 주석 처리 또는 삭제 가능
import { toast } from "sonner";
import { Search } from 'lucide-react'; // Search 아이콘 추가

// Daum Postcode types
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    daum: any;
  }
}

interface DaumPostcodeData {
  zonecode: string;
  address: string;
  addressType: 'R' | 'J';
  bname: string;
  buildingName: string;
  apartment: 'Y' | 'N';
}

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
    // address: member.address || '', // 기존 address 필드는 저장 시 조합하여 사용
    birthDate: member.birthDate || '',
    gender: member.gender,
    smsConsent: member.smsConsent,
    trainerAssigned: member.trainerAssigned || '',
    memberNotes: member.memberNotes || '', // trainerNotes -> memberNotes
    // 주소 관련 필드 추가
    postalCode: '',
    address1: '',
    address2: '',
  });

  const addressDetailRef = useRef<HTMLInputElement>(null);

  // Daum 우편번호 스크립트 로드 및 member prop 변경 시 formData 업데이트
  useEffect(() => {
    const scriptId = 'daum-postcode-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // member prop이 변경될 때 formData 업데이트 (다이얼로그가 다시 열릴 때 등)
    // 기존 주소 문자열을 address1에 우선 할당
    // postalCode와 address2는 사용자가 검색을 통해 채우도록 유도
    if (open) { // 다이얼로그가 열릴 때만 member 데이터로 formData를 업데이트합니다.
      setFormData({
        name: member.name,
        phoneNumber: member.phoneNumber,
        email: member.email || '',
        birthDate: member.birthDate || '',
        gender: member.gender,
        smsConsent: member.smsConsent,
        trainerAssigned: member.trainerAssigned || '',
        memberNotes: member.memberNotes || '', // trainerNotes -> memberNotes
        postalCode: '', // 초기에는 비워둠
        address1: member.address || '', // 기존 주소를 address1에 할당
        address2: '', // 초기에는 비워둠
      });
    }
  }, [member, open]); // open 상태도 의존성 배열에 추가하여 다이얼로그가 열릴 때마다 실행

  const handleOpenPostcode = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: (data: DaumPostcodeData) => {
          let fullAddress = data.address;
          let extraAddress = '';

          if (data.addressType === 'R') {
            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
              extraAddress += data.bname;
            }
            if (data.buildingName !== '' && data.apartment === 'Y') {
              extraAddress += (extraAddress !== '' ? ', ' : '') + data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
          }
          
          setFormData(prev => ({
            ...prev,
            postalCode: data.zonecode,
            address1: fullAddress,
            address2: '', // 상세 주소는 초기화
          }));
          addressDetailRef.current?.focus();
        },
      }).open();
    } else {
      toast.error("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleSave = () => {
    const fullAddress = `${formData.address1} ${formData.address2 || ''}`.trim();
    const updatedMember: Member = {
      ...member, // 기존 member 데이터를 기반으로 업데이트
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      address: fullAddress, // 조합된 주소로 업데이트
      birthDate: formData.birthDate,
      gender: formData.gender,
      smsConsent: formData.smsConsent,
      trainerAssigned: formData.trainerAssigned,
      memberNotes: formData.memberNotes, // trainerNotes -> memberNotes
    };
    
    onSave(updatedMember);
    // toast.success("회원 정보가 수정되었습니다."); // onSave를 호출하는 쪽에서 toast를 띄우도록 변경
  };

  const handleInputChange = <K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
  ) => {
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
              <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">핸드폰 번호</Label>
              <Input id="phone" value={formData.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} placeholder="010-0000-0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="example@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">생년월일</Label>
              <Input id="birthDate" value={formData.birthDate} onChange={(e) => handleInputChange('birthDate', e.target.value)} placeholder="YYYYMMDD" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">성별</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value as typeof formData.gender)}>
                <SelectTrigger><SelectValue placeholder="성별 선택" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">남성</SelectItem>
                  <SelectItem value="female">여성</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer">담당 트레이너</Label>
              <Select value={formData.trainerAssigned} onValueChange={(value) => handleInputChange('trainerAssigned', value)}>
                <SelectTrigger><SelectValue placeholder="트레이너 선택" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">선택 안함</SelectItem>
                  <SelectItem value="박지훈">박지훈</SelectItem>
                  <SelectItem value="김태양">김태양</SelectItem>
                  <SelectItem value="최수진">최수진</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 주소 - 새로운 UI 적용 */}
          <div className="space-y-2">
            <Label htmlFor="postalCode">우편번호</Label>
            <div className="flex space-x-2">
              <Input
                id="postalCode"
                value={formData.postalCode}
                readOnly
                placeholder="우편번호"
                className="w-1/3 bg-gray-100"
              />
              <Button type="button" variant="outline" onClick={handleOpenPostcode} className="flex items-center">
                <Search className="mr-2 h-4 w-4" /> 주소 검색
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address1">기본 주소</Label>
            <Input
              id="address1"
              value={formData.address1}
              readOnly
              placeholder="주소 검색 버튼을 클릭하세요"
              className="bg-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address2">상세 주소</Label>
            <Input
              id="address2"
              ref={addressDetailRef}
              value={formData.address2}
              onChange={(e) => handleInputChange('address2', e.target.value)}
              placeholder="상세 주소를 입력하세요"
            />
          </div>
          {/* --- 주소 UI 끝 --- */}


          {/* 특이사항 메모 및 기타 설정 */}
          <div className="space-y-2">
            <Label htmlFor="memberNotes">특이사항 메모</Label>
            <Textarea id="memberNotes" value={formData.memberNotes} onChange={(e) => handleInputChange('memberNotes', e.target.value)} placeholder="회원 관련 특이사항을 입력하세요." rows={4} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="smsConsent" checked={formData.smsConsent} onCheckedChange={(checked) => handleInputChange('smsConsent', !!checked)} />
            <Label htmlFor="smsConsent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              마케팅 정보 수신 동의 (SMS)
            </Label>
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
