import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Search, Loader2 } from "lucide-react";
import { useEffect, useRef, ChangeEvent } from 'react'; // Added ChangeEvent
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { generateMemberId, formatPhoneNumber, isValidPhoneNumber } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { mockMembers, Member } from "@/data/mockData";

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

const memberSchema = z.object({
  name: z.string().min(2, { message: "이름은 2자 이상 입력해주세요." }),
  gender: z.enum(["male", "female"], { required_error: "성별을 선택해주세요." }),
  birthDate: z.date({ required_error: "생년월일을 선택해주세요." }),
  phoneNumber: z.string().refine(isValidPhoneNumber, { message: "유효한 핸드폰 번호를 입력해주세요. (010-0000-0000)" }),
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }).optional().or(z.literal('')),
  address: z.object({
    postalCode: z.string().min(5, { message: "우편번호를 검색해주세요." }),
    address1: z.string().min(1, { message: "주소를 검색해주세요." }),
    address2: z.string().optional(),
  }),
  registrationPath: z.string().optional(),
  smsConsent: z.boolean().default(false),
  memberNotes: z.string().optional(),
});

type MemberFormValues = z.infer<typeof memberSchema>;

const MemberCreate = () => {
  const navigate = useNavigate();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      gender: undefined,
      birthDate: undefined,
      phoneNumber: "",
      email: "",
      address: {
        postalCode: "",
        address1: "",
        address2: "",
      },
      registrationPath: "",
      smsConsent: false,
      memberNotes: "",
    },
  });

  const addressDetailRef = useRef<HTMLInputElement>(null);
  const watchedPhoneNumber = watch("phoneNumber");

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
    
    // 컴포넌트 언마운트 시 스크립트 제거 (선택 사항, 상황에 따라 필요 없을 수 있음)
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript && existingScript.parentElement === document.head) {
        // document.head.removeChild(existingScript); // 주석 처리: 다른 페이지에서도 사용될 수 있으므로 제거하지 않음
      }
    };
  }, []);

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

          setValue('address.postalCode', data.zonecode, { shouldValidate: true });
          setValue('address.address1', fullAddress, { shouldValidate: true });
          setValue('address.address2', '', { shouldValidate: false });
          addressDetailRef.current?.focus();
        },
      }).open();
    } else {
      toast.error("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const onSubmit = (data: MemberFormValues) => {
    try {
      const newMemberId = generateMemberId();
      const registrationDate = new Date().toISOString().split("T")[0];

      const newMember: Member = {
        id: newMemberId,
        name: data.name,
        gender: data.gender,
        birthDate: data.birthDate ? format(data.birthDate, "yyyy-MM-dd") : "",
        phone: data.phoneNumber,
        email: data.email || undefined,
        address: `${data.address.address1} ${data.address.address2 || ''}`.trim(),
        memberType: "일반",
        registrationDate,
        membershipStatus: "pending",
        attendanceRate: 0,
        smsConsent: data.smsConsent,
        memberNotes: data.memberNotes || undefined,
        // --- 나머지 Member 타입 필드들은 mockData에 따라 기본값 또는 undefined로 설정 ---
        expiryDate: undefined,
        ptRemaining: undefined,
        ptExpiryDate: undefined,
        ptStartDate: undefined,
        ptTotal: undefined,
        gymMembershipDaysLeft: undefined,
        gymMembershipExpiryDate: undefined,
        trainerAssigned: undefined,
        photoUrl: undefined,
        membershipActive: false,
        hasPT: false,
        membershipId: undefined,
        ptId: undefined,
        lockerId: undefined,
        membershipStartDate: undefined,
        membershipEndDate: undefined,
        availableBranches: undefined,
        unpaidAmount: undefined,
        lockerInfo: undefined,
        otherProducts: undefined,
        suspensionRecords: undefined,
        trainerNotes: data.memberNotes || undefined, // 이전 코드에서 memberNotes로 되어있던 것을 trainerNotes로 유지하거나, Member 타입 정의와 일치시킬 필요가 있습니다. 여기서는 일단 trainerNotes로 두겠습니다.
      };

      mockMembers.unshift(newMember);

      toast.success(`${data.name} 회원이 성공적으로 등록되었습니다.`, {
        description: `회원번호: ${newMemberId}`,
      });
      navigate(`/members/${newMemberId}`);
    } catch (error) {
      console.error("Error creating member:", error);
      toast.error("회원 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">회원 등록</h1>
        <p className="text-muted-foreground">새로운 회원 정보를 등록하고 관리하세요.</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 기본 정보 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>회원의 기본적인 개인 정보를 입력합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">이름 <span className="text-destructive">*</span></Label>
              <Input 
                id="name" 
                placeholder="홍길동"
                {...register("name")} 
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">성별 <span className="text-destructive">*</span></Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="성별을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">남성</SelectItem>
                      <SelectItem value="female">여성</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="birthDate">생년월일 <span className="text-destructive">*</span></Label>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <DatePicker 
                    selected={field.value} 
                    onSelect={field.onChange} 
                    className="w-full"
                    placeholder="생년월일을 선택하세요"
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.birthDate && <p className="text-sm text-destructive">{errors.birthDate.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* 연락처 정보 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>연락처 정보</CardTitle>
            <CardDescription>회원의 연락처 정보를 입력합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">핸드폰 번호 <span className="text-destructive">*</span></Label>
              <Input 
                id="phoneNumber" 
                placeholder="010-0000-0000"
                {...register("phoneNumber", {
                  onChange: (e: ChangeEvent<HTMLInputElement>) => { // Added ChangeEvent type
                    const formatted = formatPhoneNumber(e.target.value);
                    setValue("phoneNumber", formatted, { shouldValidate: true });
                  }
                })}
                value={watchedPhoneNumber} // This should work if watchedPhoneNumber is correctly updated
                disabled={isSubmitting}
              />
              {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="example@email.com"
                {...register("email")} 
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* 주소 정보 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>주소 정보</CardTitle>
            <CardDescription>회원의 주소 정보를 입력합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address.postalCode">우편번호 <span className="text-destructive">*</span></Label>
              <div className="flex items-center gap-2">
                <Controller
                  name="address.postalCode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="address.postalCode"
                      {...field}
                      readOnly
                      placeholder="주소 검색 클릭"
                      className="flex-grow bg-gray-100 dark:bg-gray-800"
                      disabled={isSubmitting}
                    />
                  )}
                />
                <Button type="button" variant="outline" onClick={handleOpenPostcode} disabled={isSubmitting}>
                  <Search className="mr-2 h-4 w-4" /> 주소 검색
                </Button>
              </div>
              {errors.address?.postalCode && (
                <p className="text-sm text-destructive">{errors.address.postalCode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address.address1">주소 <span className="text-destructive">*</span></Label>
              <Controller
                name="address.address1"
                control={control}
                render={({ field }) => (
                  <Input
                    id="address.address1"
                    {...field}
                    readOnly
                    placeholder="검색된 주소가 표시됩니다"
                    className="w-full bg-gray-100 dark:bg-gray-800"
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.address?.address1 && (
                <p className="text-sm text-destructive">{errors.address.address1.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address.address2">상세주소</Label>
              <Controller
                name="address.address2"
                control={control}
                render={({ field }) => (
                  <Input
                    id="address.address2"
                    {...field}
                    placeholder="상세주소를 입력하세요 (예: 아파트 동/호수)"
                    className="w-full"
                    ref={addressDetailRef}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.address?.address2 && (
                <p className="text-sm text-destructive">{errors.address.address2.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 기타 정보 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>기타 정보</CardTitle>
            <CardDescription>추가적인 회원 정보를 입력합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="registrationPath">가입 경로</Label>
              <Controller
                name="registrationPath"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <SelectTrigger id="registrationPath">
                      <SelectValue placeholder="가입 경로를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="지인 소개">지인 소개</SelectItem>
                      <SelectItem value="온라인 검색">온라인 검색 (블로그, SNS 등)</SelectItem>
                      <SelectItem value="간판/전단지">간판/전단지</SelectItem>
                      <SelectItem value="이벤트/프로모션">이벤트/프로모션</SelectItem>
                      <SelectItem value="재등록">재등록</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.registrationPath && <p className="text-sm text-destructive">{errors.registrationPath.message}</p>}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Controller
                  name="smsConsent"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="smsConsent"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  )}
                />
                <Label htmlFor="smsConsent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  SMS 수신 동의 (마케팅 정보 수신)
                </Label>
              </div>
              {errors.smsConsent && <p className="text-sm text-destructive">{errors.smsConsent.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberNotes">회원 메모</Label>
              <Controller
                name="memberNotes"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="memberNotes"
                    placeholder="회원에 대한 특이사항이나 메모를 입력하세요."
                    {...field}
                    className="min-h-[100px]"
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.memberNotes && <p className="text-sm text-destructive">{errors.memberNotes.message}</p>}
            </div>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-gym-primary hover:bg-gym-primary/90">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                등록 중...
              </>
            ) : "등록하기"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
};

export default MemberCreate;
