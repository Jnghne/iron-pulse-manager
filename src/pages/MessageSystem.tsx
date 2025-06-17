
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Users, Search, User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// 회원 데이터 타입 정의
interface Member {
  id: string;
  name: string;
  phone: string;
  status: "active" | "inactive" | "expired";
  membershipType: string;
}

const MessageSystem = () => {
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState("single");
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  
  // 회원 데이터 불러오기 (실제로는 API 호출)
  useEffect(() => {
    // 목업 데이터
    const mockMembers: Member[] = [
      { id: "1", name: "김철수", phone: "010-1234-5678", status: "active", membershipType: "개인레슨 12회" },
      { id: "2", name: "이영희", phone: "010-2345-6789", status: "active", membershipType: "일반 회원권" },
      { id: "3", name: "박지성", phone: "010-3456-7890", status: "inactive", membershipType: "개인레슨 회원권" },
      { id: "4", name: "최민수", phone: "010-4567-8901", status: "expired", membershipType: "일반 회원권" },
      { id: "5", name: "정다영", phone: "010-5678-9012", status: "active", membershipType: "개인레슨 회원권" },
      { id: "6", name: "강현우", phone: "010-6789-0123", status: "active", membershipType: "일반 회원권" },
      { id: "7", name: "윤서연", phone: "010-7890-1234", status: "inactive", membershipType: "개인레슨 회원권" },
      { id: "8", name: "임재현", phone: "010-8901-2345", status: "active", membershipType: "일반 회원권" },
    ];
    
    setMembers(mockMembers);
  }, []);
  
  // 선택된 회원 정보 가져오기
  const selectedMember = members.find(member => member.id === selectedMemberId);

  const handleSendMessage = () => {
    // This would connect to the message service in a real application
    console.log("Message to send:", {
      recipient: selectedMember,
      message: messageText
    });
    // Show success toast or notification
    setMessageText("");
    setSelectedMemberId("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
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
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      placeholder="회원을 선택하세요"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearching(e.target.value.length > 0);
                      }}
                      onFocus={() => {
                        if (searchQuery) setIsSearching(true);
                      }}
                      onBlur={() => {
                        // 약간의 지연을 주어 항목 클릭이 가능하도록 함
                        setTimeout(() => setIsSearching(false), 200);
                      }}
                      className="flex h-10 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-2 text-sm ring-offset-background"
                    />
                    {isSearching && (
                      <div 
                        ref={searchResultsRef}
                        className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg overflow-hidden"
                      >
                        <div className="max-h-[300px] overflow-auto p-1">
                          {searchQuery.length > 0 ? (
                            members
                              .filter(member => 
                                member.name.includes(searchQuery) || 
                                member.phone.includes(searchQuery)
                              )
                              .map(member => (
                                <div 
                                  key={member.id}
                                  className={cn(
                                    "flex items-center justify-between w-full p-2 text-sm rounded-md cursor-pointer",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    member.id === selectedMemberId && "bg-accent/50"
                                  )}
                                  onClick={() => {
                                    setSelectedMemberId(member.id);
                                    setSearchQuery(`${member.name} (${member.phone})`);
                                    setIsSearching(false);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>{member.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{member.phone}</span>
                                    {member.id === selectedMemberId && (
                                      <Check className="h-4 w-4 text-primary ml-2" />
                                    )}
                                  </div>
                                </div>
                              ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground text-center">
                              회원 이름 또는 전화번호를 입력하세요
                            </div>
                          )}
                          {searchQuery.length > 0 && 
                            members.filter(member => 
                              member.name.includes(searchQuery) || 
                              member.phone.includes(searchQuery)
                            ).length === 0 && (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                검색 결과가 없습니다
                              </div>
                            )
                          }
                        </div>
                      </div>
                    )}
                  </div>
                  {selectedMember && (
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <span className={cn(
                        "inline-block w-2 h-2 rounded-full",
                        selectedMember.status === "active" ? "bg-green-500" : 
                        selectedMember.status === "inactive" ? "bg-amber-500" : "bg-red-500"
                      )}></span>
                      {selectedMember.membershipType} · 
                      {selectedMember.status === "active" ? "활성 회원" : 
                       selectedMember.status === "inactive" ? "휴면 회원" : "만료 회원"}
                    </div>
                  )}
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
                disabled={!messageText.trim() || !selectedMemberId}
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
                    <option value="lesson">개인레슨 회원</option>
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
                disabled={!messageText.trim() || !selectedMemberId}
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
