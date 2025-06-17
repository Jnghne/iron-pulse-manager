
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PaymentRegistration = () => {
  const [activeTab, setActiveTab] = useState("membership");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">결제 등록</h1>
        <p className="text-muted-foreground">회원권, 개인레슨 이용권, 일일권 결제를 등록합니다.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>결제 유형 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="membership">회원권 등록</TabsTrigger>
              <TabsTrigger value="lesson">개인레슨 이용권 등록</TabsTrigger>
              <TabsTrigger value="daily">일일권 등록</TabsTrigger>
            </TabsList>
            
            <TabsContent value="membership" className="mt-4">
              <div className="p-6 border rounded-lg text-center">
                <h3 className="text-lg font-medium">회원권 등록</h3>
                <p className="text-muted-foreground mb-4">회원권 등록 기능은 현재 개발 중입니다.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="lesson" className="mt-4">
              <div className="p-6 border rounded-lg text-center">
                <h3 className="text-lg font-medium">개인레슨 이용권 등록</h3>
                <p className="text-muted-foreground mb-4">개인레슨 이용권 등록 기능은 현재 개발 중입니다.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="daily" className="mt-4">
              <div className="p-6 border rounded-lg text-center">
                <h3 className="text-lg font-medium">일일권 등록</h3>
                <p className="text-muted-foreground mb-4">일일권 등록 기능은 현재 개발 중입니다.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentRegistration;
