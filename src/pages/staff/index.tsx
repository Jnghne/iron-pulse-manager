import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffList } from "./StaffList";
import { RegistrationManagement } from "./RegistrationManagement";

const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState("staff-list");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">직원 관리</h1>
          <p className="text-muted-foreground">사업장의 직원을 등록하고 관리합니다.</p>
        </div>
      </div>
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="staff-list">직원 목록</TabsTrigger>
          <TabsTrigger value="registration">가입 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="staff-list">
          <StaffList />
        </TabsContent>
        
        <TabsContent value="registration">
          <RegistrationManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffManagement;
