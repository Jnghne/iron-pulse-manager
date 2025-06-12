import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffList } from "./StaffList";
import { RegistrationManagement } from "./RegistrationManagement";

const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState("staff-list");

  return (
    <div className="space-y-6">
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
