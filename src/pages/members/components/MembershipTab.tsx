import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dumbbell, 
  User, 
  Calendar, 
  Clock, 
  Key, 
  ShoppingBag, 
  Plus 
} from "lucide-react";
import { Member } from "@/data/mockData";
import { formatDate } from "@/lib/utils";

interface MembershipTabProps {
  member: Member;
  onPaymentRegister: (type: 'gym' | 'pt' | 'locker' | 'other') => void;
  isOwner: boolean;
}

export const MembershipTab = ({ member, onPaymentRegister, isOwner }: MembershipTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 헬스장 이용권 정보 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-gym-primary" />
              헬스장 이용권
            </CardTitle>
            <CardDescription>
              헬스장 이용권 상태 및 정보
            </CardDescription>
          </div>
          {isOwner && (
            <Button 
              onClick={() => onPaymentRegister('gym')}
              className="flex items-center gap-2 text-sm bg-gym-primary hover:bg-gym-primary/90"
            >
              <Plus className="h-4 w-4" />
              결제 등록
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {member.membershipActive ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">상품명</span>
                <span className="font-medium">헬스 이용권 {member.memberType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">남은 기간</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {member.gymMembershipDaysLeft}일
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({formatDate(member.membershipStartDate || '')} ~ {formatDate(member.membershipEndDate || '')})
                  </span>
                </div>
              </div>
              {member.availableBranches && member.availableBranches.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">이용 가능 지점</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {member.availableBranches.map((branch, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-100">
                        {branch}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Badge variant="destructive">이용권 없음</Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                현재 등록된 헬스장 이용권이 없습니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PT 레슨권 정보 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-gym-primary" />
              PT 레슨권
            </CardTitle>
            <CardDescription>
              퍼스널 트레이닝 이용권 상태 및 정보
            </CardDescription>
          </div>
          {isOwner && (
            <Button 
              onClick={() => onPaymentRegister('pt')}
              className="flex items-center gap-2 text-sm bg-gym-primary hover:bg-gym-primary/90"
            >
              <Plus className="h-4 w-4" />
              결제 등록
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {member.hasPT ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">상품명</span>
                <span className="font-medium">PT {member.ptTotal}회권</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">담당 트레이너</span>
                <span className="font-medium">{member.trainerAssigned || '미지정'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">남은 횟수</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {member.ptRemaining}회
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({formatDate(member.ptStartDate || '')} ~ {formatDate(member.ptExpiryDate || '')})
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Badge variant="destructive">이용권 없음</Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                현재 등록된 PT 이용권이 없습니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 락커 이용권 정보 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="h-5 w-5 text-gym-primary" />
              락커 이용권
            </CardTitle>
            <CardDescription>
              락커 이용권 상태 및 정보
            </CardDescription>
          </div>
          {isOwner && (
            <Button 
              onClick={() => onPaymentRegister('locker')}
              className="flex items-center gap-2 text-sm bg-gym-primary hover:bg-gym-primary/90"
            >
              <Plus className="h-4 w-4" />
              결제 등록
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {member.lockerInfo ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">상품명</span>
                <span className="font-medium">{member.lockerInfo.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">남은 기간</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {member.lockerInfo.daysLeft}일
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({formatDate(member.lockerInfo.startDate)} ~ {formatDate(member.lockerInfo.endDate)})
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">락커 정보</span>
                <Badge variant="outline" className="bg-gray-100">
                  {member.lockerInfo.lockerNumber}
                </Badge>
              </div>
              {member.lockerInfo.notes && (
                <div>
                  <span className="text-sm text-muted-foreground">특이사항</span>
                  <div className="mt-1 p-2 bg-muted/50 rounded-md">
                    <p className="text-sm">{member.lockerInfo.notes}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Badge variant="destructive">이용권 없음</Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                현재 등록된 락커 이용권이 없습니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 기타 상품 정보 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-gym-primary" />
              기타 상품
            </CardTitle>
            <CardDescription>
              식음료, 공간대여, 촬영협조 등 기타 상품 정보
            </CardDescription>
          </div>
          {isOwner && (
            <Button 
              onClick={() => onPaymentRegister('other')}
              className="flex items-center gap-2 text-sm bg-gym-primary hover:bg-gym-primary/90"
            >
              <Plus className="h-4 w-4" />
              결제 등록
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {member.otherProducts && member.otherProducts.length > 0 ? (
            <div className="space-y-4">
              {member.otherProducts.map((product, index) => (
                <div key={index} className="p-3 border rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">상품명</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.name}</span>
                      <Badge variant="outline" className="bg-gray-100">
                        {product.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">사용 기간</span>
                    <span className="text-sm">
                      {formatDate(product.startDate)} ~ {formatDate(product.endDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Badge variant="destructive">상품 없음</Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                현재 등록된 기타 상품이 없습니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
