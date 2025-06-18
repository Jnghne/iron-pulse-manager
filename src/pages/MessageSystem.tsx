
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
  
  // 단체문자발송 관련 상태
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [excludedMemberIds, setExcludedMemberIds] = useState<Set<string>>(new Set());
  const [additionalMemberIds, setAdditionalMemberIds] = useState<Set<string>>(new Set());
  const [additionalSearchQuery, setAdditionalSearchQuery] = useState("");
  const [isAdditionalSearching, setIsAdditionalSearching] = useState(false);
  const additionalSearchResultsRef = useRef<HTMLDivElement>(null);
  
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
  
  // 수신자 그룹에 따른 회원 필터링
  const getGroupMembers = (groupType: string): Member[] => {
    switch (groupType) {
      case "all":
        return members;
      case "active":
        return members.filter(member => member.status === "active");
      case "lesson":
        return members.filter(member => member.membershipType.includes("개인레슨"));
      case "expired":
        return members.filter(member => member.status === "expired");
      default:
        return [];
    }
  };
  
  // 수신자 그룹 변경 처리
  const handleGroupChange = (groupType: string) => {
    setSelectedGroup(groupType);
    setExcludedMemberIds(new Set());
    setAdditionalMemberIds(new Set());
  };
  
  // 최종 수신자 목록 계산
  const getFinalRecipients = (): Member[] => {
    if (!selectedGroup) return [];
    
    const baseMembers = getGroupMembers(selectedGroup);
    const additionalMembers = members.filter(member => additionalMemberIds.has(member.id));
    
    const allMembers = [...baseMembers, ...additionalMembers];
    return allMembers.filter(member => !excludedMemberIds.has(member.id));
  };
  
  // 회원 제외/포함 토글
  const toggleMemberExclusion = (memberId: string) => {
    const newExcluded = new Set(excludedMemberIds);
    if (newExcluded.has(memberId)) {
      newExcluded.delete(memberId);
    } else {
      newExcluded.add(memberId);
    }
    setExcludedMemberIds(newExcluded);
  };
  
  // 추가 회원 토글
  const toggleAdditionalMember = (memberId: string) => {
    const newAdditional = new Set(additionalMemberIds);
    if (newAdditional.has(memberId)) {
      newAdditional.delete(memberId);
    } else {
      newAdditional.add(memberId);
    }
    setAdditionalMemberIds(newAdditional);
  };

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
                단일 문자 발송
              </TabsTrigger>
              <TabsTrigger value="bulk">
                <Users className="mr-2 h-4 w-4" />
                단체 문자 발송
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="single" className="space-y-4">
              <div className="grid gap-4">
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
                
                <div className="grid gap-2">
                  <label htmlFor="group" className="text-sm font-medium">
                    수신자 그룹
                  </label>
                  <select 
                    id="group" 
                    value={selectedGroup}
                    onChange={(e) => handleGroupChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  >
                    <option value="">수신자 그룹 선택</option>
                    <option value="all">전체 회원</option>
                    <option value="active">활성 회원</option>
                    <option value="lesson">개인레슨 회원</option>
                    <option value="expired">만료 임박 회원</option>
                  </select>
                </div>
                
                {selectedGroup && (
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        수신자 목록 ({getFinalRecipients().length}명)
                      </label>
                      <div className="text-xs text-muted-foreground">
                        기본 {getGroupMembers(selectedGroup).length}명
                        {excludedMemberIds.size > 0 && ` · 제외 ${excludedMemberIds.size}명`}
                        {additionalMemberIds.size > 0 && ` · 추가 ${additionalMemberIds.size}명`}
                      </div>
                    </div>
                    <div className="border rounded-md max-h-60 overflow-auto">
                      <div className="p-2 space-y-1">
                        {getGroupMembers(selectedGroup).map(member => {
                          const isExcluded = excludedMemberIds.has(member.id);
                          return (
                            <div 
                              key={member.id}
                              className={cn(
                                "flex items-center justify-between p-2 rounded-sm",
                                isExcluded ? "bg-red-50 text-red-700" : "hover:bg-accent"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className={cn("text-sm", isExcluded && "line-through")}>
                                  {member.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {member.phone}
                                </span>
                                <span className={cn(
                                  "inline-block w-2 h-2 rounded-full",
                                  member.status === "active" ? "bg-green-500" : 
                                  member.status === "inactive" ? "bg-amber-500" : "bg-red-500"
                                )}></span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleMemberExclusion(member.id)}
                                className={cn(
                                  "text-xs h-6 px-2",
                                  isExcluded ? "text-green-600 hover:text-green-700" : "text-red-600 hover:text-red-700"
                                )}
                              >
                                {isExcluded ? "포함" : "제외"}
                              </Button>
                            </div>
                          );
                        })}
                        
                        {additionalMemberIds.size > 0 && (
                          <>
                            <div className="border-t pt-2 mt-2">
                              <div className="text-xs font-medium text-muted-foreground mb-1">추가된 회원</div>
                              {members.filter(member => additionalMemberIds.has(member.id)).map(member => (
                                <div 
                                  key={member.id}
                                  className="flex items-center justify-between p-2 rounded-sm bg-green-50"
                                >
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-green-700">{member.name}</span>
                                    <span className="text-xs text-muted-foreground">{member.phone}</span>
                                    <span className={cn(
                                      "inline-block w-2 h-2 rounded-full",
                                      member.status === "active" ? "bg-green-500" : 
                                      member.status === "inactive" ? "bg-amber-500" : "bg-red-500"
                                    )}></span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleAdditionalMember(member.id)}
                                    className="text-xs h-6 px-2 text-red-600 hover:text-red-700"
                                  >
                                    제거
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        
                        <div className="border-t pt-2 mt-2">
                          <div className="text-xs font-medium text-muted-foreground mb-2">회원 추가</div>
                          <div className="relative mb-2">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Search className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <input
                              type="text"
                              placeholder="추가할 회원을 검색하세요"
                              value={additionalSearchQuery}
                              onChange={(e) => {
                                setAdditionalSearchQuery(e.target.value);
                                setIsAdditionalSearching(e.target.value.length > 0);
                              }}
                              onFocus={() => {
                                if (additionalSearchQuery) setIsAdditionalSearching(true);
                              }}
                              onBlur={() => {
                                setTimeout(() => setIsAdditionalSearching(false), 200);
                              }}
                              className="flex h-8 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-1 text-xs ring-offset-background"
                            />
                            {isAdditionalSearching && (
                              <div 
                                ref={additionalSearchResultsRef}
                                className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg overflow-hidden"
                              >
                                <div className="max-h-[200px] overflow-auto p-1">
                                  {additionalSearchQuery.length > 0 ? (
                                    members
                                      .filter(member => !getGroupMembers(selectedGroup).some(gm => gm.id === member.id))
                                      .filter(member => !additionalMemberIds.has(member.id))
                                      .filter(member => 
                                        member.name.includes(additionalSearchQuery) || 
                                        member.phone.includes(additionalSearchQuery)
                                      )
                                      .map(member => (
                                        <div 
                                          key={member.id}
                                          className="flex items-center justify-between w-full p-2 text-sm rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                          onClick={() => {
                                            toggleAdditionalMember(member.id);
                                            setAdditionalSearchQuery("");
                                            setIsAdditionalSearching(false);
                                          }}
                                        >
                                          <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>{member.name}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">{member.phone}</span>
                                            <span className={cn(
                                              "inline-block w-2 h-2 rounded-full",
                                              member.status === "active" ? "bg-green-500" : 
                                              member.status === "inactive" ? "bg-amber-500" : "bg-red-500"
                                            )}></span>
                                          </div>
                                        </div>
                                      ))
                                  ) : (
                                    <div className="p-2 text-xs text-muted-foreground text-center">
                                      회원 이름 또는 전화번호를 입력하세요
                                    </div>
                                  )}
                                  {additionalSearchQuery.length > 0 && 
                                    members
                                      .filter(member => !getGroupMembers(selectedGroup).some(gm => gm.id === member.id))
                                      .filter(member => !additionalMemberIds.has(member.id))
                                      .filter(member => 
                                        member.name.includes(additionalSearchQuery) || 
                                        member.phone.includes(additionalSearchQuery)
                                      ).length === 0 && (
                                      <div className="p-2 text-xs text-muted-foreground text-center">
                                        검색 결과가 없습니다
                                      </div>
                                    )
                                  }
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={() => {
                  const recipients = getFinalRecipients();
                  console.log("Bulk message to send:", {
                    recipients,
                    message: messageText,
                    count: recipients.length
                  });
                  setMessageText("");
                }} 
                disabled={!messageText.trim() || !selectedGroup || getFinalRecipients().length === 0}
                className="w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                단체 메시지 전송 ({selectedGroup ? getFinalRecipients().length : 0}명)
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageSystem;
