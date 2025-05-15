
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Users } from "lucide-react";

const MessageSystem = () => {
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState("single");

  const handleSendMessage = () => {
    // This would connect to the message service in a real application
    console.log("Message to send:", messageText);
    // Show success toast or notification
    setMessageText("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">문자 메시지</h1>
        <p className="text-muted-foreground">회원들에게 공지사항 및 정보를 전송합니다.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>문자 메시지 발송</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="single">
                <MessageSquare className="mr-2 h-4 w-4" />
                단일 메시지 발송
              </TabsTrigger>
              <TabsTrigger value="bulk">
                <Users className="mr-2 h-4 w-4" />
                단체 메시지 발송
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="single" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="recipient" className="text-sm font-medium">
                    수신자
                  </label>
                  <input 
                    type="text" 
                    id="recipient" 
                    placeholder="010-0000-0000" 
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    메시지 내용
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="메시지 내용을 입력하세요..." 
                    value={messageText} 
                    onChange={(e) => setMessageText(e.target.value)}
                    className="min-h-[150px]"
                  />
                  <div className="text-xs text-right text-muted-foreground">
                    {messageText.length} / 500자
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleSendMessage} 
                disabled={!messageText.trim()}
                className="w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                메시지 전송
              </Button>
            </TabsContent>
            
            <TabsContent value="bulk" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="group" className="text-sm font-medium">
                    수신자 그룹
                  </label>
                  <select 
                    id="group" 
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  >
                    <option value="all">전체 회원</option>
                    <option value="active">활성 회원</option>
                    <option value="pt">PT 회원</option>
                    <option value="expired">만료 임박 회원</option>
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="bulk-message" className="text-sm font-medium">
                    메시지 내용
                  </label>
                  <Textarea 
                    id="bulk-message" 
                    placeholder="단체 메시지 내용을 입력하세요..." 
                    value={messageText} 
                    onChange={(e) => setMessageText(e.target.value)}
                    className="min-h-[150px]"
                  />
                  <div className="text-xs text-right text-muted-foreground">
                    {messageText.length} / 500자
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleSendMessage} 
                disabled={!messageText.trim()}
                className="w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                단체 메시지 전송
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageSystem;
