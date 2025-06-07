
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PostWriteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (postData: any) => void;
}

const PostWriteDialog = ({ open, onOpenChange, onSubmit }: PostWriteDialogProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const categories = {
    general: "일반",
    tips: "노하우",
    questions: "질문",
    announcements: "공지",
    events: "이벤트"
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !category) {
      alert("제목, 내용, 카테고리를 모두 입력해주세요.");
      return;
    }

    const postData = {
      title: title.trim(),
      content: content.trim(),
      category,
      author: "현재사용자", // 실제로는 로그인한 사용자 정보
      gymName: "내 헬스장", // 실제로는 사용자의 헬스장 정보
      location: "서울 강남구", // 실제로는 사용자의 위치 정보
      createdAt: new Date().toLocaleString("ko-KR"),
      views: 0,
      likes: 0,
      comments: 0
    };

    onSubmit?.(postData);
    
    // 폼 초기화
    setTitle("");
    setContent("");
    setCategory("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>새 글 작성</DialogTitle>
          <DialogDescription>
            헬스장 관장님들과 공유하고 싶은 내용을 작성해주세요.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category">카테고리</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categories).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              placeholder="내용을 입력하세요"
              className="min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit}>
            작성하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostWriteDialog;
