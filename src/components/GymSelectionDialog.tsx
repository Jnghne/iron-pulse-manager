
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, Star } from "lucide-react";

interface Gym {
  id: string;
  name: string;
  location: string;
  address: string;
  memberCount: number;
  rating: number;
  contractType: "premium" | "standard" | "basic";
}

// Mock data for B2B contracted gyms
const contractedGyms: Gym[] = [
  {
    id: "seoul-gangnam",
    name: "강남 피트니스 센터",
    location: "서울 강남구",
    address: "서울시 강남구 테헤란로 123",
    memberCount: 850,
    rating: 4.8,
    contractType: "premium"
  },
  {
    id: "seoul-hongdae",
    name: "홍대 스포츠 클럽",
    location: "서울 마포구",
    address: "서울시 마포구 홍익로 45",
    memberCount: 620,
    rating: 4.6,
    contractType: "standard"
  },
  {
    id: "busan-haeundae",
    name: "해운대 헬스 파크",
    location: "부산 해운대구",
    address: "부산시 해운대구 마린시티로 89",
    memberCount: 750,
    rating: 4.7,
    contractType: "premium"
  },
  {
    id: "daegu-dongseong",
    name: "동성로 피트니스",
    location: "대구 중구",
    address: "대구시 중구 동성로 234",
    memberCount: 480,
    rating: 4.5,
    contractType: "standard"
  },
  {
    id: "incheon-songdo",
    name: "송도 스포츠센터",
    location: "인천 연수구",
    address: "인천시 연수구 송도동 567",
    memberCount: 920,
    rating: 4.9,
    contractType: "premium"
  },
  {
    id: "gwangju-sangmu",
    name: "상무지구 헬스클럽",
    location: "광주 서구",
    address: "광주시 서구 상무대로 678",
    memberCount: 390,
    rating: 4.4,
    contractType: "basic"
  }
];

interface GymSelectionDialogProps {
  selectedGym: string;
  onGymSelect: (gymId: string, gymName: string) => void;
}

const GymSelectionDialog = ({ selectedGym, onGymSelect }: GymSelectionDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGyms = contractedGyms.filter(gym =>
    gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gym.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gym.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedGymData = contractedGyms.find(gym => gym.id === selectedGym);

  const handleGymSelect = (gym: Gym) => {
    onGymSelect(gym.id, gym.name);
    setIsOpen(false);
    setSearchTerm("");
  };

  const getContractTypeBadgeColor = (type: string) => {
    switch (type) {
      case "premium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "standard":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "basic":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="space-y-2">
        <Label>사업장 선택 *</Label>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            {selectedGymData ? (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{selectedGymData.name}</span>
                <Badge className={`text-xs ${getContractTypeBadgeColor(selectedGymData.contractType)}`}>
                  {selectedGymData.contractType}
                </Badge>
              </div>
            ) : (
              <span className="text-muted-foreground">사업장을 선택하세요</span>
            )}
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>사업장 선택</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 검색 영역 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="헬스장 이름, 지역, 주소로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 헬스장 목록 */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredGyms.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                검색 결과가 없습니다.
              </div>
            ) : (
              filteredGyms.map((gym) => (
                <div
                  key={gym.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedGym === gym.id 
                      ? "border-gym-primary bg-gym-primary/5" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleGymSelect(gym)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{gym.name}</h3>
                        <Badge className={`text-xs ${getContractTypeBadgeColor(gym.contractType)}`}>
                          {gym.contractType}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{gym.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{gym.memberCount}명</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{gym.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{gym.address}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GymSelectionDialog;
