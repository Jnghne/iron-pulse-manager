
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, Reply, MoreHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Comment {
  id: number;
  author: string;
  gymName: string;
  location: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onAddReply: (commentId: number, content: string) => void;
  onLikeComment: (commentId: number) => void;
}

const CommentSection = ({ 
  comments, 
  onAddComment, 
  onAddReply, 
  onLikeComment 
}: CommentSectionProps) => {
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      toast({
        title: "입력 오류",
        description: "댓글을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    onAddComment(newComment);
    setNewComment("");
    toast({
      title: "댓글 작성 완료",
      description: "댓글이 성공적으로 등록되었습니다."
    });
  };

  const handleReplySubmit = (commentId: number) => {
    if (!replyContent.trim()) {
      toast({
        title: "입력 오류", 
        description: "답글을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    onAddReply(commentId, replyContent);
    setReplyContent("");
    setReplyingTo(null);
    toast({
      title: "답글 작성 완료",
      description: "답글이 성공적으로 등록되었습니다."
    });
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? "ml-8 mt-3" : ""} border-b border-gray-100 pb-4 last:border-0`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{comment.author}</span>
          <span className="text-muted-foreground">
            {comment.gymName} · {comment.location}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {comment.createdAt}
          </span>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <p className="text-sm mb-2 leading-relaxed">
        {comment.content}
      </p>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onLikeComment(comment.id)}
          className={comment.isLiked ? "text-blue-600" : ""}
        >
          <ThumbsUp className="h-3 w-3 mr-1" />
          {comment.likes}
        </Button>
        {!isReply && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
          >
            <Reply className="h-3 w-3 mr-1" />
            답글
          </Button>
        )}
      </div>

      {/* 답글 입력 폼 */}
      {replyingTo === comment.id && (
        <div className="mt-3 ml-8">
          <Textarea
            placeholder="답글을 입력하세요..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="mb-2"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleReplySubmit(comment.id)}>
              답글 등록
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setReplyingTo(null);
                setReplyContent("");
              }}
            >
              취소
            </Button>
          </div>
        </div>
      )}

      {/* 대댓글 목록 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 댓글 작성 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">댓글 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleCommentSubmit}>
                댓글 등록
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">댓글 {comments.length}개</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                첫 번째 댓글을 작성해보세요!
              </p>
            ) : (
              comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentSection;
